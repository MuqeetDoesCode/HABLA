import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, Loader2, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import ReactMarkdown from 'react-markdown';

export default function ChatTutor() {
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'assistant', content: '¡Hola! Soy tu profesor de español. ¿De qué te gustaría hablar hoy? (Hello! I am your Spanish tutor. What would you like to talk about today?)' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    // Only speak the Spanish part (heuristic: before English translation usually in parens)
    const spanishText = text.replace(/\\(.*?\\)/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(spanishText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) throw new Error("Failed to chat");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      // Create empty assistant message
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }]);

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          text += chunk;
          
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1].content = text;
            return copy;
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-10 py-6 border-b border-[#E5E5E1] bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#F97316]" /> Conversational Tutor
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Practice speaking in real-time scenarios</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-[#F0F0EE] text-black border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Online
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map(m => (
            <div key={m.id} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
              <div className="flex items-baseline gap-2 mb-2 px-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  {m.role === 'user' ? 'You' : 'Tutor'}
                </span>
              </div>
              <div className={cn(
                "p-5 rounded-[24px] max-w-[85%] relative group text-base font-medium",
                m.role === 'user' 
                  ? "bg-black text-white rounded-tr-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]" 
                  : "bg-white border-2 border-black text-black rounded-tl-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}>
                <div className={cn("markdown-body", m.role === 'user' && "text-white")}>
                   <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                {m.role === 'assistant' && (
                  <button 
                    onClick={() => speakText(m.content)}
                    className="absolute -right-14 bottom-2 p-3 text-gray-400 hover:text-black hover:bg-[#F0F0EE] rounded-xl opacity-0 group-hover:opacity-100 transition-all border-2 border-transparent hover:border-black"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-none w-20 flex justify-center items-center h-12 shadow-sm">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-6 md:p-8 bg-white border-t border-[#E5E5E1] shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-3">
            <button
              type="button"
              className={cn(
                "p-4 rounded-2xl flex-shrink-0 transition-all border-2",
                isListening 
                  ? "bg-red-500 border-red-600 text-white animate-pulse" 
                  : "bg-[#F0F0EE] border-[#F0F0EE] text-black hover:border-black"
              )}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your reply in Spanish..."
                className="w-full bg-[#FBFBF9] border-2 border-[#E5E5E1] focus:border-black rounded-2xl px-5 py-4 pr-16 focus:outline-none resize-none overflow-hidden font-bold transition-colors"
                rows={1}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) handleSubmit(e as any);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-3 bottom-3 p-3 bg-black text-white rounded-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-transform"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
             {["At a restaurant", "Checking into a hotel", "Meeting a friend", "Job interview"].map(topic => (
                <button key={topic} type="button" className="text-[10px] font-black px-4 py-2 rounded-xl border-2 border-[#E5E5E1] hover:border-black hover:bg-black hover:text-white whitespace-nowrap transition-colors uppercase tracking-wider">
                  Roleplay: {topic}
                </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
