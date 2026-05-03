import { useState, useEffect } from 'react';
import { getRevisionsDueToday, markRevision } from '../utils/revisionStore';
import { RefreshCw, Check, X } from 'lucide-react';
import { dsaTopics } from '../data/dsaSheet';

export default function RevisionSection() {
  const [revisions, setRevisions] = useState([]);

  useEffect(() => {
    setRevisions(getRevisionsDueToday());
  }, []);

  const handleMark = (id, remembered) => {
    markRevision(id, remembered);
    setRevisions(getRevisionsDueToday());
  };

  const getProblemTitle = (id) => {
    // ID format: topicIdx-diff-probIdx
    const parts = id.split('-');
    if (parts.length === 3) {
      const tIdx = parseInt(parts[0], 10);
      const probIdx = parseInt(parts[2], 10);
      const diff = parts[1];
      const prob = dsaTopics[tIdx]?.[diff]?.[probIdx];
      return prob?.name || id;
    }
    return id;
  };

  return (
    <div className="bg-[#FFD93D] border-4 border-black p-4 shadow-[6px_6px_0px_#000] h-full flex flex-col">
      <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
        <h3 className="font-black uppercase tracking-wider flex items-center gap-2">
          <RefreshCw size={18} /> Revision Due
        </h3>
        <span className="bg-black text-white font-black px-2 py-0.5 text-xs">
          {revisions.length} Left
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {revisions.length === 0 ? (
          <div className="text-center font-bold opacity-60 text-sm mt-8">
            All caught up for today!
          </div>
        ) : (
          revisions.map(rev => (
            <div key={rev.id} className="bg-white border-2 border-black p-3 flex flex-col gap-2">
              <span className="font-bold text-sm truncate">{getProblemTitle(rev.id)}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleMark(rev.id, true)}
                  className="flex-1 bg-[#4ade80] text-black font-black uppercase text-xs border-2 border-black py-1 hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-1">
                  <Check size={12} /> Remembered
                </button>
                <button 
                  onClick={() => handleMark(rev.id, false)}
                  className="flex-1 bg-[#FF6B6B] text-white font-black uppercase text-xs border-2 border-black py-1 hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-1">
                  <X size={12} /> Forgot
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
