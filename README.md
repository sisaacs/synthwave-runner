# Synthwave Runner

A browser-based infinite runner game with a retro synthwave aesthetic. Ride your lightcycle through the neon grid, collect golden coins, and avoid obstacles!

## Features

- **Synthwave Aesthetic**: Dark backgrounds, neon colors, classic synthwave sun, and retro grid patterns
- **Infinite Runner Mechanics**: Auto-scrolling gameplay with lane-switching controls
- **Lightcycle Player**: Detailed player character riding a glowing lightcycle
- **Parallax Background**: Scrolling palm trees, mountains, and grid patterns
- **Multiple Obstacle Types**: Barriers, spikes, and walls with unique designs
- **Collectible Coins**: Animated golden coins with particle effects
- **Win/Lose Conditions**: Reach the target score to win, or crash into obstacles
- **Responsive Design**: Scales to different screen sizes
- **Synthwave UI**: Retro fonts, neon colors, and glowing effects

## Game Controls

- **Left Arrow (←)**: Move to the left lane
- **Right Arrow (→)**: Move to the right lane

## Game Rules

1. Your lightcycle automatically moves forward
2. Switch between 3 lanes to collect coins and avoid obstacles
3. Collect golden coins to increase your score
4. Avoid obstacles (barriers, spikes, walls) or the game ends
5. Reach 5,000 points to win the game!

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── Background.tsx   # Parallax background with synthwave elements
│   ├── Coin.tsx        # Collectible coin component
│   ├── Game.tsx        # Main game orchestrator
│   ├── Obstacle.tsx    # Obstacle components (barriers, spikes, walls)
│   ├── Player.tsx      # Lightcycle player component
│   └── UI.tsx          # Game interface and menus
├── config/             # Game configuration
│   └── gameConfig.ts   # Constants and settings
├── hooks/              # Custom React hooks
│   └── useGameEngine.ts # Main game logic and state management
├── types/              # TypeScript type definitions
│   └── game.ts         # Game object interfaces
├── utils/              # Utility functions
│   └── gameUtils.ts    # Helper functions for game mechanics
├── App.tsx             # Main App component
├── App.css             # Styling
└── index.tsx           # Entry point
```

## Technical Details

- **Framework**: React 18 with TypeScript
- **Styling**: CSS-in-JS with synthwave color palette
- **Game Loop**: RequestAnimationFrame for smooth 60fps gameplay
- **State Management**: Custom React hooks with useCallback optimization
- **Collision Detection**: Bounding box collision system
- **Responsive**: Scales automatically for different screen sizes

## Customization

### Game Configuration
Edit `src/config/gameConfig.ts` to modify:
- Game dimensions and lane settings
- Spawn rates and speeds
- Scoring system
- Color palette

### Adding New Obstacles
1. Add new obstacle type to `src/types/game.ts`
2. Implement rendering in `src/components/Obstacle.tsx`
3. Update spawn logic in `src/hooks/useGameEngine.ts`

### Modifying Visuals
- Colors: Update `COLORS` object in `gameConfig.ts`
- Fonts: Modify font imports in `public/index.html`
- Animations: Edit CSS animations in component files

## Performance Optimization

- Uses `useCallback` for expensive operations
- Filters off-screen objects to reduce rendering load
- Optimized collision detection with early exits
- Minimal re-renders with proper state management

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (with touch controls coming soon)

## Future Enhancements

- [ ] Touch controls for mobile devices
- [ ] Power-ups and special abilities
- [ ] Multiple difficulty levels
- [ ] High score persistence
- [ ] Sound effects and synthwave music
- [ ] Additional vehicle types
- [ ] Multiplayer support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects!

---

Enjoy riding through the neon grid! 🌆✨
