import { GameObject, Position } from '../types/game';
import { LANE_POSITIONS, GAME_CONFIG } from '../config/gameConfig';

// Generate unique IDs for game objects
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Check collision between two game objects (reduced sensitivity)
export const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
  // Reduced collision box size for less sensitive detection
  const obj1Bounds = {
    left: obj1.position.x - 15,    // Reduced from 25 to 15
    right: obj1.position.x + 15,   // Reduced from 25 to 15
    top: obj1.position.y - 15,     // Reduced from 25 to 15
    bottom: obj1.position.y + 15,  // Reduced from 25 to 15
  };

  const obj2Bounds = {
    left: obj2.position.x - 15,    // Reduced from 25 to 15
    right: obj2.position.x + 15,   // Reduced from 25 to 15
    top: obj2.position.y - 15,     // Reduced from 25 to 15
    bottom: obj2.position.y + 15,  // Reduced from 25 to 15
  };

  return (
    obj1Bounds.left < obj2Bounds.right &&
    obj1Bounds.right > obj2Bounds.left &&
    obj1Bounds.top < obj2Bounds.bottom &&
    obj1Bounds.bottom > obj2Bounds.top
  );
};

// Get lane position from lane index
export const getLanePosition = (lane: number): number => {
  return LANE_POSITIONS[Math.max(0, Math.min(4, lane))];
};

// Clamp lane to valid range
export const clampLane = (lane: number): number => {
  return Math.max(0, Math.min(4, lane));
};

// Check if object is off screen
export const isOffScreen = (position: Position): boolean => {
  return (
    position.y > GAME_CONFIG.gameHeight + 100 ||
    position.y < -100 ||
    position.x < -100 ||
    position.x > GAME_CONFIG.gameWidth + 100
  );
};

// Random number between min and max
export const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Random integer between min and max (inclusive)
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Linear interpolation
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Easing function for smooth animations
export const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};
