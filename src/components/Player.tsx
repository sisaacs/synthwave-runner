import React from 'react';
import { Player as PlayerType } from '../types/game';
import { COLORS } from '../config/gameConfig';

interface PlayerProps {
  player: PlayerType;
}

// Player component representing a synthwave retro car
const Player: React.FC<PlayerProps> = ({ player }) => {
  const { position, isAlive } = player;

  return (
    <div
      className="player"
      style={{
        position: 'absolute',
        left: position.x - 30,
        top: position.y - 25, // Reduced from -35 to -25
        width: '60px',
        height: '50px', // Reduced from 70px to 50px
        transition: 'left 0.2s ease-out',
        filter: isAlive ? 'none' : 'grayscale(100%)',
      }}
    >
      {/* Retro Car SVG */}
      <svg width="60" height="50" viewBox="0 0 60 50"> {/* Reduced height from 70 to 50 */}
        {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.primary} />
            <stop offset="100%" stopColor={COLORS.purple} />
          </linearGradient>
          <linearGradient id="windshieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0080ff" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Car body (main chassis) */}
        <rect
          x="8"
          y="18" // Moved up from 25
          width="44"
          height="25" // Reduced from 35
          fill="url(#carGradient)"
          stroke={COLORS.secondary}
          strokeWidth="2"
          filter="url(#glow)"
          rx="8"
        />
        
        {/* Car hood/front */}
        <rect
          x="12"
          y="10" // Moved up from 15
          width="36"
          height="12" // Reduced from 15
          fill={COLORS.primary}
          stroke={COLORS.secondary}
          strokeWidth="2"
          filter="url(#glow)"
          rx="6"
        />
        
        {/* Windshield */}
        <polygon
          points="15,18 45,18 40,10 20,10" // Adjusted coordinates
          fill="url(#windshieldGradient)"
          stroke={COLORS.secondary}
          strokeWidth="1"
          filter="url(#glow)"
        />
        
        {/* Headlights */}
        <circle
          cx="18"
          cy="8" // Moved up from 12
          r="2" // Reduced from 3
          fill="#ffff00"
          stroke={COLORS.secondary}
          strokeWidth="1"
          filter="url(#glow)"
        />
        <circle
          cx="42"
          cy="8" // Moved up from 12
          r="2" // Reduced from 3
          fill="#ffff00"
          stroke={COLORS.secondary}
          strokeWidth="1"
          filter="url(#glow)"
        />
        
        {/* Front bumper/spoiler */}
        <rect
          x="10"
          y="5" // Moved up from 8
          width="40"
          height="3" // Reduced from 4
          fill={COLORS.secondary}
          rx="2"
          filter="url(#glow)"
        />
        
        {/* Side details/vents */}
        <rect
          x="5"
          y="22" // Moved up from 30
          width="8"
          height="2" // Reduced from 3
          fill={COLORS.blue}
          rx="1"
          filter="url(#glow)"
        />
        <rect
          x="47"
          y="22" // Moved up from 30
          width="8"
          height="2" // Reduced from 3
          fill={COLORS.blue}
          rx="1"
          filter="url(#glow)"
        />
        
        <rect
          x="5"
          y="26" // Moved up from 35
          width="8"
          height="2" // Reduced from 3
          fill={COLORS.blue}
          rx="1"
          filter="url(#glow)"
        />
        <rect
          x="47"
          y="26" // Moved up from 35
          width="8"
          height="2" // Reduced from 3
          fill={COLORS.blue}
          rx="1"
          filter="url(#glow)"
        />
        
        {/* Wheels */}
        <circle
          cx="18"
          cy="45" // Moved up from 62
          r="4" // Reduced from 6
          fill="#333"
          stroke={COLORS.secondary}
          strokeWidth="2"
          filter="url(#glow)"
        />
        <circle
          cx="42"
          cy="45" // Moved up from 62
          r="4" // Reduced from 6
          fill="#333"
          stroke={COLORS.secondary}
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Wheel rims */}
        <circle
          cx="18"
          cy="45" // Moved up from 62
          r="2" // Reduced from 3
          fill={COLORS.blue}
          filter="url(#glow)"
        />
        <circle
          cx="42"
          cy="45" // Moved up from 62
          r="2" // Reduced from 3
          fill={COLORS.blue}
          filter="url(#glow)"
        />
        
        {/* Rear spoiler */}
        <rect
          x="15"
          y="41" // Moved up from 58
          width="30"
          height="3" // Reduced from 4
          fill={COLORS.purple}
          stroke={COLORS.secondary}
          strokeWidth="1"
          rx="2"
          filter="url(#glow)"
        />
        
        {/* Exhaust pipes */}
        <circle
          cx="20"
          cy="47" // Moved up from 65
          r="1.5" // Reduced from 2
          fill={COLORS.accent}
          filter="url(#glow)"
        />
        <circle
          cx="40"
          cy="47" // Moved up from 65
          r="1.5" // Reduced from 2
          fill={COLORS.accent}
          filter="url(#glow)"
        />
        
        {/* Racing stripes */}
        <rect
          x="28"
          y="10" // Moved up from 15
          width="4"
          height="33" // Reduced from 45
          fill={COLORS.secondary}
          opacity="0.7"
          rx="2"
        />
      </svg>
      
      {/* Particle trail */}
      {isAlive && (
        <div
          style={{
            position: 'absolute',
            left: '-15px',
            top: '22px', // Adjusted for smaller car
            width: '20px',
            height: '12px', // Reduced height
            background: `linear-gradient(90deg, 
              ${COLORS.primary} 0%, 
              ${COLORS.secondary} 50%, 
              transparent 100%)`,
            borderRadius: '50%',
            opacity: 0.8,
            animation: 'pulse 0.5s infinite alternate',
          }}
        />
      )}
      
      {/* Additional exhaust glow effect */}
      {isAlive && (
        <>
          <div
            style={{
              position: 'absolute',
              left: '15px',
              top: '43px', // Adjusted for smaller car
              width: '5px', // Slightly smaller
              height: '5px',
              background: COLORS.accent,
              borderRadius: '50%',
              boxShadow: `0 0 8px ${COLORS.accent}`,
              animation: 'flicker 0.3s infinite alternate',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '35px',
              top: '43px', // Adjusted for smaller car
              width: '5px', // Slightly smaller
              height: '5px',
              background: COLORS.accent,
              borderRadius: '50%',
              boxShadow: `0 0 8px ${COLORS.accent}`,
              animation: 'flicker 0.3s infinite alternate',
            }}
          />
        </>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; transform: scaleX(1); }
            100% { opacity: 0.9; transform: scaleX(1.2); }
          }
          
          @keyframes flicker {
            0% { opacity: 0.8; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Player;
