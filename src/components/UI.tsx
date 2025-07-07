import React from 'react';
import { COLORS, LEVEL_CONFIG, getNextLevelInfo } from '../config/gameConfig';

interface UIProps {
  score: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver' | 'won';
  currentLevel?: string;
  levelProgress?: number;
  onStart: () => void;
  onRestart: () => void;
}

// Enhanced UI component with level system
const UI: React.FC<UIProps> = ({ 
  score, 
  gameStatus, 
  currentLevel = 'beginner',
  levelProgress = 0,
  onStart, 
  onRestart 
}) => {
  const levelConfig = LEVEL_CONFIG[currentLevel];
  const nextLevelInfo = getNextLevelInfo(currentLevel);

  // Render level progress bar
  const renderLevelProgress = () => {
    if (!nextLevelInfo) return null; // Max level reached

    return (
      <div style={{
        position: 'absolute',
        top: '90px', // Increased from 60px to avoid overlap with score
        left: '20px',
        width: '300px',
        background: 'rgba(0, 0, 0, 0.7)',
        border: `1px solid ${levelConfig.color}`,
        borderRadius: '10px',
        padding: '10px',
        color: '#ffffff',
        fontSize: '14px',
      }}>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: levelConfig.color, fontWeight: 'bold' }}>
            {levelConfig.name}
          </span>
          {nextLevelInfo && (
            <span style={{ float: 'right', color: '#cccccc' }}>
              Next: {nextLevelInfo.name}
            </span>
          )}
        </div>
        
        {nextLevelInfo && (
          <>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '5px',
            }}>
              <div style={{
                width: `${levelProgress * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${levelConfig.color}, ${COLORS.secondary})`,
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }} />
            </div>
            
            <div style={{ fontSize: '12px', color: '#cccccc' }}>
              {score} / {nextLevelInfo.threshold} points to next level
            </div>
          </>
        )}
        
        {!nextLevelInfo && (
          <div style={{ color: '#ffff00', fontWeight: 'bold', textAlign: 'center' }}>
            🏆 MASTER LEVEL ACHIEVED! 🏆
          </div>
        )}
      </div>
    );
  };

  // Render level description
  const renderLevelDescription = () => (
    <div style={{
      position: 'absolute',
      top: '20px', // Moved to align with score display
      right: '20px', // Changed from left to right
      background: 'rgba(0, 0, 0, 0.6)',
      border: `1px solid ${levelConfig.color}`,
      borderRadius: '8px',
      padding: '8px 12px',
      color: levelConfig.color,
      fontSize: '12px',
      maxWidth: '250px',
    }}>
      {levelConfig.description}
    </div>
  );

  // Main menu
  if (gameStatus === 'menu') {
    return (
      <div className="ui-overlay">
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '40px',
            borderRadius: '20px',
            border: '3px solid #00ffff',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)',
          }}
        >
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            color: '#ff00ff',
            textShadow: '0 0 20px #ff00ff',
            animation: 'neonPulse 2s ease-in-out infinite alternate',
          }}>
            SYNTHWAVE RUNNER
          </h1>
          
          <p style={{
            fontSize: '18px',
            marginBottom: '30px',
            color: '#ffffff',
            lineHeight: '1.6',
          }}>
            Race through the neon highway and collect coins!<br/>
            Progress through 5 difficulty levels from Beginner to Master.
          </p>

          {/* Level progression display */}
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <h3 style={{ color: '#00ffff', marginBottom: '15px' }}>Level Progression</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', gap: '15px' }}>
              {Object.entries(LEVEL_CONFIG).map(([key, config]) => (
                <div key={key} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ 
                    color: config.color, 
                    fontWeight: 'bold',
                    marginBottom: '5px' 
                  }}>
                    {config.name}
                  </div>
                  <div style={{ color: '#cccccc', fontSize: '10px' }}>
                    {config.scoreThreshold}+ pts
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={onStart}
            style={{
              background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
              border: 'none',
              padding: '15px 40px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000',
              borderRadius: '15px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1.05)';
              target.style.boxShadow = '0 0 40px rgba(255, 0, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1)';
              target.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.5)';
            }}
          >
            START GAME
          </button>
          
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ffffff',
            fontSize: '14px',
            opacity: 0.8,
          }}>
            Use ← → arrow keys to move
          </div>
        </div>

        <style>
          {`
            @keyframes neonPulse {
              0% { text-shadow: 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff; }
              100% { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff; }
            }
          `}
        </style>
      </div>
    );
  }

  // Playing state UI
  if (gameStatus === 'playing') {
    return (
      <div className="ui-overlay">
        {/* Score display */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#00ffff',
          textShadow: '0 0 15px #00ffff',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 20px',
          borderRadius: '10px',
          border: '2px solid #00ffff',
        }}>
          SCORE: {score.toLocaleString()}
        </div>

        {/* Level progress */}
        {renderLevelProgress()}
        
        {/* Level description */}
        {renderLevelDescription()}

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: '#ffffff',
          fontSize: '14px',
          opacity: 0.7,
          textAlign: 'right',
        }}>
          <p>← → Move</p>
          <p>ESC Pause</p>
        </div>
      </div>
    );
  }

  // Paused state UI
  if (gameStatus === 'paused') {
    return (
      <div className="ui-overlay">
        {/* Score display (still visible when paused) */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#00ffff',
          textShadow: '0 0 15px #00ffff',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 20px',
          borderRadius: '10px',
          border: '2px solid #00ffff',
        }}>
          SCORE: {score.toLocaleString()}
        </div>

        {/* Level progress (still visible when paused) */}
        {renderLevelProgress()}
        
        {/* Level description (still visible when paused) */}
        {renderLevelDescription()}

        {/* Pause overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #ffff00',
          boxShadow: '0 0 40px rgba(255, 255, 0, 0.6)',
        }}>
          <h2 style={{
            fontSize: '48px',
            marginBottom: '20px',
            color: '#ffff00',
            textShadow: '0 0 20px #ffff00',
            fontFamily: 'monospace',
            letterSpacing: '3px',
          }}>
            ⏸️ PAUSED
          </h2>
          
          <div style={{
            fontSize: '18px',
            marginBottom: '30px',
            color: '#ffffff',
            fontFamily: 'monospace',
          }}>
            Press ESC to resume
          </div>

          <div style={{
            fontSize: '14px',
            color: '#cccccc',
            fontFamily: 'monospace',
            lineHeight: '1.6',
          }}>
            <p>← → Move between lanes</p>
            <p>ESC Pause/Resume</p>
            <p>Collect coins and avoid obstacles!</p>
          </div>
        </div>
      </div>
    );
  }

  // Game Over state
  if (gameStatus === 'gameOver') {
    return (
      <div className="ui-overlay">
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #ff0066',
          boxShadow: '0 0 40px rgba(255, 6, 102, 0.6)',
        }}>
          <h2 style={{
            fontSize: '36px',
            marginBottom: '20px',
            color: '#ff0066',
            textShadow: '0 0 20px #ff0066',
          }}>
            GAME OVER
          </h2>
          
          <div style={{
            fontSize: '24px',
            marginBottom: '15px',
            color: '#00ffff',
          }}>
            Final Score: {score.toLocaleString()}
          </div>
          
          <div style={{
            fontSize: '18px',
            marginBottom: '30px',
            color: levelConfig.color,
          }}>
            Reached: {levelConfig.name} Level
          </div>
          
          <button
            onClick={onRestart}
            style={{
              background: 'linear-gradient(45deg, #ff0066, #ff00ff)',
              border: 'none',
              padding: '15px 30px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#fff',
              borderRadius: '10px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              boxShadow: '0 0 20px rgba(255, 6, 102, 0.5)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1)';
            }}
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Won state
  if (gameStatus === 'won') {
    return (
      <div className="ui-overlay">
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #00ff00',
          boxShadow: '0 0 40px rgba(0, 255, 0, 0.6)',
        }}>
          <h2 style={{
            fontSize: '36px',
            marginBottom: '20px',
            color: '#00ff00',
            textShadow: '0 0 20px #00ff00',
          }}>
            🏆 VICTORY! 🏆
          </h2>
          
          <div style={{
            fontSize: '24px',
            marginBottom: '15px',
            color: '#00ffff',
          }}>
            Final Score: {score.toLocaleString()}
          </div>
          
          <div style={{
            fontSize: '18px',
            marginBottom: '30px',
            color: '#ffff00',
          }}>
            You've mastered the synthwave highway!
          </div>
          
          <button
            onClick={onRestart}
            style={{
              background: 'linear-gradient(45deg, #00ff00, #00ffff)',
              border: 'none',
              padding: '15px 30px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              borderRadius: '10px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1)';
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default UI;
