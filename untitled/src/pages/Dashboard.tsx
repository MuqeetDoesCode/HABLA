export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-10 py-8 border-b border-[#E5E5E1] bg-white sticky top-0 z-10">
        <h1 className="text-4xl font-black tracking-tight">Progress Dashboard</h1>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">Track your journey to fluency</p>
      </header>

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="bg-white p-8 rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Current Level</p>
              <h2 className="text-8xl font-black text-[#F97316] tracking-tighter mt-2">A1</h2>
              <p className="text-gray-600 mt-2 font-bold text-lg">Beginner</p>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-bold">Progress to A2</span>
                <span className="text-gray-500 font-bold">24%</span>
              </div>
              <div className="w-full h-3 bg-[#F0F0EE] rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: '24%' }} />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
            <StatCard label="Daily Streak" value="12" suffix="days" />
            <StatCard label="Words Learned" value="340" />
            <StatCard label="Study Time" value="14" suffix="hours" />
            <StatCard label="Lessons Completed" value="28" />
          </div>

          {/* Activity Graph placeholder */}
          <div className="col-span-1 md:col-span-3 bg-white p-8 rounded-[40px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-4">
             <h3 className="text-2xl font-black tracking-tight mb-8">Learning Activity</h3>
             <div className="h-48 w-full flex items-end gap-3">
                {[40, 70, 45, 90, 65, 80, 100, 30, 50, 85, 60, 75, 40, 95].map((h, i) => (
                   <div key={i} className="flex-1 bg-[#F0F0EE] hover:bg-[#F97316] transition-colors rounded-t-xl" style={{ height: `${h}%` }} />
                ))}
             </div>
             <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>14 days ago</span>
                <span>Today</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string, value: string, suffix?: string }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border-2 border-black flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="mt-4">
        <p className="text-4xl font-black leading-none">{value}</p>
        {suffix && <p className="text-xs font-bold text-gray-500 mt-1">{suffix}</p>}
      </div>
    </div>
  );
}
