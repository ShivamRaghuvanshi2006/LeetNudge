import { useState } from 'react';
import { Lightbulb, Info, AlertTriangle } from 'lucide-react';

// Static predefined hints mapping based on problem name
const predefinedHints = {
  "Two Sum": [
    "Think about using a HashMap to store values you've already seen.",
    "The HashMap key should be the value, and the map value should be the index.",
    "For each element x, check if (target - x) exists in the map."
  ],
  "Valid Parantheses": [
    "Use a Stack.",
    "Push opening brackets onto the stack.",
    "If it's a closing bracket, pop the stack and verify it matches the opening bracket."
  ],
  "Contains Duplicate": [
    "A HashSet in most languages will only store unique elements.",
    "If the size of a set created from the array is less than the array length, there's a duplicate."
  ]
};

const defaultHints = [
  "Read the constraints carefully. Is the array sorted?",
  "Try solving it on paper with a small example first.",
  "Consider edge cases like empty inputs or negative numbers."
];

export default function HintSystem({ problemName }) {
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const hints = predefinedHints[problemName] || defaultHints;

  return (
    <div className="bg-[#FFFDF5] border-2 border-black p-4 mt-4 shadow-[4px_4px_0px_#000]">
      <h4 className="font-black uppercase flex items-center gap-2 mb-3 text-sm">
        <Lightbulb size={16} className="text-[#FFD93D]" /> Hints
      </h4>
      
      <div className="space-y-2">
        {hints.map((hint, i) => (
          <div key={i} className="flex flex-col">
            {hintsRevealed > i ? (
              <div className="bg-white border-2 border-[#8b5cf6] p-2 text-sm font-bold flex gap-2">
                 <Info size={16} className="shrink-0 text-[#8b5cf6] mt-0.5" />
                 <span>{hint}</span>
              </div>
            ) : (
              <button 
                onClick={() => setHintsRevealed(i + 1)}
                disabled={hintsRevealed !== i}
                className={`py-2 px-3 border-2 border-dashed font-bold text-xs uppercase text-left transition-colors
                  ${hintsRevealed === i ? 'border-black hover:bg-neo-bg cursor-pointer bg-white' : 'border-gray-300 text-gray-400 bg-gray-50'}`}>
                {hintsRevealed === i ? `Reveal Hint ${i + 1}` : `Locked (Reveal ${i} first)`}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 border-t-2 border-dashed border-black pt-3">
        <h5 className="font-black uppercase text-[10px] text-gray-500 flex items-center gap-1 mb-1">
          <AlertTriangle size={12} /> Auto-Linter Notice
        </h5>
        <p className="text-xs font-bold opacity-70">
          The environment currently scans for missing return statements implicitly. Ensure your code returns the required type!
        </p>
      </div>
    </div>
  );
}
