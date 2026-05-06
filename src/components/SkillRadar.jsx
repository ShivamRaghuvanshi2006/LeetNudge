import { useMemo } from 'react';

function polarToXY(angle, r, cx = 120, cy = 120) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function SkillRadar({ skills = {}, size = 240 }) {
  const labels = Object.keys(skills);
  const values = Object.values(skills);
  const n = labels.length;
  const cx = size / 2, cy = size / 2;
  const maxR = size * 0.38;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const angleStep = 360 / n;

  const points = useMemo(() =>
    values.map((v, i) => {
      const r = (v / 100) * maxR;
      return polarToXY(i * angleStep, r, cx, cy);
    }), [values, maxR, cx, cy, angleStep]);

  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-4">
      <div className="font-black uppercase text-sm tracking-widest mb-3 flex items-center gap-2">
        <span>🎯</span> Skill Fingerprint
      </div>
      <svg width={size} height={size} className="mx-auto">
        {/* Grid circles */}
        {gridLevels.map((level, li) => {
          const gridPoints = labels.map((_, i) => {
            const pt = polarToXY(i * angleStep, level * maxR, cx, cy);
            return `${pt.x},${pt.y}`;
          });
          return (
            <polygon
              key={li}
              points={gridPoints.join(' ')}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis lines */}
        {labels.map((_, i) => {
          const outer = polarToXY(i * angleStep, maxR, cx, cy);
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={outer.x} y2={outer.y}
              stroke="#E5E7EB" strokeWidth="1.5"
            />
          );
        })}

        {/* Filled polygon */}
        <polygon
          points={pointsStr}
          fill="#8b5cf6"
          fillOpacity="0.25"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5}
            fill="#8b5cf6" stroke="black" strokeWidth="2" />
        ))}

        {/* Labels */}
        {labels.map((label, i) => {
          const labelPt = polarToXY(i * angleStep, maxR + 18, cx, cy);
          const lines = label.split('\n');
          return (
            <text key={i}
              x={labelPt.x} y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fontWeight="900"
              fontFamily="monospace"
              fill="#000"
            >
              {lines.map((ln, li) => (
                <tspan key={li} x={labelPt.x} dy={li === 0 ? 0 : 13}>{ln}</tspan>
              ))}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-1 mt-3">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#8b5cf6] border border-black shrink-0" />
            <span className="text-xs font-bold truncate">{label.replace('\n', ' ')}</span>
            <span className="text-xs font-black text-[#8b5cf6] ml-auto">{values[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
