import React, { useEffect, useState } from 'react';
import { LEVEL_CONFIG } from '../config/gameConfig';

interface LevelUpNotificationProps {
  isVisible: boolean;
  levelName: string;
  isExpertLevel?: boolean;
  onComplete?: () => void;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  isVisible,
  levelName,
  isExpertLevel = false,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('enter');
      
      // Enter phase
      const enterTimeout = setTimeout(() => {
        setAnimationPhase('display');
      }, 500);
      
      // Display phase
      const displayTimeout = setTimeout(() => {
        setAnimationPhase('exit');
      }, isExpertLevel ? 3000 : 2000);
      
      // Exit phase
      const exitTimeout = setTimeout(() => {
        onComplete?.();
      }, isExpertLevel ? 3500 : 2500);
      
      return () => {
        clearTimeout(enterTimeout);
        clearTimeout(displayTimeout);
        clearTimeout(exitTimeout);
      };
    }
  }, [isVisible, isExpertLevel, onComplete]);

  if (!isVisible) return null;

  const levelConfig = LEVEL_CONFIG[levelName];
  const isEntering = animationPhase === 'enter';
  const isExiting = animationPhase === 'exit';

  return (
    <>
      <style>
        {`
          @keyframes levelup-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes levelup-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .levelup-pulse {
            animation: levelup-pulse 1s infinite;
          }
          
          .levelup-rotate {
            animation: levelup-rotate 2s linear infinite;
          }
        `}
      </style>
      
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isEntering ? 0.5 : isExiting ? 1.2 : 1})`,
          zIndex: 2000,
          pointerEvents: 'none',
          opacity: isExiting ? 0 : 1,
          transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        }}
      >
        {/* Main notification */}
        <div
          style={{
            background: `linear-gradient(135deg, ${levelConfig?.color || '#ff00ff'}22, ${levelConfig?.color || '#ff00ff'}44)`,
            border: `3px solid ${levelConfig?.color || '#ff00ff'}`,
            borderRadius: '20px',
            padding: isExpertLevel ? '30px 40px' : '20px 30px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: `
              0 0 30px ${levelConfig?.color || '#ff00ff'}66,
              inset 0 0 20px ${levelConfig?.color || '#ff00ff'}22
            `,
            minWidth: isExpertLevel ? '400px' : '300px',
          }}
        >
          {/* Level Up Text */}
          <div
            style={{
              fontSize: isExpertLevel ? '32px' : '24px',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: `0 0 10px ${levelConfig?.color || '#ff00ff'}`,
              marginBottom: '10px',
              fontFamily: 'monospace',
              letterSpacing: '2px',
            }}
          >
            {isExpertLevel ? '🎉 EXPERT LEVEL! 🎉' : 'LEVEL UP!'}
          </div>
          
          {/* Level Name */}
          <div
            style={{
              fontSize: isExpertLevel ? '28px' : '20px',
              fontWeight: 'bold',
              color: levelConfig?.color || '#ff00ff',
              textShadow: `0 0 15px ${levelConfig?.color || '#ff00ff'}`,
              marginBottom: '8px',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
            }}
          >
            {levelConfig?.name || levelName}
          </div>
          
          {/* Level Description */}
          <div
            style={{
              fontSize: isExpertLevel ? '16px' : '14px',
              color: '#cccccc',
              fontFamily: 'monospace',
              fontStyle: 'italic',
            }}
          >
            {levelConfig?.description || 'New challenge awaits!'}
          </div>
          
          {/* Expert level special message */}
          {isExpertLevel && (
            <div
              className="levelup-pulse"
              style={{
                marginTop: '15px',
                fontSize: '18px',
                color: '#ffff00',
                textShadow: '0 0 10px #ffff00',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}
            >
              ⚡ LIGHTNING FAST NEON NIGHTMARE ⚡
            </div>
          )}
        </div>
        
        {/* Glowing border effect */}
        <div
          className={isExpertLevel ? 'levelup-rotate' : ''}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            right: '-5px',
            bottom: '-5px',
            background: `linear-gradient(45deg, ${levelConfig?.color || '#ff00ff'}, transparent, ${levelConfig?.color || '#ff00ff'})`,
            borderRadius: '25px',
            opacity: 0.3,
            zIndex: -1,
          }}
        />
      </div>
    </>
  );
};

export default LevelUpNotification;
