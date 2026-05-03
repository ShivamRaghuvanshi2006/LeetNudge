import { useState, useEffect } from 'react';
import { PlayCircle, Lightbulb, Check, Lock, Trophy, X } from 'lucide-react';
import { dsaTopics } from '../../data/dsaSheet';
import { playClick, playSuccess, playError } from '../../utils/sounds';
import { getRevisionState, markRevision } from '../../utils/revisionStore';
import { addXp } from '../../utils/progressionStore';
import HintSystem from '../HintSystem';
import { motion, AnimatePresence } from 'framer-motion';

export default function DSAView({ isPremium, onShowPaywall }) {
  const [revisionState, setRevisionState] = useState(getRevisionState());
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeHint, setActiveHint] = useState(null);

  const refreshState = () => setRevisionState(getRevisionState());

  const toggleProblem = (topicIdx, diff, probIdx) => {
    const key = `${topicIdx}-${diff}-${probIdx}`;
    const log = revisionState.problemLogs[key];
    const isDone = log?.status === 'solved';

    if (isDone) {
      markRevision(key, false);
      playClick();
    } else {
      markRevision(key, true);
      addXp(20);
      playSuccess();
    }
    refreshState();
  };

  const getTopicProgress = (topicIdx, topic) => {
    const all = [...topic.easy, ...topic.medium, ...topic.hard];
    let total = all.length;
    let completed = 0;
    ['easy','medium','hard'].forEach(diff => {
      topic[diff].forEach((_, pi) => {
        const key = `${topicIdx}-${diff}-${pi}`;
        if(revisionState.problemLogs[key]?.status === 'solved') completed++;
      });
    });
    return { completed, total };
  };

  const formatURL = (name) => {
    return `https://leetcode.com/problemset/all/?search=${encodeURIComponent(name)}`;
  };

  const diffColor = { easy: '#4ade80', medium: '#FFD93D', hard: '#FF6B6B' };

  return (
    <div className="animate-fade-in relative max-w-5xl mx-auto pb-32">
      <div className="bg-[#FFD93D] border-4 border-black shadow-[10px_10px_0px_#000] p-6 mb-12 text-center relative z-10">
        <h3 className="text-4xl font-black uppercase tracking-tight">The Algorithm Journey</h3>
        <p className="font-bold mt-2 uppercase tracking-widest text-sm">Conquer the realms of DSA</p>
      </div>

      {/* Map Container */}
      <div className="relative w-full flex flex-col items-center">
        
        {/* The Path (Winding line behind nodes) */}
        <div className="absolute top-0 bottom-0 w-2 bg-black opacity-10" style={{ left: '50%', transform: 'translateX(-50%)' }} />

        {dsaTopics.map((topic, idx) => {
          const { completed, total } = getTopicProgress(idx, topic);
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isUnlocked = idx === 0 || getTopicProgress(idx - 1, dsaTopics[idx - 1]).completed > 0; // simple unlock logic
          
          const isLeft = idx % 2 === 0;

          return (
            <div key={idx} className={`relative w-full flex ${isLeft ? 'justify-start md:pr-[50%]' : 'justify-end md:pl-[50%]'} mb-16 px-4 md:px-12`}>
               {/* Connecting Line from center to card on desktop */}
               <div className={`hidden md:block absolute top-1/2 h-2 bg-black opacity-10 z-0 ${isLeft ? 'right-[50%] left-1/4' : 'left-[50%] right-1/4'}`} />

               <motion.div 
                 whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                 onClick={() => {
                   if (isUnlocked) {
                     playClick();
                     setSelectedTopic({ topic, idx });
                   } else {
                     playError();
                   }
                 }}
                 className={`relative z-10 w-full md:w-[90%] border-4 border-black p-4 cursor-pointer transition-all ${isUnlocked ? 'bg-white shadow-[8px_8px_0px_#000]' : 'bg-gray-200 grayscale opacity-60 cursor-not-allowed'}`}
               >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-14 h-14 border-4 border-black flex items-center justify-center text-2xl shadow-[4px_4px_0px_#000] ${pct === 100 ? 'bg-[#FFD93D]' : 'bg-neo-bg'}`}>
                      {isUnlocked ? (pct === 100 ? <Trophy size={28} /> : topic.icon) : <Lock size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xl">{topic.topic}</h4>
                      <p className="font-bold text-xs opacity-60 uppercase">{completed} / {total} Completed</p>
                    </div>
                  </div>

                  {isUnlocked && (
                    <div className="w-full h-3 bg-neo-bg border-2 border-black mt-2">
                      <div className="h-full bg-[#4ade80]" style={{ width: `${pct}%` }} />
                    </div>
                  )}

                  {/* Node Badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-black text-white font-black flex items-center justify-center border-2 border-white">
                    {idx + 1}
                  </div>
               </motion.div>
            </div>
          );
        })}
      </div>

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedTopic(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] bg-neo-bg border-8 border-black shadow-[20px_20px_0px_#FFD93D] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-black text-white p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedTopic.topic.icon}</span>
                  <div>
                    <h2 className="text-3xl font-black uppercase leading-none">{selectedTopic.topic.topic}</h2>
                    <p className="font-bold text-[#FFD93D] mt-1 text-sm uppercase tracking-widest">Zone {selectedTopic.idx + 1}</p>
                  </div>
                </div>
                <button onClick={() => { playClick(); setSelectedTopic(null); }} className="p-2 hover:bg-white/20 transition-colors rounded">
                  <X size={32} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto p-6 flex-1">
                 <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                   <a
                     href={`https://www.youtube.com/results?search_query=DSA+${encodeURIComponent(selectedTopic.topic.topic)}+lecture`}
                     target="_blank"
                     rel="noreferrer"
                     className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-3 font-black text-sm uppercase border-4 border-black hover:-translate-y-1 shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                   >
                     <PlayCircle size={20} /> Watch Lecture
                   </a>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['easy', 'medium', 'hard'].map(diff => (
                      <div key={diff} className="flex flex-col border-4 border-black bg-white shadow-[6px_6px_0px_#000]">
                        <div className="p-3 font-black uppercase text-center text-sm tracking-widest border-b-4 border-black text-black" style={{ background: diffColor[diff] }}>
                          {diff} ({selectedTopic.topic[diff].length})
                        </div>
                        <div className="p-3 flex flex-col gap-3 flex-1 bg-neo-bg">
                          {selectedTopic.topic[diff].length === 0 ? (
                            <div className="text-center py-8 font-bold opacity-40 text-sm">—</div>
                          ) : (
                            selectedTopic.topic[diff].map((prob, pIdx) => {
                              const key = `${selectedTopic.idx}-${diff}-${pIdx}`;
                              const isDone = revisionState.problemLogs[key]?.status === 'solved';
                              const showHint = activeHint === key;

                              return (
                                <div key={pIdx} className="flex flex-col gap-1 rounded overflow-hidden">
                                  <div className={`flex items-center gap-2 p-2 border-2 border-black text-xs font-bold transition-colors ${isDone ? 'bg-[#4ade80]' : 'bg-white hover:bg-gray-50'}`}>
                                    <div 
                                      onClick={() => toggleProblem(selectedTopic.idx, diff, pIdx)}
                                      className={`w-6 h-6 border-2 border-black flex items-center justify-center cursor-pointer shrink-0 transition-colors ${isDone ? 'bg-black text-white' : 'bg-white'}`}
                                    >
                                      {isDone && <Check size={14} strokeWidth={4} />}
                                    </div>
                                    <a href={formatURL(prob.name)} target="_blank" rel="noreferrer" className="truncate flex-1 hover:underline text-black">
                                      {prob.name}
                                    </a>
                                    <button onClick={() => setActiveHint(prev => prev === key ? null : key)} className="p-1 hover:bg-gray-200 bg-white border-2 border-black shrink-0">
                                      <Lightbulb size={14} className={showHint ? "text-[#FFD93D]" : "text-black"} />
                                    </button>
                                  </div>
                                  {showHint && (
                                     <div className="p-2 bg-white border-2 border-black mt-1">
                                       <HintSystem problemName={prob.name} />
                                     </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
