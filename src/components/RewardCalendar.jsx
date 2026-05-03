import { useState, useEffect } from 'react';
import { Calendar, Gift, Flame, Sparkles } from 'lucide-react';
import { getProgressionState, processDailyLogin } from '../utils/progressionStore';

export default function RewardCalendar() {
  const [progression, setProgression] = useState(getProgressionState());
  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progression.lastLogin === today) {
       setClaimedToday(true);
    }
  }, [progression.lastLogin]);

  const handleClaim = () => {
    const newState = processDailyLogin();
    setProgression(newState);
    setClaimedToday(true);
  };

  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const currentStreakMod = progression.currentStreak % 7;
  const isMilestone = (index) => index === 2 || index === 6; // Day 3 and 7

  return (
    <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
        <h3 className="font-black uppercase tracking-wider flex items-center gap-2">
          <Calendar size={18} /> Daily Rewards
        </h3>
        <div className="flex items-center gap-1 bg-[#FFD93D] px-2 py-0.5 border-2 border-black font-black text-sm">
          <Flame size={14} className="text-[#EF4444]" />
          <span>{progression.currentStreak} Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 flex-1">
        {days.slice(0, 4).map((d, i) => (
          <div key={i} className={`flex flex-col items-center justify-center p-2 border-2 border-black font-black text-xs transition-transform ${currentStreakMod > i ? 'bg-[#4ade80] opacity-50' : currentStreakMod === i && !claimedToday ? 'bg-[#FFD93D] animate-pulse cursor-pointer hover:scale-105' : 'bg-neo-bg'}`} onClick={() => { if(currentStreakMod === i && !claimedToday) handleClaim() }}>
            <span className="mb-1">{d}</span>
            <Gift size={16} className={isMilestone(i) ? "text-[#8b5cf6]" : "text-black"} />
            {isMilestone(i) && <span className="text-[8px] uppercase mt-1 bg-black text-white px-1">Badge!</span>}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2 flex-1">
        {days.slice(4, 7).map((d, i) => (
          <div key={i+4} className={`flex flex-col items-center justify-center p-2 border-2 border-black font-black text-xs transition-transform ${currentStreakMod > i+4 ? 'bg-[#4ade80] opacity-50' : currentStreakMod === i+4 && !claimedToday ? 'bg-[#FFD93D] animate-pulse cursor-pointer hover:scale-105' : 'bg-neo-bg'}`} onClick={() => { if(currentStreakMod === i+4 && !claimedToday) handleClaim() }}>
            <span className="mb-1">{d}</span>
            <Gift size={16} className={isMilestone(i+4) ? "text-[#FF6B6B]" : "text-black"} />
            {isMilestone(i+4) && <span className="text-[8px] uppercase mt-1 bg-[#FF6B6B] text-white px-1">Cosmetic!</span>}
          </div>
        ))}
      </div>

      {!claimedToday ? (
        <button onClick={handleClaim} className="w-full mt-4 py-2 bg-[#8b5cf6] text-white font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
          Claim Today <Sparkles size={16} />
        </button>
      ) : (
        <div className="w-full mt-4 py-2 bg-[#4ade80] font-black uppercase tracking-widest border-4 border-black flex items-center justify-center gap-2 opacity-80">
          Claimed
        </div>
      )}
    </div>
  );
}
