import { useState } from "react";
import { ArrowRightLeft, Sparkles, Volume2 } from "lucide-react";
import { generateObject } from "ai";
import { z } from "zod";

export default function Translator() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-10 py-8 border-b border-[#E5E5E1] bg-white sticky top-0 z-10">
        <h1 className="text-4xl font-black tracking-tight">AI Translator</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">Deep contextual translations with grammar breakdown</p>
      </header>

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="flex items-center gap-4 px-8 py-6 border-b-2 border-[#E5E5E1] bg-[#F0F0EE]">
              <span className="font-black text-sm text-gray-500 uppercase tracking-wider">DETECT LANGUAGE</span>
              <ArrowRightLeft className="w-5 h-5 text-gray-400" />
              <span className="font-black text-sm text-[#F97316] uppercase tracking-wider">SPANISH / ENGLISH</span>
            </div>
            
            <div className="p-8">
              <textarea 
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type text to translate..."
                className="w-full h-40 bg-transparent border-none focus:outline-none resize-none text-3xl font-black placeholder:text-gray-300 placeholder:font-bold"
              />
            </div>
            
            <div className="px-8 py-6 border-t-2 border-[#E5E5E1] flex justify-end">
              <button 
                onClick={handleTranslate}
                disabled={loading || !text.trim()}
                className="px-8 py-4 bg-black disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-wider flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Deep Translate
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-12 space-y-8">
              <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-sm font-black text-[#F97316] uppercase tracking-widest">Natural Translation</h3>
                  <button className="text-gray-400 hover:text-black hover:bg-[#F0F0EE] p-2 rounded-xl transition-colors"><Volume2 className="w-6 h-6" /></button>
                </div>
                <p className="text-4xl font-black text-black leading-tight">{result.translation}</p>
                <p className="text-xl font-bold text-gray-500 mt-4">{result.literalTranslation && `LITERAL: ${result.literalTranslation}`}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Word by Word Breakdown</h3>
                  <div className="space-y-4">
                    {result.breakdown?.map((word: any, i: number) => (
                      <div key={i} className="flex justify-between items-baseline border-b-2 border-[#E5E5E1] pb-4">
                        <span className="font-black text-2xl text-black">{word.source}</span>
                        <div className="text-right">
                          <span className="text-[#F97316] font-black text-xl">{word.target}</span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mt-1">{word.grammar}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Grammar Explanation</h3>
                  <p className="text-lg font-medium text-black leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
