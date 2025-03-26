import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import DottedMap from 'dotted-map';
import { useTheme } from '../lib/ThemeContext';

const connections = [
  {
    start: { lat: -33.8688, lng: 151.2093, label: 'Sydney' },
    end: { lat: -41.2866, lng: 174.7756, label: 'Wellington' }
  },
  {
    start: { lat: -37.8136, lng: 144.9631, label: 'Melbourne' },
    end: { lat: -36.8509, lng: 174.7645, label: 'Auckland' }
  },
  {
    start: { lat: -27.4705, lng: 153.0260, label: 'Brisbane' },
    end: { lat: -36.8509, lng: 174.7645, label: 'Auckland' }
  }
];

export function WorldMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 100, grid: 'diagonal' });
  const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === 'dark' ? '#FFFFFF40' : '#00000040',
    shape: 'circle',
    backgroundColor: theme === 'dark' ? 'black' : 'white',
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {connections.map((connection, i) => {
          const startPoint = projectPoint(connection.start.lat, connection.start.lng);
          const endPoint = projectPoint(connection.end.lat, connection.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity="1" />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {connections.map((connection, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(connection.start.lat, connection.start.lng).x}
                cy={projectPoint(connection.start.lat, connection.start.lng).y}
                r="2"
                fill="#0ea5e9"
              />
              <circle
                cx={projectPoint(connection.start.lat, connection.start.lng).x}
                cy={projectPoint(connection.start.lat, connection.start.lng).y}
                r="2"
                fill="#0ea5e9"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(connection.end.lat, connection.end.lng).x}
                cy={projectPoint(connection.end.lat, connection.end.lng).y}
                r="2"
                fill="#0ea5e9"
              />
              <circle
                cx={projectPoint(connection.end.lat, connection.end.lng).x}
                cy={projectPoint(connection.end.lat, connection.end.lng).y}
                r="2"
                fill="#0ea5e9"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}