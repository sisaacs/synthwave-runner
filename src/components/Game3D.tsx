import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useGameEngine } from '../hooks/useGameEngine';
import { COLORS, GAME_CONFIG } from '../config/gameConfig';
import { Obstacle as ObstacleType, Coin as CoinType } from '../types/game';
import UI from './UI';

// Interface for Motorcycle props
interface MotorcycleProps {
  position: { x: number; y: number; z: number };
  isAlive: boolean;
}

// Interface for Obstacle3D props
interface Obstacle3DProps {
  obstacle: ObstacleType;
}

// Interface for Coin3D props
interface Coin3DProps {
  coin: CoinType;
}

// Interface for CameraController props
interface CameraControllerProps {
  playerPosition: { x: number; y: number };
}

// 3D Motorcycle component
function Motorcycle({ position, isAlive }: MotorcycleProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hoverOffset, setHoverOffset] = useState(0);

  useFrame((state) => {
    if (meshRef.current && isAlive) {
      // Hover animation
      setHoverOffset(Math.sin(state.clock.elapsedTime * 8) * 0.05);
      meshRef.current.position.y = position.y + hoverOffset;
      
      // Slight forward tilt
      meshRef.current.rotation.x = -0.1;
      
      // Engine glow effect
      meshRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
          child.material.emissive.setHex(0x00ffff);
          child.material.emissiveIntensity = intensity;
        }
      });
    }
  });

  return (
    <group ref={meshRef} position={[position.x, position.y, position.z]}>
      {/* Main body */}
      <Box args={[2, 0.8, 4]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={COLORS.primary} 
          emissive={0x00ffff}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {/* Front wheel */}
      <Cylinder args={[0.6, 0.6, 0.3, 16]} position={[0, -0.8, 1.5]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color={COLORS.blue} 
          emissive={0x0080ff}
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>
      
      {/* Rear wheel */}
      <Cylinder args={[0.6, 0.6, 0.3, 16]} position={[0, -0.8, -1.5]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color={COLORS.blue} 
          emissive={0x0080ff}
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>
      
      {/* Rider */}
      <Box args={[0.8, 1.5, 0.6]} position={[0, 0.8, -0.5]}>
        <meshStandardMaterial 
          color={COLORS.purple} 
          emissive={0x8a2be2}
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Helmet */}
      <Sphere args={[0.4]} position={[0, 1.8, -0.5]}>
        <meshStandardMaterial 
          color={COLORS.secondary} 
          emissive={0x00ffff}
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </Sphere>
      
      {/* Headlight */}
      <Sphere args={[0.2]} position={[0, 0.2, 2.2]}>
        <meshStandardMaterial 
          color={COLORS.accent} 
          emissive={0xffff00}
          emissiveIntensity={0.8}
        />
      </Sphere>
      
      {/* Exhaust pipes */}
      <Cylinder args={[0.1, 0.1, 1, 8]} position={[-0.6, -0.3, -2]} rotation={[0, 0, 0]}>
        <meshStandardMaterial 
          color={COLORS.purple} 
          emissive={0xff0066}
          emissiveIntensity={0.3}
        />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 1, 8]} position={[0.6, -0.3, -2]} rotation={[0, 0, 0]}>
        <meshStandardMaterial 
          color={COLORS.purple} 
          emissive={0xff0066}
          emissiveIntensity={0.3}
        />
      </Cylinder>
    </group>
  );
}

