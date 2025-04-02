export const GAME_CONFIG = {
    // Display settings
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
    BACKGROUND_COLOR: 0x000000,
    BACKGROUND_SPEED: 0.5, // Base speed for background stars
    
    // Game objects
    STAR_COUNT: 100,
    
    // Player settings
    PLAYER_SPEED: 5,
    PLAYER_COLOR: 0x00ff00,
    
    // Bullet settings
    BULLET_SPEED: 7,
    BULLET_COLOR: 0xffffff,
    BULLET_RADIUS: 3,
    
    // Enemy settings
    ENEMY_TYPES: [
        {
            name: 'small',
            type: 'small',
            width: 30,
            height: 15,
            speed: 2.0,
            health: 1,
            score: 100,
            spawnRate: 0.01,
            color: 0xFF0000, // Bright red
            collisionRadius: 15,
            domeWidth: 15,
            domeHeight: 8,
            lightOffset: 10,
            lightRadius: 3
        },
        {
            name: 'medium',
            type: 'medium',
            width: 40,
            height: 20,
            speed: 1.5,
            health: 2,
            score: 200,
            spawnRate: 0.007,
            color: 0xFF3333, // Lighter red
            collisionRadius: 20,
            domeWidth: 20,
            domeHeight: 10,
            lightOffset: 15,
            lightRadius: 4
        },
        {
            name: 'large',
            type: 'large',
            width: 50,
            height: 25,
            speed: 1.0,
            health: 3,
            score: 300,
            spawnRate: 0.005,
            color: 0xFF6666, // Lightest red
            collisionRadius: 25,
            domeWidth: 25,
            domeHeight: 12,
            lightOffset: 20,
            lightRadius: 5
        }
    ],
    ENEMY_SETTINGS: {
        MAX_ENEMIES: 5, // Maximum number of enemies on screen at once
        SPAWN_COOLDOWN: 1000, // Minimum time between spawns in milliseconds
        BASE_SPEED: 0.8, // Base speed multiplier for enemies
        SPEED_INCREMENT: 0.1, // Speed increase per level
        MAX_SPEED_MULTIPLIER: 1.5 // Maximum speed multiplier
    },
    
    // Score settings
    SCORE_FONT: 'Press Start 2P, monospace',
    SCORE_FONT_SIZE: 16,
    SCORE_COLOR: 0xFFFFFF,
    
    // Level settings
    LEVELS: [
        {
            level: 1,
            name: "Beginner's Journey",
            requiredScore: 0,
            maxEnemies: 3,
            enemySpeedMultiplier: 0.8,
            spawnRateMultiplier: 0.7,
            spawnCooldown: 1200,
            backgroundSpeed: 0.5
        },
        {
            level: 2,
            name: "Alien Invasion",
            requiredScore: 100,
            maxEnemies: 4,
            enemySpeedMultiplier: 1.0,
            spawnRateMultiplier: 0.9,
            spawnCooldown: 1000,
            backgroundSpeed: 0.7
        },
        {
            level: 3,
            name: "UFO Fleet",
            requiredScore: 300,
            maxEnemies: 5,
            enemySpeedMultiplier: 1.2,
            spawnRateMultiplier: 1.0,
            spawnCooldown: 900,
            backgroundSpeed: 0.9
        },
        {
            level: 4,
            name: "Cosmic Battle",
            requiredScore: 600,
            maxEnemies: 6,
            enemySpeedMultiplier: 1.4,
            spawnRateMultiplier: 1.2,
            spawnCooldown: 800,
            backgroundSpeed: 1.1
        },
        {
            level: 5,
            name: "Galactic War",
            requiredScore: 1000,
            maxEnemies: 7,
            enemySpeedMultiplier: 1.6,
            spawnRateMultiplier: 1.4,
            spawnCooldown: 700,
            backgroundSpeed: 1.3
        }
    ]
}; 