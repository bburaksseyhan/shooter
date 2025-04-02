# Space Shooter Game

A retro-style space shooter game built with JavaScript and PIXI.js.

![Space Shooter Game](screenshot.png)

## Features

- Retro-style graphics with PIXI.js
- Multiple enemy types with different behaviors
- Progressive difficulty with 10 levels
- Score tracking and high scores
- Sound effects and background music
- Responsive controls

## Game Controls

- **Arrow Keys**: Move the player ship
- **Space**: Shoot
- **Enter**: Start game
- **R**: Restart after game over

## Gameplay

- Destroy enemy UFOs to earn points
- Different enemy types have different point values
- Progress through levels by reaching score thresholds
- Game difficulty increases with each level
- Game ends if an enemy reaches the bottom of the screen

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/space-shooter.git
   cd space-shooter
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:1234
   ```

## Deployment

This project is configured for easy deployment to Vercel:

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy:
   ```
   vercel
   ```

## Technologies Used

- JavaScript (ES6+)
- PIXI.js for rendering
- Parcel for bundling
- Vercel for deployment

## Project Structure

```
space-shooter/
├── src/
│   ├── components/       # Game components (Player, Enemy, etc.)
│   ├── config/           # Game configuration
│   ├── utils/            # Utility functions
│   ├── assets/           # Game assets (images, sounds)
│   └── game.js           # Main game logic
├── index.html            # Entry point
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

## Development

To make changes to the game:

1. Edit the source files in the `src` directory
2. The development server will automatically reload with your changes
3. Build for production with `npm run build`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic arcade space shooter games
- Thanks to the PIXI.js community for their excellent documentation 