// 3D Obstacle component
function Obstacle3D({ obstacle }: Obstacle3DProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing glow effect
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      meshRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissiveIntensity = intensity;
        }
      });
      
      // Slight rotation for dynamic feel
      meshRef.current.rotation.y += 0.01;
    }
  });

  const renderObstacle = () => {
    switch (obstacle.type) {
      case 'barrier':
        return (
          <Box args={[2, 1.5, 0.5]} position={[0, 0.75, 0]}>
            <meshStandardMaterial 
              color="#ff0066" 
              emissive={0xff0066}
              emissiveIntensity={0.4}
              metalness={0.6}
              roughness={0.4}
            />
          </Box>
        );
      case 'spike':
        return (
          <>
            <Box args={[0.3, 2, 0.3]} position={[0, 1, 0]}>
              <meshStandardMaterial 
                color={COLORS.primary} 
                emissive={0xff00ff}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
            <Box args={[0.3, 2, 0.3]} position={[-0.5, 1.5, 0]} rotation={[0, 0, 0.3]}>
              <meshStandardMaterial 
                color={COLORS.primary} 
                emissive={0xff00ff}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
            <Box args={[0.3, 2, 0.3]} position={[0.5, 1.5, 0]} rotation={[0, 0, -0.3]}>
              <meshStandardMaterial 
                color={COLORS.primary} 
                emissive={0xff00ff}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
          </>
        );
      case 'wall':
        return (
          <>
            <Box args={[2, 0.8, 0.8]} position={[0, 0.4, 0]}>
              <meshStandardMaterial 
                color={COLORS.blue} 
                emissive={0x0080ff}
                emissiveIntensity={0.3}
                metalness={0.7}
                roughness={0.3}
              />
            </Box>
            <Box args={[2, 0.8, 0.8]} position={[0, 1.2, 0]}>
              <meshStandardMaterial 
                color={COLORS.blue} 
                emissive={0x0080ff}
                emissiveIntensity={0.3}
                metalness={0.7}
                roughness={0.3}
              />
            </Box>
            <Box args={[2, 0.8, 0.8]} position={[0, 2, 0]}>
              <meshStandardMaterial 
                color={COLORS.blue} 
                emissive={0x0080ff}
                emissiveIntensity={0.3}
                metalness={0.7}
                roughness={0.3}
              />
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <group 
      ref={meshRef} 
      position={[
        (obstacle.position.x - GAME_CONFIG.gameWidth / 2) / 50, 
        0, 
        -(obstacle.position.y - GAME_CONFIG.gameHeight / 2) / 50
      ]}
    >
      {renderObstacle()}
    </group>
  );
}

// 3D Coin component
function Coin3D({ coin }: Coin3DProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Spinning animation
      meshRef.current.rotation.y += 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
      
      // Pulsing glow
      const intensity = 0.6 + Math.sin(state.clock.elapsedTime * 5) * 0.4;
      const firstChild = meshRef.current.children[0];
      if (firstChild instanceof THREE.Mesh && firstChild.material instanceof THREE.MeshStandardMaterial) {
        firstChild.material.emissiveIntensity = intensity;
      }
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={[
        (coin.position.x - GAME_CONFIG.gameWidth / 2) / 50, 
        1, 
        -(coin.position.y - GAME_CONFIG.gameHeight / 2) / 50
      ]}
    >
      <Cylinder args={[0.3, 0.3, 0.1, 16]}>
        <meshStandardMaterial 
          color={COLORS.accent} 
          emissive={0xffff00}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>
    </group>
  );
}

