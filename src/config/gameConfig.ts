import { GameConfig } from '../types/game';

// Game configuration constants
export const GAME_CONFIG: GameConfig = {
  lanes: 5,
  laneWidth: 100,
  gameWidth: 800,
  gameHeight: 600,
  playerSpeed: 5,
  obstacleSpeed: 3,
  coinSpeed: 3,
  spawnRate: 0.02, // Probability per frame
};

// Lane positions (x coordinates) - 5 lanes evenly distributed
export const LANE_POSITIONS = [
  GAME_CONFIG.gameWidth / 2 - GAME_CONFIG.laneWidth * 2, // Far left lane
  GAME_CONFIG.gameWidth / 2 - GAME_CONFIG.laneWidth,     // Left lane
  GAME_CONFIG.gameWidth / 2,                             // Center lane
  GAME_CONFIG.gameWidth / 2 + GAME_CONFIG.laneWidth,     // Right lane
  GAME_CONFIG.gameWidth / 2 + GAME_CONFIG.laneWidth * 2, // Far right lane
];

// Level system configuration
export const LEVEL_CONFIG = {
  beginner: {
    name: 'Beginner',
    description: 'Easy cruise through the neon highway',
    obstacleSpeed: 2,
    coinSpeed: 2,
    spawnRate: 0.018, // Increased from 0.015
    obstacleChance: 0.35, // Increased from 0.3 (35% chance for obstacles vs coins)
    scoreThreshold: 1000,
    color: '#00ff00', // Green
    backgroundSpeed: 1.5,
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Picking up speed on the cyber road',
    obstacleSpeed: 3,
    coinSpeed: 3,
    spawnRate: 0.023, // Increased from 0.02
    obstacleChance: 0.45, // Increased from 0.4 (45% chance for obstacles)
    scoreThreshold: 2500,
    color: '#ffff00', // Yellow
    backgroundSpeed: 2,
  },
  advanced: {
    name: 'Advanced',
    description: 'High-speed synthwave racing',
    obstacleSpeed: 4,
    coinSpeed: 4,
    spawnRate: 0.028, // Increased from 0.025
    obstacleChance: 0.55, // Increased from 0.5 (55% chance for obstacles)
    scoreThreshold: 5000,
    color: '#ff8800', // Orange
    backgroundSpeed: 2.5,
  },
  expert: {
    name: 'Expert',
    description: 'Lightning fast neon nightmare',
    obstacleSpeed: 5,
    coinSpeed: 5,
    spawnRate: 0.033, // Increased from 0.03
    obstacleChance: 0.65, // Increased from 0.6 (65% chance for obstacles)
    scoreThreshold: 8000,
    color: '#ff0066', // Pink
    backgroundSpeed: 3,
  },
  master: {
    name: 'Master',
    description: 'Ultimate synthwave challenge',
    obstacleSpeed: 6,
    coinSpeed: 6,
    spawnRate: 0.04, // Increased from 0.035
    obstacleChance: 0.75, // Increased from 0.7 (75% chance for obstacles)
    scoreThreshold: 12000,
    color: '#8800ff', // Purple
    backgroundSpeed: 3.5,
  },
};

// Get level configuration based on score
export const getLevelFromScore = (score: number) => {
  if (score >= LEVEL_CONFIG.master.scoreThreshold) return 'master';
  if (score >= LEVEL_CONFIG.expert.scoreThreshold) return 'expert';
  if (score >= LEVEL_CONFIG.advanced.scoreThreshold) return 'advanced';
  if (score >= LEVEL_CONFIG.intermediate.scoreThreshold) return 'intermediate';
  return 'beginner';
};

// Get next level info
export const getNextLevelInfo = (currentLevel: string) => {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex < levels.length - 1) {
    const nextLevel = levels[currentIndex + 1];
    return {
      name: LEVEL_CONFIG[nextLevel].name,
      threshold: LEVEL_CONFIG[nextLevel].scoreThreshold,
    };
  }
  return null;
};

// Synthwave color palette
export const COLORS = {
  primary: '#ff00ff',      // Neon pink
  secondary: '#00ffff',    // Cyan
  accent: '#ffff00',       // Yellow
  background: '#0a0a0a',   // Dark background
  grid: '#00aaff',         // Blue grid
  sun: '#ff6600',          // Orange sun
  purple: '#8a2be2',       // Purple
  pink: '#ff1493',         // Deep pink
  blue: '#0080ff',         // Electric blue
};

// Game physics
export const PHYSICS = {
  gravity: 0.5,
  jumpPower: -12,
  terminalVelocity: 10,
  friction: 0.8,
};

// Scoring system
export const SCORING = {
  coinValue: 100,
  distanceMultiplier: 1,
  levelBonus: 500,
  winThreshold: 15000, // Increased for master level
};
