import React, { useEffect, useState, useMemo } from 'react';
import { COLORS, GAME_CONFIG } from '../config/gameConfig';

interface BackgroundProps {
  isPlaying: boolean;
}

// Synthwave background with parallax scrolling
const Background: React.FC<BackgroundProps> = ({ isPlaying }) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  // Memoize star data to prevent regeneration on each render
  const starData = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 50,
      delay: Math.random() * 2,
      playingDuration: 15 + Math.random() * 10, // Static duration for playing state
      pausedDuration: 2 + Math.random() * 3,    // Static duration for paused state
    }));
  }, []);

  // Animate background scrolling
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setScrollOffset(prev => (prev + 2) % 400);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    const spacing = 40;
    const horizonY = GAME_CONFIG.gameHeight - 200; // Define horizon line
    
    // Vertical lines - stop at horizon
    for (let i = 0; i < GAME_CONFIG.gameWidth; i += spacing) {
      lines.push(
        <line
          key={`v-${i}`}
          x1={i}
          y1={horizonY}
          x2={i}
          y2={GAME_CONFIG.gameHeight}
          stroke={COLORS.grid}
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
    
    // Horizontal lines with perspective effect
    for (let i = 0; i < 20; i++) {
      const y = GAME_CONFIG.gameHeight - 200 + (i * 15) + (scrollOffset % 30);
      const perspective = 1 - (i / 20);
      const width = GAME_CONFIG.gameWidth * perspective;
      const x = (GAME_CONFIG.gameWidth - width) / 2;
      
      lines.push(
        <line
          key={`h-${i}`}
          x1={x}
          y1={y}
          x2={x + width}
          y2={y}
          stroke={COLORS.grid}
          strokeWidth="1"
          opacity={perspective * 0.5}
        />
      );
    }
    
    return lines;
  };

  // Generate palm trees
  const generatePalmTrees = () => {
    const trees = [];
    const treePositions = [
      { x: 50, y: GAME_CONFIG.gameHeight - 150 },
      { x: 100, y: GAME_CONFIG.gameHeight - 180 },
      { x: GAME_CONFIG.gameWidth - 100, y: GAME_CONFIG.gameHeight - 160 },
      { x: GAME_CONFIG.gameWidth - 50, y: GAME_CONFIG.gameHeight - 140 },
    ];

    treePositions.forEach((pos, index) => {
      const animatedY = pos.y + Math.sin((scrollOffset + index * 50) * 0.01) * 5;
      
      trees.push(
        <g key={`tree-${index}`} transform={`translate(${pos.x}, ${animatedY})`}>
          {/* Palm tree trunk */}
          <rect
            x="-3"
            y="-60"
            width="6"
            height="60"
            fill={COLORS.purple}
            opacity="0.8"
          />
          {/* Palm fronds */}
          <ellipse cx="0" cy="-65" rx="20" ry="8" fill={COLORS.primary} opacity="0.6" />
          <ellipse cx="0" cy="-65" rx="8" ry="20" fill={COLORS.primary} opacity="0.6" />
        </g>
      );
    });

    return trees;
  };

  // Generate mountains
  const generateMountains = () => {
    const mountains = [];
    const mountainData = [
      { x: 0, height: 100, width: 200 },
      { x: 150, height: 80, width: 150 },
      { x: GAME_CONFIG.gameWidth - 200, height: 120, width: 200 },
      { x: GAME_CONFIG.gameWidth - 100, height: 90, width: 100 },
    ];

    mountainData.forEach((mountain, index) => {
      const points = [
        `${mountain.x},${GAME_CONFIG.gameHeight - 200}`,
        `${mountain.x + mountain.width / 2},${GAME_CONFIG.gameHeight - 200 - mountain.height}`,
        `${mountain.x + mountain.width},${GAME_CONFIG.gameHeight - 200}`,
      ].join(' ');

      mountains.push(
        <polygon
          key={`mountain-${index}`}
          points={points}
          fill={COLORS.purple}
          opacity="0.4"
        />
      );
    });

    return mountains;
  };

  return (
    <div className="background">
      {/* Gradient background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `linear-gradient(180deg, 
            ${COLORS.background} 0%, 
            #1a0033 30%, 
            #330066 60%, 
            ${COLORS.purple} 100%)`,
        }}
      />

      {/* Synthwave sun */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            ${COLORS.sun} 0%, 
            ${COLORS.accent} 40%, 
            transparent 70%)`,
          opacity: 0.8,
        }}
      />

      {/* Water reflection */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '200px',
          background: `linear-gradient(180deg, 
            transparent 0%, 
            rgba(0, 100, 200, 0.2) 50%, 
            rgba(0, 50, 150, 0.4) 100%)`,
        }}
      />

      {/* SVG elements for grid, trees, and mountains */}
      <svg
        width={GAME_CONFIG.gameWidth}
        height={GAME_CONFIG.gameHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Grid lines */}
        {generateGridLines()}
        
        {/* Mountains */}
        {generateMountains()}
        
        {/* Palm trees */}
        {generatePalmTrees()}
      </svg>

      {/* Animated stars */}
      <div className="stars">
        {starData.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              position: 'absolute',
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: '2px',
              height: '2px',
              backgroundColor: COLORS.secondary,
              borderRadius: '50%',
              animation: `twinkle ${isPlaying ? star.playingDuration : star.pausedDuration}s infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Background;
