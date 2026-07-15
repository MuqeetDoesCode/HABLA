import { useState, useEffect } from "react";
import { Search, Plus, Play, Brain, Sparkles, Loader2 } from "lucide-react";

export default function Vocabulary() {
  const [vocab, setVocab] = useState<any[]>([]);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchVocab();
  }, []);

  const fetchVocab = async () => {
    try {
     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocabulary`);
      const data = await res.json();
      setVocab(data);
    } catch (e) {
      console.error(e);
    }
  };

  const generateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setGenerating(true);
    try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vocabulary/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ topic })
});

const data = await res.json();

console.log("Vocabulary response:", data);

if (!res.ok) {
  throw new Error(data.error || "Unknown error");
}
      setTopic("");
      fetchVocab();
    } catch (e: any) {
  console.error("Vocabulary error:", e);
  alert(e.message);
}
    finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-10 py-8 border-b border-[#E5E5E1] bg-white sticky top-0 z-10 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Vocabulary</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">Master words with spaced repetition</p>
        </div>
        <form onSubmit={generateDeck} className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Topic (e.g. Football)"
              className="w-full pl-12 pr-4 py-3 bg-[#F0F0EE] border-2 border-transparent focus:border-black rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none transition-colors"
            />
          </div>
          <button 
            type="submit"
            disabled={generating || !topic.trim()}
            className="px-6 py-3 bg-black hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:hover:scale-100 text-white rounded-2xl text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] disabled:shadow-none"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate AI Deck
          </button>
        </form>
      </header>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vocab.length === 0 && !generating && (
            <div className="col-span-full py-12 flex flex-col items-center text-center">
              <Brain className="w-12 h-12 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Your vocabulary is empty</h3>
              <p className="text-neutral-500 max-w-sm mt-1">Generate a custom deck using AI or complete daily lessons to learn new words.</p>
            </div>
          )}
          {vocab.map(v => (
            <div key={v.id} className="bg-white border-2 border-black rounded-[32px] p-6 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-[#F0F0EE] hover:bg-black text-gray-500 hover:text-white rounded-xl transition-colors">
                     <Play className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] font-black text-[#F97316] uppercase tracking-wider mb-2">{v.topic || 'General'}</p>
                <h3 className="text-3xl font-black text-black">{v.wordEs}</h3>
                <p className="text-gray-500 font-bold mt-1 text-lg">{v.wordEn}</p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-[#E5E5E1] flex justify-between items-center">
                <div className="flex flex-col w-full">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Mastery</span>
                   </div>
                   <div className="w-full h-2 bg-[#F0F0EE] rounded-full overflow-hidden">
                      <div className="h-full bg-black" style={{ width: `${Math.min(100, v.repetitions * 20)}%` }} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
