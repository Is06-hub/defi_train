// frontend/src/components/canvas/AnatomicalBodySvg.tsx
import React from 'react';
import { PainLocation } from '../../types';

interface AnatomicalBodySvgProps {
  view: 'front' | 'back';
  locations: PainLocation[];
  activeLocationId?: string | null;
  onCanvasClick?: (coords: { x: number; y: number }, e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => void;
  onPinClick?: (locationId: string, e: React.MouseEvent) => void;
  interactive?: boolean;
  showRadiations?: boolean;
  className?: string;
}

export const AnatomicalBodySvg: React.FC<AnatomicalBodySvgProps> = ({
  view,
  locations,
  activeLocationId,
  onCanvasClick,
  onPinClick,
  interactive = true,
  showRadiations = true,
  className = ''
}) => {
  const currentViewLocations = locations.filter((loc) => loc.bodyView === view);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onCanvasClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    onCanvasClick({
      x: Math.round(clickX * 10) / 10,
      y: Math.round(clickY * 10) / 10
    }, e);
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 140"
        className="w-full h-full max-h-[360px] sm:max-h-[420px] drop-shadow-md transition-all duration-300 canvas-container cursor-crosshair"
        onClick={handleClick}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Anatomical Body Gradient */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EEF2F6" />
          </linearGradient>

          {/* Body Silhouette Shadow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.06" />
          </filter>

          {/* Radiation Arrow Marker */}
          <marker
            id="radiationArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#E63946" />
          </marker>
        </defs>

        {/* Anatomical Silhouette Group */}
        <g filter="url(#softGlow)" className="transition-transform duration-200">
          {/* Head & Cranium */}
          <ellipse cx="50" cy="14" rx="8" ry="10" fill="url(#bodyGradient)" stroke="#94A3B8" strokeWidth="1.2" />

          {/* Neck */}
          <path d="M47 23 L47 28 L53 28 L53 23 Z" fill="url(#bodyGradient)" stroke="#94A3B8" strokeWidth="1.2" />

          {/* Shoulders & Torso */}
          <path
            d="
              M47 28 
              C40 28, 34 32, 29 36
              C26 38, 25 43, 27 48
              L29 70
              C30 74, 33 76, 35 77
              L38 90
              L44 90
              L46 112
              L44 135
              L48 136
              L50 114
              L52 114
              L54 136
              L58 135
              L56 112
              L62 90
              L65 90
              L67 77
              C70 76, 71 74, 72 70
              L74 48
              C75 43, 74 38, 71 36
              C66 32, 60 28, 53 28
              Z
            "
            fill="url(#bodyGradient)"
            stroke="#94A3B8"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Left Arm & Forearm */}
          <path
            d="M29 37 L21 56 L18 76 L22 77 L25 58 L30 42 Z"
            fill="url(#bodyGradient)"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Right Arm & Forearm */}
          <path
            d="M71 37 L79 56 L82 76 L78 77 L75 58 L70 42 Z"
            fill="url(#bodyGradient)"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Anatomical Internal Landmarks depending on Front vs Back */}
          {view === 'front' ? (
            <g stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none">
              {/* Clavicles */}
              <path d="M42 31 Q46 33 49 32" />
              <path d="M58 31 Q54 33 51 32" />
              {/* Sternum & Pectorals */}
              <path d="M50 32 L50 48" strokeDasharray="1 2" />
              <path d="M38 42 Q44 46 48 43" />
              <path d="M62 42 Q56 46 52 43" />
              {/* Navel */}
              <circle cx="50" cy="58" r="0.9" fill="#94A3B8" stroke="none" />
              {/* Groin / Pelvic V-lines */}
              <path d="M42 75 L50 83 L58 75" opacity="0.6" />
              {/* Knees */}
              <ellipse cx="45" cy="113" rx="2.5" ry="1.8" stroke="#CBD5E1" />
              <ellipse cx="55" cy="113" rx="2.5" ry="1.8" stroke="#CBD5E1" />
            </g>
          ) : (
            <g stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none">
              {/* Cervical & Spine line */}
              <path d="M50 25 L50 78" strokeDasharray="2 2" stroke="#94A3B8" />
              {/* Scapulae (Shoulder blades) */}
              <path d="M40 36 Q37 44 42 48" />
              <path d="M60 36 Q63 44 58 48" />
              {/* Lower Back / Lumbar Curve */}
              <path d="M45 62 Q50 64 55 62" />
              {/* Gluteal cleft */}
              <path d="M50 78 L50 88" stroke="#94A3B8" />
              {/* Back of knees */}
              <path d="M43 113 Q45 115 47 113" />
              <path d="M53 113 Q55 115 57 113" />
            </g>
          )}
        </g>

        {/* Radiation Vectors (F2) */}
        {showRadiations &&
          currentViewLocations.map((loc) => {
            if (!loc.radiation?.hasRadiation || !loc.radiation.endCoordinates) return null;
            const start = loc.coordinates;
            const end = loc.radiation.endCoordinates;
            const midX = (start.x + end.x) / 2 + (end.y - start.y) * 0.15;
            const midY = (start.y + end.y) / 2 - (end.x - start.x) * 0.15;
            const pathD = `M ${start.x} ${start.y} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${end.x} ${end.y}`;

            return (
              <g key={`rad_${loc.locationId}`} className="pointer-events-none">
                {/* Radiation Glow Background */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={loc.intensity?.colorHex || '#E63946'}
                  strokeWidth="4"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                />
                {/* Flowing animated dash path with arrow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={loc.intensity?.colorHex || '#E63946'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-radiation-flow"
                  markerEnd="url(#radiationArrow)"
                />
                {/* Target radiation endpoint dot */}
                <circle
                  cx={end.x}
                  cy={end.y}
                  r="2.5"
                  fill="#FFFFFF"
                  stroke={loc.intensity?.colorHex || '#E63946'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

        {/* Interactive Pain Pins (F1 - F3) */}
        {currentViewLocations.map((loc, idx) => {
          const isActive = loc.locationId === activeLocationId;
          const pinColor = loc.intensity?.colorHex || '#E63946';

          return (
            <g
              key={loc.locationId}
              className="cursor-pointer transition-transform duration-150 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                if (onPinClick) onPinClick(loc.locationId, e);
              }}
            >
              {/* Outer Pulsing Glow */}
              <circle
                cx={loc.coordinates.x}
                cy={loc.coordinates.y}
                r="10"
                fill={pinColor}
                opacity="0.25"
                className="animate-pulse-aura pointer-events-none"
              />

              {/* Pin Outer Circle */}
              <circle
                cx={loc.coordinates.x}
                cy={loc.coordinates.y}
                r={isActive ? "6" : "5"}
                fill={pinColor}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="shadow-md"
              />

              {/* Pin Inner Dot or Number */}
              <text
                x={loc.coordinates.x}
                y={loc.coordinates.y + 1.2}
                textAnchor="middle"
                fontSize="4"
                fontWeight="900"
                fill="#FFFFFF"
                className="pointer-events-none font-mono"
              >
                {idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
