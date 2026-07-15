import { useEffect, useState } from "react";

interface Profile {
  currentCEFRLevel: string;
  currentLesson: number;
  dailyStreak: number;
  longestStreak: number;
  totalStudyTime: number;
  wordsLearned: number;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`
      );

      const data = await res.json();

      console.log("Dashboard profile:", data);

      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = () => {
    if (!profile) return 0;

    // Approximation:
    // 20 lessons per CEFR level
    return Math.min(
      100,
      ((profile.currentLesson - 1) % 20) * 5
    );
  };

  const getNextLevel = () => {
    const levels = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];

    const currentIndex = levels.indexOf(
      profile?.currentCEFRLevel || "A0"
    );

    return levels[currentIndex + 1] || "Mastery";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-xl font-bold">
        Loading dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full text-xl font-bold">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBF9]">
      <header className="px-6 md:px-10 py-8 border-b border-[#E5E5E1] bg-white sticky top-0 z-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Progress Dashboard
        </h1>

        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">
          Track your journey to fluency
        </p>
      </header>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Current Level Card */}
          <div className="bg-white p-8 rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">

            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Current Level
              </p>

              <h2 className="text-7xl md:text-8xl font-black text-[#F97316] tracking-tighter mt-2">
                {profile.currentCEFRLevel}
              </h2>

              <p className="text-gray-600 mt-2 font-bold text-lg">
                Spanish Learner
              </p>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-bold">
                  Progress to {getNextLevel()}
                </span>

                <span className="text-gray-500 font-bold">
                  {getLevelProgress()}%
                </span>
              </div>

              <div className="w-full h-3 bg-[#F0F0EE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{
                    width: `${getLevelProgress()}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">

            <StatCard
              label="Daily Streak"
              value={String(profile.dailyStreak)}
              suffix="days"
            />

            <StatCard
              label="Longest Streak"
              value={String(profile.longestStreak)}
              suffix="days"
            />

            <StatCard
              label="Words Learned"
              value={String(profile.wordsLearned)}
            />

            <StatCard
              label="Study Time"
              value={String(profile.totalStudyTime)}
              suffix="minutes"
            />

            <StatCard
              label="Current Lesson"
              value={String(profile.currentLesson)}
            />

            <StatCard
              label="Lessons Completed"
              value={String(
                Math.max(0, profile.currentLesson - 1)
              )}
            />
          </div>

          {/* Activity Graph */}
          <div className="col-span-1 md:col-span-3 bg-white p-8 rounded-[40px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-4">

            <h3 className="text-2xl font-black tracking-tight mb-8">
              Learning Activity
            </h3>

            <div className="h-48 w-full flex items-end gap-2">
              {Array.from({ length: 14 }).map((_, i) => {
                const active =
                  i >= 14 - profile.dailyStreak;

                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-xl transition-all ${
                      active
                        ? "bg-[#F97316]"
                        : "bg-[#F0F0EE]"
                    }`}
                    style={{
                      height: active
                        ? `${50 + Math.random() * 50}%`
                        : "15%"
                    }}
                  />
                );
              })}
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

function StatCard({
  label,
  value,
  suffix
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-[32px] border-2 border-black flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
        {label}
      </span>

      <div className="mt-4">
        <p className="text-4xl font-black leading-none">
          {value}
        </p>

        {suffix && (
          <p className="text-xs font-bold text-gray-500 mt-1">
            {suffix}
          </p>
        )}
      </div>

    </div>
  );
}
