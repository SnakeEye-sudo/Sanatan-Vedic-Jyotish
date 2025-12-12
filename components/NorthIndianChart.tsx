import React, { useState } from 'react';
import { KundaliData } from '../types';

interface Props {
  data: KundaliData;
}

export const NorthIndianChart: React.FC<Props> = ({ data }) => {
  const { ascendant, planets } = data;
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

  const getPlanetsInHouse = (houseNum: number) => {
    return planets.filter(p => p.house === houseNum);
  };

  const getSignForHouse = (houseNum: number) => {
    return ((ascendant + houseNum - 1) % 12) + 1; 
  };

  // SVG Coordinates for Diamond Chart (North Indian Style)
  // Polygon points for each house to handle hover detection
  const housePolygons = [
    { h: 1, pts: "50,0 100,50 50,100 0,50", cx: 50, cy: 35, lbl: "Lagna" }, // Center Diamond (House 1) - Actually in NI chart, H1 is top middle diamond.
    // Correct North Indian Layout mapping:
    // H1: Top Diamond
    // H4: Right Diamond (if looking from center) -> Actually Left in standard view?
    // Let's use the standard coordinate visual mapping for NI.
    // Top Middle: H1. Left Middle: H4. Right Middle: H10. Bottom Middle: H7.
    // Top Left: H2. Top Right: H12. Bottom Left: H5. Bottom Right: H8.
    // Outer Triangles: H3 (Top-Left-Outer), H6 (Bottom-Left-Outer), H9 (Bottom-Right-Outer), H11 (Top-Right-Outer)
  ];

  // Visual text placements
  const textPos = [
    { h: 1, x: 50, y: 30 }, 
    { h: 2, x: 25, y: 15 },
    { h: 3, x: 10, y: 40 }, // Corrected for NI chart flow
    { h: 4, x: 35, y: 50 },
    { h: 5, x: 10, y: 60 },
    { h: 6, x: 25, y: 85 },
    { h: 7, x: 50, y: 70 },
    { h: 8, x: 75, y: 85 },
    { h: 9, x: 90, y: 60 },
    { h: 10, x: 65, y: 50 },
    { h: 11, x: 90, y: 40 },
    { h: 12, x: 75, y: 15 },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md mx-auto aspect-square bg-saffron-50 border-4 border-saffron-800 p-1 relative shadow-2xl rounded-lg overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-saffron-900 stroke-1 select-none">
          {/* Background Gradient Def */}
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor:'rgb(255,247,237)', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'rgb(254,215,170)', stopOpacity:1}} />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#grad1)" />

          {/* Lines */}
          <line x1="0" y1="0" x2="100" y2="100" strokeWidth="1.5" />
          <line x1="100" y1="0" x2="0" y2="100" strokeWidth="1.5" />
          <line x1="50" y1="0" x2="0" y2="50" strokeWidth="1.5" />
          <line x1="0" y1="50" x2="50" y2="100" strokeWidth="1.5" />
          <line x1="50" y1="100" x2="100" y2="50" strokeWidth="1.5" />
          <line x1="100" y1="50" x2="50" y2="0" strokeWidth="1.5" />

          {/* Interactive House Numbers & Planets */}
          {textPos.map((pos) => {
             const housePlanets = getPlanetsInHouse(pos.h);
             const sign = getSignForHouse(pos.h);
             const isHovered = hoveredHouse === pos.h;

             return (
               <g 
                 key={pos.h} 
                 onMouseEnter={() => setHoveredHouse(pos.h)}
                 onMouseLeave={() => setHoveredHouse(null)}
                 className="cursor-pointer hover:opacity-80 transition-opacity"
               >
                 {/* Sign Number */}
                 <text 
                   x={pos.x} y={pos.y - 5} 
                   textAnchor="middle" 
                   className="text-[3px] fill-saffron-700 font-bold"
                   style={{ fontSize: '4px' }}
                 >
                   {sign}
                 </text>
                 
                 {/* Planet Text */}
                 <text 
                   x={pos.x} y={pos.y + 2} 
                   textAnchor="middle" 
                   className={`text-[3px] font-serif font-bold ${isHovered ? 'fill-red-600' : 'fill-black'}`}
                   style={{ fontSize: '3.5px' }}
                 >
                   {housePlanets.map(p => p.planet.substring(0, 2)).join(',')}
                 </text>
               </g>
             );
          })}
        </svg>

        {/* Center Om */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-saffron-900/10 font-bold text-5xl pointer-events-none">
          ॐ
        </div>
      </div>

      {/* Interactive Tooltip Area */}
      <div className="mt-4 h-24 w-full bg-white p-4 rounded-lg shadow-inner border border-gold-200">
        {hoveredHouse ? (
          <div className="animate-fade-in">
            <h4 className="font-bold text-saffron-800 border-b border-gold-100 pb-1 mb-1">
              House {hoveredHouse} (Sign: {getSignForHouse(hoveredHouse)})
            </h4>
            <div className="text-sm">
              {getPlanetsInHouse(hoveredHouse).length > 0 ? (
                getPlanetsInHouse(hoveredHouse).map(p => (
                  <div key={p.planet} className="flex justify-between">
                    <span>{p.planet} {p.isRetrograde && '(R)'}</span>
                    <span className="text-gray-500 text-xs">{p.nakshatra} ({p.degree.toFixed(1)}°)</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 italic">Empty House</span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
            Hover over chart houses to see details
          </div>
        )}
      </div>
    </div>
  );
};