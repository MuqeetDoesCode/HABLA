export default function Settings() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-10 py-8 border-b border-[#E5E5E1] bg-white sticky top-0 z-10">
        <h1 className="text-4xl font-black tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">Manage your learning preferences</p>
      </header>

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-10">
          
          <section className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="p-8 border-b-2 border-[#E5E5E1] bg-[#F0F0EE]">
                <h2 className="font-black text-2xl uppercase tracking-wider">AI Provider Settings</h2>
                <p className="text-sm text-gray-500 font-bold mt-2">Manage your API keys for lesson generation</p>
             </div>
             <div className="p-8 space-y-6">
                <div>
                   <label className="block text-sm font-black text-black uppercase tracking-wider mb-3">Google Gemini API Key</label>
                   <input type="password" value="••••••••••••••••••••••••" readOnly className="w-full bg-[#F0F0EE] border-2 border-transparent rounded-2xl p-4 text-gray-500 font-bold focus:outline-none" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-3">Configured via AI Studio securely.</p>
                </div>
                <div>
                   <label className="block text-sm font-black text-black uppercase tracking-wider mb-3">Claude API Key (Preferred)</label>
                   <input type="password" placeholder="sk-ant-..." className="w-full bg-[#FBFBF9] border-2 border-[#E5E5E1] rounded-2xl p-4 focus:border-black focus:outline-none font-bold transition-colors" />
                </div>
                <div>
                   <label className="block text-sm font-black text-black uppercase tracking-wider mb-3">OpenAI API Key (Fallback)</label>
                   <input type="password" placeholder="sk-..." className="w-full bg-[#FBFBF9] border-2 border-[#E5E5E1] rounded-2xl p-4 focus:border-black focus:outline-none font-bold transition-colors" />
                </div>
                <button className="px-8 py-4 mt-4 bg-black text-white rounded-2xl font-black uppercase tracking-wider hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                   Save API Keys
                </button>
             </div>
          </section>

          <section className="bg-white border-2 border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <div className="p-8 border-b-2 border-[#E5E5E1] bg-[#F0F0EE]">
                <h2 className="font-black text-2xl uppercase tracking-wider">Study Preferences</h2>
             </div>
             <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                      <p className="font-black text-lg text-black uppercase tracking-wider">Daily Goal</p>
                      <p className="text-xs font-bold text-gray-500 mt-1">How many minutes per day?</p>
                   </div>
                   <select className="bg-[#FBFBF9] border-2 border-[#E5E5E1] rounded-xl p-3 px-6 font-bold focus:border-black focus:outline-none">
                      <option>10 mins</option>
                      <option selected>20 mins</option>
                      <option>30 mins</option>
                      <option>60 mins</option>
                   </select>
                </div>
                <div className="flex items-center justify-between">
                   <div>
                      <p className="font-black text-lg text-black uppercase tracking-wider">Voice Gender</p>
                      <p className="text-xs font-bold text-gray-500 mt-1">For Text-to-Speech pronunciation</p>
                   </div>
                   <select className="bg-[#FBFBF9] border-2 border-[#E5E5E1] rounded-xl p-3 px-6 font-bold focus:border-black focus:outline-none">
                      <option>Female (Default)</option>
                      <option>Male</option>
                   </select>
                </div>
             </div>
          </section>

          <section className="bg-white border-2 border-red-500 rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
             <div className="p-8">
                <h2 className="font-black text-2xl text-red-500 uppercase tracking-wider">Danger Zone</h2>
                <p className="text-sm font-bold text-red-400 mt-2 mb-6 uppercase tracking-wider">These actions cannot be undone.</p>
                <button className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-wider hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(239,68,68,0.5)] transition-all">
                   Reset All Progress
                </button>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}
