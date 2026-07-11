import express from "express";
import path from "path";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createServer as createViteServer } from "vite";
import { generateText, streamText, generateObject } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const prisma = new PrismaClient();

const getAIProvider = () => {
  if (process.env.CLAUDE_API_KEY) {
    return createAnthropic({ apiKey: process.env.CLAUDE_API_KEY })("claude-3-5-sonnet-latest");
  }
  if (process.env.OPENAI_API_KEY) {
    return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })("gpt-4o");
  }
  if (process.env.GEMINI_API_KEY) {
    return createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })("gemini-2.5-pro");
  }
  throw new Error("No API keys configured for AI providers.");
};

async function startServer() {
  const app = express();
const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Get user profile
  app.get("/api/profile", async (req, res) => {
    try {
      let profile = await prisma.userProfile.findFirst();
      if (!profile) {
        profile = await prisma.userProfile.create({
          data: { currentCEFRLevel: "A0", currentLesson: 1 }
        });
      }
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  // Get current lesson or generate a new one
  app.post("/api/lesson/generate", async (req, res) => {
    try {
      let profile = await prisma.userProfile.findFirst();
      if (!profile) throw new Error("Profile not found");

      // Check if current lesson already exists
      let lesson = await prisma.lesson.findUnique({
        where: {
          number_cefrLevel: {
            number: profile.currentLesson,
            cefrLevel: profile.currentCEFRLevel
          }
        }
      });

      if (!lesson) {
        // Gather context for prompt
        const grammarMastery = await prisma.grammarMastery.findMany();
        const vocab = await prisma.vocabulary.findMany({ take: 50, orderBy: { nextReviewDate: 'asc' } });
        const lastLesson = await prisma.lesson.findFirst({ orderBy: { number: 'desc' }});

        // Prompt the AI to generate a structured lesson plan
        const model = getAIProvider();
        const { object } = await generateObject({
          model,
          schema: z.object({
            title: z.string(),
            cefrLevel: z.string(),
            review: z.object({
              vocabulary: z.array(z.string()),
              grammar: z.array(z.string()),
              pronunciationFocus: z.string()
            }),
            newGrammar: z.object({
              concept: z.string(),
              explanation: z.string(),
              examples: z.array(z.object({ es: z.string(), en: z.string() }))
            }),
            conversationContext: z.string(),
            conversationDialogue: z.array(z.object({
              speaker: z.string(),
              es: z.string(),
              en: z.string()
            })),
            exercises: z.array(z.object({
              type: z.enum(["translate", "fill_in", "respond"]),
              question: z.string(),
              expectedAnswer: z.string(),
              hint: z.string()
            })),
            speakingPractice: z.array(z.string())
          }),
          prompt: `Generate lesson number ${profile.currentLesson} for CEFR level ${profile.currentCEFRLevel}.
          This is an English to Spanish tutoring app. The student is at level ${profile.currentCEFRLevel}.
          They have recently learned: ${grammarMastery.map(g => g.concept).join(", ")}.
          Focus review on some of these words: ${vocab.map(v => v.wordEs).join(", ")}.
          Introduce exactly ONE new grammar concept naturally in a conversation.
          Make the conversation realistic (e.g. coffee shop, airport, etc.).
          Generate review items, new grammar, a dialogue, interactive exercises, and sentences for speaking practice.
          `
        });

        lesson = await prisma.lesson.create({
          data: {
            number: profile.currentLesson,
            cefrLevel: profile.currentCEFRLevel,
            content: JSON.stringify(object)
          }
        });
      }

      res.json(lesson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate lesson" });
    }
  });

  // Chat completions (simulated real-time tutor)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const model = getAIProvider();

      const result = await streamText({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional, highly encouraging Spanish tutor. You teach Spanish to English speakers. Have a conversation with the user in Spanish. If they make mistakes, gently correct them and provide the English translation for complex new words. Keep your responses conversational, concise, and focused on helping them improve their Spanish. Output responses primarily in Spanish with English translations where necessary.",
          },
          ...messages
        ],
      });

      result.pipeTextStreamToResponse(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Chat failed" });
    }
  });

  // Vocabulary Generator
  app.post("/api/vocabulary/generate", async (req, res) => {
    try {
      const { topic } = req.body;
      const model = getAIProvider();
      
      const { object } = await generateObject({
        model,
        schema: z.object({
          deck: z.array(z.object({
            es: z.string(),
            en: z.string(),
            example_es: z.string(),
            example_en: z.string()
          }))
        }),
        prompt: `Generate a vocabulary deck for a Spanish student about the topic: "${topic}". Include 10 common and useful words or phrases, along with their English translation, and a real-life example sentence in both languages.`
      });

      // Save to database
      for (const card of object.deck) {
        await prisma.vocabulary.upsert({
          where: { wordEs_wordEn: { wordEs: card.es, wordEn: card.en } },
          update: { topic },
          create: { wordEs: card.es, wordEn: card.en, topic }
        });
      }

      res.json(object.deck);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate vocabulary" });
    }
  });

  app.get("/api/vocabulary", async (req, res) => {
    try {
      const vocab = await prisma.vocabulary.findMany();
      res.json(vocab);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch vocabulary" });
    }
  });


  // Translation API
  app.post("/api/translate", async (req, res) => {
    try {
      const { text } = req.body;
      const model = getAIProvider();
      
      const { object } = await generateObject({
        model,
        schema: z.object({
          translation: z.string(),
          literalTranslation: z.string(),
          breakdown: z.array(z.object({
            source: z.string(),
            target: z.string(),
            grammar: z.string()
          })),
          explanation: z.string()
        }),
        prompt: `Act as an expert linguistics professor. Deeply translate the following text from English to Spanish (or Spanish to English): "${text}". Provide a natural translation, a literal translation, a word-by-word breakdown with grammar info, and a clear explanation of the grammar used.`
      });

      res.json(object);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
