import { useState, useEffect } from "react";
import { Play, CheckCircle2, ChevronRight, Mic, Volume2, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DailyLessons() {
  const [profile, setProfile] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
      checkLesson(data);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const checkLesson = async (prof: any) => {
    try {
      // First try to generate/fetch
      setGenerating(true);
      const res = await fetch("/api/lesson/generate", { method: "POST" });
      const data = await res.json();
      if (data && data.content) {
        data.content = JSON.parse(data.content);
        setLesson(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center px-6">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
          <BrainCircuit className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2 tracking-tight">Generating Today's Lesson</h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          Analyzing your recent progress in level {profile?.currentCEFRLevel} and preparing conversational material...
        </p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">Could not load lesson. Please try again later.</p>
      </div>
    );
  }

  const steps = [
    { id: "review", label: "Review" },
    { id: "grammar", label: "New Concept" },
    { id: "conversation", label: "Conversation" },
    { id: "exercises", label: "Exercises" },
    { id: "speaking", label: "Speaking" },
    { id: "complete", label: "Complete" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Spaced Repetition Review</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <p className="text-sm text-neutral-500 font-medium mb-2">Vocabulary to Review</p>
                <ul className="space-y-1">
                  {lesson.content.review.vocabulary.map((v: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {v}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <p className="text-sm text-neutral-500 font-medium mb-2">Grammar to Review</p>
                <ul className="space-y-1">
                  {lesson.content.review.grammar.map((g: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Pronunciation Focus</p>
              <p className="mt-1 text-blue-900 dark:text-blue-200">{lesson.content.review.pronunciationFocus}</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">New Concept: {lesson.content.newGrammar.concept}</h3>
            <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
              {lesson.content.newGrammar.explanation}
            </p>
            <div className="space-y-3 mt-6">
              <p className="font-semibold text-neutral-500 uppercase text-xs tracking-wider">Examples</p>
              {lesson.content.newGrammar.examples.map((ex: any, i: number) => (
                <div key={i} className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg flex flex-col gap-1">
                  <span className="font-medium text-lg">{ex.es}</span>
                  <span className="text-neutral-500">{ex.en}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Conversation: {lesson.content.conversationContext}</h3>
            <div className="space-y-4">
              {lesson.content.conversationDialogue.map((line: any, i: number) => (
                <div key={i} className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-indigo-600">{line.speaker}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-neutral-800 rounded-2xl rounded-tl-none border border-neutral-100 dark:border-neutral-700 shadow-sm max-w-2xl mt-1">
                    <p className="font-medium text-lg">{line.es}</p>
                    <p className="text-sm text-neutral-500 mt-1">{line.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Interactive Exercises</h3>
            <div className="space-y-6">
              {lesson.content.exercises.map((ex: any, i: number) => (
                <div key={i} className="p-8 bg-white rounded-[32px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="inline-block px-3 py-1 bg-[#F0F0EE] text-black rounded-lg text-[10px] font-black uppercase tracking-wider mb-4">
                    {ex.type.replace('_', ' ')}
                  </span>
                  <p className="text-2xl font-black mb-6">{ex.question}</p>
                  <input 
                    type="text" 
                    placeholder="Type your answer here..." 
                    className="w-full p-4 rounded-2xl border-2 border-[#E5E5E1] bg-[#FBFBF9] focus:outline-none focus:border-black font-bold transition-shadow"
                  />
                  <p className="text-xs text-gray-400 font-bold mt-4 flex items-center gap-1">
                    HINT: {ex.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Mic className="w-6 h-6 text-indigo-600" /> Speaking Practice
            </h3>
            <p className="text-neutral-500">Read these sentences aloud to practice your pronunciation.</p>
            <div className="space-y-4">
              {lesson.content.speakingPractice.map((sentence: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <p className="font-medium text-lg">{sentence}</p>
                  <div className="flex gap-2">
                    <button className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-sm">
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Lesson Complete!</h2>
              <p className="text-neutral-500 max-w-md mx-auto">
                Excellent work! You've completed lesson {lesson.number}. Your progress has been saved and your streak is updated.
              </p>
            </div>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-all active:scale-95 mt-4">
              Return to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-10 py-8 border-b border-[#E5E5E1] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Current Track</span>
              <div className="h-px w-24 bg-[#E5E5E1]"></div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none m-0">{lesson.content.title}</h1>
            <p className="mt-4 text-xl font-medium text-gray-500">Level {profile?.currentCEFRLevel} • Lesson {profile?.currentLesson}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-5xl font-black">{Math.round((currentStep / (steps.length - 1)) * 100)}<span className="text-2xl font-bold opacity-30">%</span></div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Lesson Progress</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {currentStep < steps.length - 1 && (
        <div className="p-8 border-t border-[#E5E5E1] bg-white mt-auto sticky bottom-0">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="text-gray-500 text-xs font-black uppercase tracking-wider">
              Step {currentStep + 1} of {steps.length - 1}
            </p>
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all active:scale-95"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { cn } from "../lib/utils";