// 3D Environment component
function Environment3D() {
  const roadRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Animate road grid
    if (roadRef.current) {
      roadRef.current.position.z = (state.clock.elapsedTime * 2) % 4 - 2;
    }
    
    // Animate sun
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005;
      const intensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      const firstChild = sunRef.current.children[0];
      if (firstChild instanceof THREE.Mesh && firstChild.material instanceof THREE.MeshStandardMaterial) {
        firstChild.material.emissiveIntensity = intensity;
      }
    }
  });

  return (
    <>
      {/* Road surface */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 40]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.8}
          emissive={0x000033}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Road grid lines */}
      <group ref={roadRef}>
        {Array.from({ length: 20 }, (_, i) => (
          <mesh key={i} position={[0, -1.9, i * 2 - 20]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 0.1]} />
            <meshStandardMaterial 
              color={COLORS.grid} 
              emissive={0x00aaff}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        
        {/* Lane dividers */}
        {[-2, 2].map((x, i) => (
          <mesh key={`lane-${i}`} position={[x, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, 40]} />
            <meshStandardMaterial 
              color={COLORS.secondary} 
              emissive={0x00ffff}
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      {/* Mountains on the sides */}
      {[-15, -12, -8, 8, 12, 15].map((x, i) => (
        <mesh key={`mountain-${i}`} position={[x, 2, -10]}>
          <coneGeometry args={[2 + Math.random(), 4 + Math.random() * 2, 8]} />
          <meshStandardMaterial 
            color={COLORS.purple} 
            emissive={0x8a2be2}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      {/* Water on the sides */}
      {[-15, 15].map((x, i) => (
        <mesh key={`water-${i}`} position={[x, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 40]} />
          <meshStandardMaterial 
            color="#0066cc" 
            transparent 
            opacity={0.6}
            emissive={0x0066cc}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Palm trees */}
      {[-10, -6, 6, 10].map((x, i) => (
        <group key={`tree-${i}`} position={[x, 0, -5 + (i % 2) * 10]}>
          {/* Trunk */}
          <Cylinder args={[0.2, 0.3, 4]} position={[0, 2, 0]}>
            <meshStandardMaterial 
              color={COLORS.purple} 
              emissive={0x8a2be2}
              emissiveIntensity={0.1}
            />
          </Cylinder>
          {/* Leaves */}
          <Sphere args={[1.5]} position={[0, 4.5, 0]}>
            <meshStandardMaterial 
              color={COLORS.primary} 
              emissive={0xff00ff}
              emissiveIntensity={0.2}
            />
          </Sphere>
        </group>
      ))}
      
      {/* Prominent sun in the distance */}
      <group ref={sunRef} position={[0, 8, -25]}>
        <Sphere args={[3]}>
          <meshStandardMaterial 
            color={COLORS.sun} 
            emissive={0xff6600}
            emissiveIntensity={1.2}
          />
        </Sphere>
        
        {/* Sun rays */}
        {Array.from({ length: 12 }, (_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos((i / 12) * Math.PI * 2) * 4,
              Math.sin((i / 12) * Math.PI * 2) * 4,
              0
            ]}
            rotation={[0, 0, (i / 12) * Math.PI * 2]}
          >
            <boxGeometry args={[0.1, 2, 0.1]} />
            <meshStandardMaterial 
              color={COLORS.accent} 
              emissive={0xffff00}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
      
      {/* Ambient particles/stars */}
      {Array.from({ length: 100 }, (_, i) => (
        <mesh 
          key={`star-${i}`} 
          position={[
            (Math.random() - 0.5) * 50,
            Math.random() * 20 + 5,
            (Math.random() - 0.5) * 50
          ]}
        >
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial 
            color={Math.random() > 0.5 ? COLORS.secondary : COLORS.accent} 
            emissive={Math.random() > 0.5 ? 0x00ffff : 0xffff00}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </>
  );
}

// Camera controller
function CameraController({ playerPosition }: CameraControllerProps) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Follow the player with smooth camera movement
    const targetX = (playerPosition.x - GAME_CONFIG.gameWidth / 2) / 50;
    const targetZ = -(playerPosition.y - GAME_CONFIG.gameHeight / 2) / 50 + 8;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    camera.position.y = 5;
    
    // Look slightly ahead
    camera.lookAt(targetX, 0, targetZ - 5);
  });
  
  return null;
}

// Main 3D Game component
const Game3D = () => {
  const { gameState, startGame, restartGame } = useGameEngine();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 5, 8], fov: 75 }}
        style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0033 50%, #330066 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} color="#4a0e4e" />
        <directionalLight 
          position={[0, 10, -20]} 
          intensity={0.8} 
          color="#ff6600"
          castShadow
        />
        <pointLight position={[0, 5, 5]} intensity={0.5} color="#00ffff" />
        
        {/* Environment */}
        <Environment3D />
        
        {/* Game objects - only render when playing */}
        {gameState.gameStatus === 'playing' && (
          <>
            {/* Player motorcycle */}
            <Motorcycle 
              position={{
                x: (gameState.player.position.x - GAME_CONFIG.gameWidth / 2) / 50,
                y: 0,
                z: -(gameState.player.position.y - GAME_CONFIG.gameHeight / 2) / 50
              }}
              isAlive={gameState.player.isAlive}
            />
            
            {/* Coins */}
            {gameState.coins.map(coin => (
              <Coin3D key={coin.id} coin={coin} />
            ))}
            
            {/* Obstacles */}
            {gameState.obstacles.map(obstacle => (
              <Obstacle3D key={obstacle.id} obstacle={obstacle} />
            ))}
            
            {/* Camera controller */}
            <CameraController playerPosition={gameState.player.position} />
          </>
        )}
        
        {/* Controls for debugging (can be removed) */}
        {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} /> */}
      </Canvas>
      
      {/* UI overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <UI
            score={gameState.score}
            gameStatus={gameState.gameStatus}
            onStart={startGame}
            onRestart={restartGame}
          />
        </div>
      </div>
    </div>
  );
};

export default Game3D;
