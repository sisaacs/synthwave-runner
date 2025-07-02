import React, { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

interface ConfettiProps {
  isActive: boolean;
  intensity?: 'normal' | 'celebration'; // celebration for expert level
  duration?: number;
  onComplete?: () => void;
}

const SYNTHWAVE_COLORS = [
  '#ff00ff', // Neon pink
  '#00ffff', // Cyan
  '#ffff00', // Yellow
  '#ff6600', // Orange
  '#8a2be2', // Purple
  '#ff1493', // Deep pink
  '#0080ff', // Electric blue
  '#00ff00', // Neon green
];

const Confetti: React.FC<ConfettiProps> = ({ 
  isActive, 
  intensity = 'normal', 
  duration = 3000,
  onComplete 
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [animationId, setAnimationId] = useState<NodeJS.Timeout | null>(null);

  const createParticle = (x: number, y: number): ConfettiParticle => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -8 - 2,
      color: SYNTHWAVE_COLORS[Math.floor(Math.random() * SYNTHWAVE_COLORS.length)],
      size: Math.random() * 6 + 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      life: 0,
      maxLife: Math.random() * 120 + 60,
    };
  };

  const spawnParticles = () => {
    const newParticles: ConfettiParticle[] = [];
    const particleCount = intensity === 'celebration' ? 15 : 8;
    
    // Spawn from multiple points across the top
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 800; // Game width
      const y = -10;
      newParticles.push(createParticle(x, y));
    }
    
    return newParticles;
  };

  const updateParticles = (particles: ConfettiParticle[]): ConfettiParticle[] => {
    return particles
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.3, // Gravity
        rotation: particle.rotation + particle.rotationSpeed,
        life: particle.life + 1,
      }))
      .filter(particle => 
        particle.life < particle.maxLife && 
        particle.y < 650 && 
        particle.x > -50 && 
        particle.x < 850
      );
  };

  const animate = () => {
    setParticles(prevParticles => {
      let updatedParticles = updateParticles(prevParticles);
      
      // Spawn new particles occasionally
      if (Math.random() < (intensity === 'celebration' ? 0.3 : 0.15)) {
        updatedParticles = [...updatedParticles, ...spawnParticles()];
      }
      
      return updatedParticles;
    });
  };

  useEffect(() => {
    if (isActive) {
      // Initial burst
      setParticles(spawnParticles());
      
      // Start animation loop
      const id = setInterval(animate, 16); // ~60fps
      setAnimationId(id);
      
      // Stop after duration
      const timeout = setTimeout(() => {
        clearInterval(id);
        setAnimationId(null);
        
        // Clear particles after a delay
        setTimeout(() => {
          setParticles([]);
          onComplete?.();
        }, 2000);
      }, duration);
      
      return () => {
        clearInterval(id);
        clearTimeout(timeout);
      };
    } else {
      if (animationId) {
        clearInterval(animationId);
        setAnimationId(null);
      }
      setParticles([]);
    }
  }, [isActive, intensity, duration]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: `rotate(${particle.rotation}deg)`,
            opacity: Math.max(0, 1 - particle.life / particle.maxLife),
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transition: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
