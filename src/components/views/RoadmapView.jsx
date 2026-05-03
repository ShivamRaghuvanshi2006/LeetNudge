import { useState, useEffect } from 'react';
import { PlayCircle, X, CheckCircle, Lock, Layout } from 'lucide-react';
import { dsaTopics } from '../../data/dsaSheet';
import { playClick, playSuccess } from '../../utils/sounds';
import HintSystem from '../HintSystem';
import { markRevision, getRevisionState } from '../../utils/revisionStore';
import { addXp } from '../../utils/progressionStore';

export default function RoadmapView({ isPremium, onShowPaywall }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [revisionState, setRevisionState] = useState(getRevisionState());

  // Function to refresh state
  const refreshState = () => setRevisionState(getRevisionState());

  // Calculate Node coordinates for a spiral/circular visual
  const centerX = 400;
  const centerY = 400;
  const nodes = dsaTopics.map((topic, i) => {
    // Spiral formula
    const angle = i * 0.8;
    const radius = 80 + i * 18;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      ...topic,
      id: i
    };
  });

  const getTopicProgress = (topicIdx, topic) => {
    const all = [...topic.easy, ...topic.medium, ...topic.hard];
    let total = all.length;
    let completed = 0;
    
    // Read from revisionStore using key format: `${topicIdx}-${diff}-${probIdx}`
    ['easy','medium','hard'].forEach(diff => {
      topic[diff].forEach((_, pi) => {
        const key = `${topicIdx}-${diff}-${pi}`;
        if (revisionState.problemLogs[key]?.status === 'solved') completed++;
      });
    });
    return { completed, total };
  };

  const handleSolve = (topicIdx, diff, pIdx) => {
    const key = `${topicIdx}-${diff}-${pIdx}`;
    const log = revisionState.problemLogs[key];
    const isSolved = log?.status === 'solved';
    
    if (isSolved) {
      // Revert for demo purposes
      markRevision(key, false);
      playClick();
    } else {
      markRevision(key, true);
      addXp(20);
      playSuccess();
    }
    refreshState();
  };

  const formatURL = (name) => `https://leetcode.com/problemset/all/?search=${encodeURIComponent(name)}`;
  const diffColor = { easy: '#4ade80', medium: '#FFD93D', hard: '#FF6B6B' };

  return (
    <div className="relative w-full h-full flex bg-[#FFFDF5] border-4 border-black overflow-hidden shadow-[10px_10px_0px_#8b5cf6]">
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto relative p-8">
        <div className="absolute top-4 left-4 bg-white border-4 border-black px-4 py-2 font-black uppercase text-xl shadow-[4px_4px_0px_#000] z-10 flex items-center gap-2">
          <Layout size={24} /> Skill Tree
        </div>

        <div className="min-w-[800px] min-h-[800px] relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw lines connecting nodes */}
            {nodes.map((node, i) => {
              if (i === 0) return null;
              const prev = nodes[i - 1];
              return (
                <line 
                  key={`line-${i}`}
                  x1={prev.x} y1={prev.y} 
                  x2={node.x} y2={node.y}
                  stroke="#000" strokeWidth="4" strokeDasharray="8 8"
                />
              );
            })}
          </svg>

          {nodes.map((node, i) => {
            const { completed, total } = getTopicProgress(i, dsaTopics[i]);
            const isFinished = total > 0 && completed === total;
            const isLocked = i > 0 && getTopicProgress(i-1, dsaTopics[i-1]).completed === 0;

            return (
              <div 
                key={i}
                onClick={() => {
                  if (!isLocked) {
                    setSelectedTopic(i);
                    playClick();
                  }
                }}
                className={`absolute w-24 h-24 -ml-12 -mt-12 rounded-full border-4 border-black flex flex-col items-center justify-center transition-transform hover:scale-110 shadow-[4px_4px_0px_#000] cursor-pointer
                  ${isLocked ? 'bg-gray-300 opacity-50 cursor-not-allowed' : isFinished ? 'bg-[#4ade80]' : 'bg-white'}`}
                style={{ left: node.x, top: node.y }}
              >
                <span className="text-3xl">{isLocked ? <Lock size={28} /> : node.icon}</span>
                <span className="font-black text-[10px] uppercase text-center mt-1 leading-tight px-1 bg-white border-2 border-black -mb-8 z-10 whitespace-nowrap">
                  {node.topic}
                </span>
                {!isLocked && (
                  <span className="absolute -top-3 -right-3 bg-black text-white text-[10px] font-black px-1.5 py-0.5 border-2 border-white rounded-full">
                    {completed}/{total}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Panel */}
      {selectedTopic !== null && (
        <div className="w-[450px] bg-white border-l-4 border-black shadow-[-8px_0px_0px_rgba(0,0,0,0.1)] flex flex-col z-20 shrink-0 transform transition-transform">
          <div className="bg-[#8b5cf6] p-4 border-b-4 border-black text-white flex justify-between items-center relative overflow-hidden">
             
            <div className="relative z-10 flex flex-col gap-1">
              <span className="font-black uppercase text-3xl leading-tight" style={{textShadow:"2px 2px 0px #000"}}>
                {dsaTopics[selectedTopic].icon} {dsaTopics[selectedTopic].topic}
              </span>
              <span className="font-bold text-xs bg-black px-2 py-0.5 inline-block w-max border-2 border-white">Topic {selectedTopic + 1}</span>
            </div>
            <button onClick={() => setSelectedTopic(null)} className="p-2 bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none z-10">
              <X size={20} className="stroke-[3px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Concept / Video Area */}
            <div className="bg-neo-bg border-4 border-black p-4 shadow-[4px_4px_0px_#000]">
              <h4 className="font-black uppercase text-lg mb-2 border-b-2 border-black pb-1">Concept Lecture</h4>
              <p className="text-sm font-bold mb-4">Master the foundational patterns of {dsaTopics[selectedTopic].topic}. Ensure you understand the underlying mechanics before solving.</p>
              <a 
                href={`https://www.youtube.com/results?search_query=DSA+${encodeURIComponent(dsaTopics[selectedTopic].topic)}+lecture`}
                target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B6B] text-white font-black uppercase border-4 border-black py-3 shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
              >
                <PlayCircle size={20} /> Watch Masterclass
              </a>
            </div>

             {/* Practice List */}
             <div>
              <h4 className="font-black uppercase text-xl mb-4 flex justify-between items-end border-b-4 border-black pb-2">
                <span>Practice Arena</span>
                <span className="text-xs bg-black text-white px-2 py-1">XP Mode</span>
              </h4>
              
              <div className="space-y-4">
                {['easy', 'medium', 'hard'].map(diff => (
                  dsaTopics[selectedTopic][diff].length > 0 && (
                    <div key={diff}>
                      <h5 className="font-black uppercase text-sm mb-2 px-2 py-1 border-2 border-black inline-block shadow-[2px_2px_0px_#000]" style={{ background: diffColor[diff] }}>
                        {diff}
                      </h5>
                      <div className="flex flex-col gap-2">
                        {dsaTopics[selectedTopic][diff].map((prob, pIdx) => {
                           const key = `${selectedTopic}-${diff}-${pIdx}`;
                           const isDone = revisionState.problemLogs[key]?.status === 'solved';
                           return (
                             <div key={pIdx}>
                               <div className={`flex items-center gap-3 p-3 border-2 border-black ${isDone ? 'bg-[#4ade80]/20' : 'bg-white'}`}>
                                  <button onClick={() => handleSolve(selectedTopic, diff, pIdx)} className={`w-6 h-6 border-2 border-black flex items-center justify-center shrink-0 ${isDone ? 'bg-[#4ade80]' : 'bg-white'}`}>
                                    {isDone && <CheckCircle size={14} />}
                                  </button>
                                  <a href={formatURL(prob.name)} target="_blank" rel="noreferrer" className="flex-1 font-bold text-sm hover:underline hover:text-[#8b5cf6] truncate">
                                    {prob.name}
                                  </a>
                               </div>
                               {!isDone && pIdx === 0 && ( // Just an example, normally expand when clicked
                                  <div className="ml-8">
                                    <HintSystem problemName={prob.name} />
                                  </div>
                               )}
                             </div>
                           );
                        })}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
