// Game state and object type definitions
export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  position: Position;
  lane: number; // 0 = far left, 1 = left, 2 = center, 3 = right, 4 = far right
  speed: number;
}

export interface Player extends GameObject {
  isAlive: boolean;
}

export interface Coin extends GameObject {
  collected: boolean;
  value: number;
}

export interface Obstacle extends GameObject {
  type: 'barrier' | 'spike' | 'wall';
}

export interface GameState {
  player: Player;
  coins: Coin[];
  obstacles: Obstacle[];
  score: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver' | 'won';
  level: number;
  speed: number;
  currentLevel: string; // Level name (beginner, intermediate, etc.)
  levelProgress: number; // Progress towards next level (0-1)
  // Celebration system
  showLevelUp: boolean;
  showConfetti: boolean;
  isExpertCelebration: boolean;
  lastLevelName: string;
}

export interface GameConfig {
  lanes: number;
  laneWidth: number;
  gameWidth: number;
  gameHeight: number;
  playerSpeed: number;
  obstacleSpeed: number;
  coinSpeed: number;
  spawnRate: number;
}

// Level configuration interface
export interface LevelConfig {
  name: string;
  description: string;
  obstacleSpeed: number;
  coinSpeed: number;
  spawnRate: number;
  obstacleChance: number;
  scoreThreshold: number;
  color: string;
  backgroundSpeed: number;
}

// Parallax background layers
export interface ParallaxLayer {
  id: string;
  speed: number;
  yOffset: number;
  elements: ParallaxElement[];
}

export interface ParallaxElement {
  x: number;
  y: number;
  type: 'palm' | 'mountain' | 'grid';
}
