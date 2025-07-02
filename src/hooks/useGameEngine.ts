import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Player, Coin, Obstacle } from '../types/game';
import { GAME_CONFIG, LANE_POSITIONS, SCORING, LEVEL_CONFIG, getLevelFromScore, getNextLevelInfo } from '../config/gameConfig';
import { 
  generateId, 
  checkCollision, 
  getLanePosition, 
  clampLane, 
  isOffScreen, 
  randomInt 
} from '../utils/gameUtils';

// Custom hook for managing game state and logic with level progression
export const useGameEngine = () => {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    player: {
      id: 'player',
      position: { x: LANE_POSITIONS[2], y: GAME_CONFIG.gameHeight - 100 }, // Center lane (index 2)
      lane: 2,
      speed: 0,
      isAlive: true,
    },
    coins: [],
    obstacles: [],
    score: 0,
    gameStatus: 'menu',
    level: 1,
    speed: GAME_CONFIG.obstacleSpeed,
    currentLevel: 'beginner',
    levelProgress: 0,
    // Celebration system
    showLevelUp: false,
    showConfetti: false,
    isExpertCelebration: false,
    lastLevelName: 'beginner',
  });

  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  // Handle keyboard input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysPressed.current.add(event.key);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current.delete(event.key);
  }, []);

  // Process player input
  const processInput = useCallback(() => {
    // Handle escape key for pause/unpause (works in any state except menu)
    if (keysPressed.current.has('Escape') && gameState.gameStatus !== 'menu') {
      if (gameState.gameStatus === 'playing') {
        setGameState(prevState => ({ ...prevState, gameStatus: 'paused' }));
      } else if (gameState.gameStatus === 'paused') {
        setGameState(prevState => ({ ...prevState, gameStatus: 'playing' }));
      }
      keysPressed.current.delete('Escape'); // Prevent continuous toggling
      return;
    }

    if (gameState.gameStatus !== 'playing') return;

    setGameState(prevState => {
      const newState = { ...prevState };
      
      // Handle lane switching
      if (keysPressed.current.has('ArrowLeft') && newState.player.lane > 0) {
        newState.player.lane = clampLane(newState.player.lane - 1);
        newState.player.position.x = getLanePosition(newState.player.lane);
        keysPressed.current.delete('ArrowLeft'); // Prevent continuous movement
      }
      
      if (keysPressed.current.has('ArrowRight') && newState.player.lane < 4) {
        newState.player.lane = clampLane(newState.player.lane + 1);
        newState.player.position.x = getLanePosition(newState.player.lane);
        keysPressed.current.delete('ArrowRight'); // Prevent continuous movement
      }

      return newState;
    });
  }, [gameState.gameStatus]);

  // Get current level configuration
  const getCurrentLevelConfig = useCallback((levelName: string) => {
    return LEVEL_CONFIG[levelName] || LEVEL_CONFIG.beginner;
  }, []);

  // Spawn new coins
  const spawnCoin = useCallback((levelConfig: any): Coin => {
    const lane = randomInt(0, 4);
    return {
      id: generateId(),
      position: { x: getLanePosition(lane), y: -50 },
      lane,
      speed: levelConfig.coinSpeed,
      collected: false,
      value: SCORING.coinValue,
    };
  }, []);

  // Spawn new obstacles
  const spawnObstacle = useCallback((levelConfig: any): Obstacle => {
    const lane = randomInt(0, 4);
    const types: ('barrier' | 'spike' | 'wall')[] = ['barrier', 'spike', 'wall'];
    return {
      id: generateId(),
      position: { x: getLanePosition(lane), y: -50 },
      lane,
      speed: levelConfig.obstacleSpeed,
      type: types[randomInt(0, types.length - 1)],
    };
  }, []);

  // Update level based on score
  const updateLevel = useCallback(() => {
    setGameState(prevState => {
      const newLevelName = getLevelFromScore(prevState.score);
      const nextLevelInfo = getNextLevelInfo(newLevelName);
      
      let levelProgress = 0;
      if (nextLevelInfo) {
        const currentThreshold = LEVEL_CONFIG[newLevelName].scoreThreshold;
        const nextThreshold = nextLevelInfo.threshold;
        const scoreInLevel = prevState.score - currentThreshold;
        const levelRange = nextThreshold - currentThreshold;
        levelProgress = Math.min(scoreInLevel / levelRange, 1);
      } else {
        levelProgress = 1; // Max level reached
      }

      // Check if level changed
      const levelChanged = newLevelName !== prevState.lastLevelName;
      const isExpertLevel = newLevelName === 'expert';

      if (levelChanged && prevState.gameStatus === 'playing') {
        // Trigger celebration
        return {
          ...prevState,
          currentLevel: newLevelName,
          levelProgress,
          lastLevelName: newLevelName,
          showLevelUp: true,
          showConfetti: true,
          isExpertCelebration: isExpertLevel,
        };
      }

      return {
        ...prevState,
        currentLevel: newLevelName,
        levelProgress,
        lastLevelName: newLevelName,
      };
    });
  }, []);

  // Handle level up notification completion
  const handleLevelUpComplete = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      showLevelUp: false,
    }));
  }, []);

  // Handle confetti completion
  const handleConfettiComplete = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      showConfetti: false,
      isExpertCelebration: false,
    }));
  }, []);

  // Update game objects
  const updateGameObjects = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') return prevState;

      const newState = { ...prevState };
      const levelConfig = getCurrentLevelConfig(newState.currentLevel);

      // Update coins
      newState.coins = newState.coins
        .map(coin => ({
          ...coin,
          position: { ...coin.position, y: coin.position.y + coin.speed }
        }))
        .filter(coin => !isOffScreen(coin.position) && !coin.collected);

      // Update obstacles
      newState.obstacles = newState.obstacles
        .map(obstacle => ({
          ...obstacle,
          position: { ...obstacle.position, y: obstacle.position.y + obstacle.speed }
        }))
        .filter(obstacle => !isOffScreen(obstacle.position));

      // Spawn new objects based on level configuration
      if (Math.random() < levelConfig.spawnRate) {
        if (Math.random() < levelConfig.obstacleChance) {
          // Spawn obstacle
          newState.obstacles.push(spawnObstacle(levelConfig));
        } else {
          // Spawn coin
          newState.coins.push(spawnCoin(levelConfig));
        }
      }

      return newState;
    });
  }, [getCurrentLevelConfig, spawnCoin, spawnObstacle]);

  // Check collisions
  const checkCollisions = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') return prevState;

      const newState = { ...prevState };

      // Check coin collisions
      newState.coins.forEach(coin => {
        if (!coin.collected && checkCollision(newState.player, coin)) {
          coin.collected = true;
          newState.score += coin.value;
        }
      });

      // Remove collected coins
      newState.coins = newState.coins.filter(coin => !coin.collected);

      // Check obstacle collisions
      const hitObstacle = newState.obstacles.some(obstacle => 
        checkCollision(newState.player, obstacle)
      );

      if (hitObstacle) {
        newState.player.isAlive = false;
        newState.gameStatus = 'gameOver';
      }

      // Check win condition
      if (newState.score >= SCORING.winThreshold) {
        newState.gameStatus = 'won';
      }

      return newState;
    });
  }, []);

  // Main game loop
  const gameLoop = useCallback(() => {
    processInput(); // Always process input (for pause/unpause)
    
    // Only update game objects and check collisions when playing
    if (gameState.gameStatus === 'playing') {
      updateGameObjects();
      checkCollisions();
      updateLevel();
    }

    // Continue loop for playing or paused states
    if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [processInput, updateGameObjects, checkCollisions, updateLevel, gameState.gameStatus]);

  // Start game
  const startGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      gameStatus: 'playing',
      player: {
        ...prevState.player,
        isAlive: true,
        lane: 2, // Center lane for 5 lanes
        position: { x: LANE_POSITIONS[2], y: GAME_CONFIG.gameHeight - 100 },
      },
      coins: [],
      obstacles: [],
      score: 0,
      currentLevel: 'beginner',
      levelProgress: 0,
      // Reset celebration states
      showLevelUp: false,
      showConfetti: false,
      isExpertCelebration: false,
      lastLevelName: 'beginner',
    }));
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    startGame();
  }, [startGame]);

  // Pause/Resume game
  const togglePause = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      gameStatus: prevState.gameStatus === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  // Set up event listeners and game loop
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp]);

  // Start game loop when playing or paused
  useEffect(() => {
    if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameStatus, gameLoop]);

  return {
    gameState,
    startGame,
    restartGame,
    togglePause,
    getCurrentLevelConfig: () => getCurrentLevelConfig(gameState.currentLevel),
    handleLevelUpComplete,
    handleConfettiComplete,
  };
};
