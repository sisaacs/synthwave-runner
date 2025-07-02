import React from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import Background from './Background';
import Player from './Player';
import Coin from './Coin';
import Obstacle from './Obstacle';
import UI from './UI';
import Confetti from './Confetti';
import LevelUpNotification from './LevelUpNotification';
import { GAME_CONFIG } from '../config/gameConfig';

// Main game component that orchestrates all game elements with level system
const Game: React.FC = () => {
  const { 
    gameState, 
    startGame, 
    restartGame, 
    handleLevelUpComplete, 
    handleConfettiComplete 
  } = useGameEngine();

  return (
    <div
      className="game-container"
      style={{
        position: 'relative',
        width: `${GAME_CONFIG.gameWidth}px`,
        height: `${GAME_CONFIG.gameHeight}px`,
        margin: '0 auto',
        overflow: 'hidden',
        border: '2px solid #00ffff',
        borderRadius: '10px',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
        background: '#000',
      }}
    >
      {/* Background with parallax scrolling */}
      <Background isPlaying={gameState.gameStatus === 'playing'} />

      {/* Game objects - only render when playing */}
      {gameState.gameStatus === 'playing' && (
        <>
          {/* Player lightcycle */}
          <Player player={gameState.player} />

          {/* Coins */}
          {gameState.coins.map(coin => (
            <Coin key={coin.id} coin={coin} />
          ))}

          {/* Obstacles */}
          {gameState.obstacles.map(obstacle => (
            <Obstacle key={obstacle.id} obstacle={obstacle} />
          ))}
        </>
      )}

      {/* UI overlay with level information */}
      <UI
        score={gameState.score}
        gameStatus={gameState.gameStatus}
        currentLevel={gameState.currentLevel}
        levelProgress={gameState.levelProgress}
        onStart={startGame}
        onRestart={restartGame}
      />

      {/* Lane indicators (subtle guides) */}
      {gameState.gameStatus === 'playing' && (
        <div className="lane-indicators">
          {[0, 1, 2, 3, 4].map(lane => (
            <div
              key={lane}
              style={{
                position: 'absolute',
                left: `${GAME_CONFIG.gameWidth / 2 + (lane - 2) * GAME_CONFIG.laneWidth - 1}px`,
                top: 0,
                width: '2px',
                height: '100%',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0, 170, 255, 0.3) 50%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Effects */}
      <Confetti
        isActive={gameState.showConfetti}
        intensity={gameState.isExpertCelebration ? 'celebration' : 'normal'}
        duration={gameState.isExpertCelebration ? 4000 : 3000}
        onComplete={handleConfettiComplete}
      />

      <LevelUpNotification
        isVisible={gameState.showLevelUp}
        levelName={gameState.currentLevel}
        isExpertLevel={gameState.isExpertCelebration}
        onComplete={handleLevelUpComplete}
      />
    </div>
  );
};

export default Game;
