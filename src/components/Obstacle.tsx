import React from 'react';
import { Obstacle as ObstacleType } from '../types/game';
import { COLORS } from '../config/gameConfig';

interface ObstacleProps {
  obstacle: ObstacleType;
}

// Obstacle component with different types
const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const { position, type } = obstacle;

  const renderObstacle = () => {
    switch (type) {
      case 'barrier':
        return (
          <svg width="50" height="50" viewBox="0 0 50 50">
            <defs>
              <filter id="obstacleGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Barrier */}
            <rect
              x="5"
              y="10"
              width="40"
              height="30"
              fill={COLORS.primary}
              stroke="#ff0066"
              strokeWidth="2"
              filter="url(#obstacleGlow)"
              rx="5"
            />
            
            {/* Warning stripes */}
            <rect x="10" y="15" width="30" height="4" fill="#ff0066" opacity="0.8" />
            <rect x="10" y="25" width="30" height="4" fill="#ff0066" opacity="0.8" />
            <rect x="10" y="35" width="30" height="4" fill="#ff0066" opacity="0.8" />
          </svg>
        );
        
      case 'spike':
        return (
          <svg width="50" height="50" viewBox="0 0 50 50">
            <defs>
              <filter id="spikeGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Spike triangles */}
            <polygon
              points="25,5 35,40 15,40"
              fill={COLORS.primary}
              stroke="#ff0066"
              strokeWidth="2"
              filter="url(#spikeGlow)"
            />
            <polygon
              points="15,10 25,35 5,35"
              fill={COLORS.primary}
              stroke="#ff0066"
              strokeWidth="1"
              opacity="0.7"
            />
            <polygon
              points="35,10 45,35 25,35"
              fill={COLORS.primary}
              stroke="#ff0066"
              strokeWidth="1"
              opacity="0.7"
            />
          </svg>
        );
        
      case 'wall':
        return (
          <svg width="50" height="60" viewBox="0 0 50 60">
            <defs>
              <filter id="wallGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Wall blocks */}
            <rect x="5" y="10" width="40" height="15" fill={COLORS.primary} stroke="#ff0066" strokeWidth="1" filter="url(#wallGlow)" />
            <rect x="5" y="25" width="40" height="15" fill={COLORS.primary} stroke="#ff0066" strokeWidth="1" filter="url(#wallGlow)" />
            <rect x="5" y="40" width="40" height="15" fill={COLORS.primary} stroke="#ff0066" strokeWidth="1" filter="url(#wallGlow)" />
            
            {/* Block details */}
            <line x1="25" y1="10" x2="25" y2="55" stroke="#ff0066" strokeWidth="1" opacity="0.5" />
            <line x1="5" y1="32" x2="45" y2="32" stroke="#ff0066" strokeWidth="1" opacity="0.5" />
          </svg>
        );
        
      default:
        return null;
    }
  };

  return (
    <div
      className="obstacle"
      style={{
        position: 'absolute',
        left: position.x - 25,
        top: position.y - 25,
        animation: 'pulse 1s ease-in-out infinite alternate',
      }}
    >
      {renderObstacle()}
      
      {/* Danger indicator */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '2px',
          background: `linear-gradient(90deg, 
            transparent 0%, 
            #ff0066 50%, 
            transparent 100%)`,
          animation: 'scan 2s linear infinite',
        }}
      />
      
      <style>
        {`
          @keyframes pulse {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.3); }
          }
          
          @keyframes scan {
            0% { opacity: 0; transform: translateX(-50%) scaleX(0); }
            50% { opacity: 1; transform: translateX(-50%) scaleX(1); }
            100% { opacity: 0; transform: translateX(-50%) scaleX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Obstacle;
