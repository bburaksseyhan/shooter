# Space Shooter Game

A 2D space-themed war game built with PixiJS where you control a spaceship and destroy incoming UFOs.

## Features

- Smooth space ship controls
- Dynamic starfield background
- UFO enemies with random movement patterns
- Score tracking
- Collision detection
- Game over state
- **NEW: Health System** - Player starts with 100% health and takes damage from UFOs and their bullets
- **NEW: Level System** - 5 progressively challenging levels with unique themes
- **NEW: Level Progression** - Advance through levels by reaching required scores
- **NEW: Visual Level Transitions** - Background color changes and level announcements
- **NEW: Enhanced Game Over Screen** - Shows final score, level reached, and restart option

## Gameplay

- Control your spaceship with arrow keys
- Shoot UFOs with the spacebar
- Avoid UFOs and their bullets
- Manage your health as you progress through levels
- Reach higher scores to advance to more challenging levels

## Levels

1. **Beginner's Journey** - Start your space adventure
2. **Asteroid Field** - Navigate through a more challenging environment
3. **Enemy Fleet** - Face an increasing number of enemies
4. **Boss Battle** - Test your skills against tougher opponents
5. **Final Frontier** - The ultimate challenge

Each level features:
- Increasing difficulty
- Faster UFOs
- More frequent enemy spawns
- Higher damage values
- Greater point rewards
- Unique background colors

## Controls

- Left Arrow: Move left
- Right Arrow: Move right
- Spacebar: Shoot

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

This game is configured for deployment on Vercel. Simply connect your repository to Vercel and it will automatically deploy your game.

## Technologies Used

- PixiJS for 2D rendering
- Vite for development and building
- Modern JavaScript (ES6+) 