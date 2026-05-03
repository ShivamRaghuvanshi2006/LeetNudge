import { Sparkles } from 'lucide-react';

export default function OverviewView({ isPremium }) {
  return (
    <div className="animate-fade-in w-full space-y-8">
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#8b5cf6] flex flex-col items-center">
          <div className="text-lg font-black uppercase mb-2">Efficiency Rating</div>
          <div className="text-6xl font-black text-[#8b5cf6]">A+</div>
        </div>
        <div className="bg-[#FFD93D] border-4 border-black p-8 shadow-[10px_10px_0px_#000] flex flex-col items-center">
          <div className="text-lg font-black uppercase mb-2">Total Solved</div>
          <div className="text-6xl font-black">142</div>
        </div>
        <div className="bg-[#4ade80] border-4 border-black p-8 shadow-[10px_10px_0px_#000] flex flex-col items-center">
          <div className="text-lg font-black uppercase mb-2">Current Streak</div>
          <div className="text-6xl font-black">12</div>
        </div>
      </div>

      <div className="bg-white border-8 border-black p-10 shadow-[20px_20px_0px_#000] relative overflow-hidden group">
        <div className="absolute right-[-5%] top-[-20%] text-[300px] font-black opacity-5 group-hover:scale-110 transition-transform duration-[2000ms]">DATA</div>
        <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
          <h3 className="text-3xl font-black uppercase">Real-time Telemetry</h3>
          {!isPremium && (
            <span className="bg-[#8b5cf6] text-white font-black text-xs px-3 py-1 uppercase tracking-wider border-2 border-black flex items-center gap-1">
              <Sparkles size={12} /> Pro Analytics Available
            </span>
          )}
        </div>
        <div className="w-full h-64 bg-[#FFFDF5] border-4 border-black flex items-end gap-2 p-6 relative">
          {Array.from({length: 24}).map((_, i) => (
            <div key={i} className="flex-1 bg-[#8b5cf6] border-2 border-black hover:bg-[#FF6B6B] transition-colors" style={{ height: `${Math.random() * 90 + 10}%` }}></div>
          ))}
          <div className="absolute top-4 left-6 font-bold text-xs bg-black text-white px-2">GITHUB_CONTRIBUTION_EMULATION_v.1</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#C4B5FD] border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
          <div className="font-black uppercase text-sm mb-2">Weekly Progress</div>
          <div className="flex gap-1">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-8 border-2 border-black ${i < 5 ? 'bg-[#4ade80]' : 'bg-white'}`}></div>
                <span className="text-xs font-black">{d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
          <div className="font-black uppercase text-sm mb-2">Top Patterns</div>
          {['Two Pointers', 'HashMap', 'DFS/BFS'].map((p, i) => (
            <div key={p} className="flex items-center justify-between py-1">
              <span className="font-bold">{p}</span>
              <div className="w-24 h-3 border-2 border-black bg-neo-bg">
                <div className="h-full bg-[#8b5cf6]" style={{width: `${90 - i * 20}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
