import React from 'react';
import { Coin as CoinType } from '../types/game';
import { COLORS } from '../config/gameConfig';

interface CoinProps {
  coin: CoinType;
}

// Coin component with synthwave styling
const Coin: React.FC<CoinProps> = ({ coin }) => {
  const { position, collected } = coin;

  if (collected) return null;

  return (
    <div
      className="coin"
      style={{
        position: 'absolute',
        left: position.x - 15,
        top: position.y - 15,
        width: '30px',
        height: '30px',
        animation: 'spin 2s linear infinite, float 3s ease-in-out infinite',
      }}
    >
      {/* Coin SVG */}
      <svg width="30" height="30" viewBox="0 0 30 30">
        {/* Glow effect */}
        <defs>
          <filter id="coinGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="coinGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor={COLORS.accent} />
            <stop offset="70%" stopColor={COLORS.sun} />
            <stop offset="100%" stopColor="#cc5500" />
          </radialGradient>
        </defs>
        
        {/* Outer ring */}
        <circle
          cx="15"
          cy="15"
          r="14"
          fill="url(#coinGradient)"
          stroke={COLORS.accent}
          strokeWidth="2"
          filter="url(#coinGlow)"
        />
        
        {/* Inner design */}
        <circle
          cx="15"
          cy="15"
          r="10"
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="1"
          opacity="0.8"
        />
        
        {/* Center symbol */}
        <polygon
          points="15,8 18,12 15,16 12,12"
          fill={COLORS.accent}
          opacity="0.9"
        />
        <polygon
          points="15,14 18,18 15,22 12,18"
          fill={COLORS.accent}
          opacity="0.7"
        />
      </svg>
      
      {/* Particle effect */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          border: `1px solid ${COLORS.accent}`,
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'expand 2s ease-out infinite',
        }}
      />
      
      <style>{`
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes expand {
          0% { 
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Coin;
