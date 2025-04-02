import { GAME_CONFIG } from './config/gameConfig.js';
import { InputHandler } from './utils/inputHandler.js';
import { Player } from './components/Player.js';
import { Enemy } from './components/Enemy.js';
import { Background } from './components/Background.js';
import { Score } from './components/Score.js';
import { LevelManager } from './components/LevelManager.js';
import { SplashScreen } from './components/SplashScreen.js';

class Game {
    constructor() {
        // Wait for DOM to be ready
        window.addEventListener('load', () => {
            this.init();
        });
    }

    init() {
        this.app = this.createApplication();
        this.inputHandler = new InputHandler();
        this.levelManager = new LevelManager(this.app);
        this.background = new Background(this.app, this.levelManager);
        this.player = new Player(this.app);
        this.enemy = new Enemy(this.app, this.levelManager);
        this.score = new Score(this.app);
        this.gameOver = false;
        this.spacePressed = false;
        this.enemyCountText = this.createEnemyCountText();
        
        // Create and show splash screen
        this.splashScreen = new SplashScreen(this.app, () => this.startGame());
        
        // Start the game loop
        this.app.ticker.add(() => this.gameLoop());
    }

    createApplication() {
        const app = new PIXI.Application({
            width: GAME_CONFIG.GAME_WIDTH,
            height: GAME_CONFIG.GAME_HEIGHT,
            backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true
        });
        
        // Add the canvas to the DOM
        document.body.appendChild(app.view);
        
        return app;
    }
    
    createEnemyCountText() {
        const text = new PIXI.Text('Enemies: 0/5', {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: GAME_CONFIG.SCORE_FONT_SIZE,
            fill: GAME_CONFIG.SCORE_COLOR,
            align: 'right'
        });
        text.x = GAME_CONFIG.GAME_WIDTH - 200;
        text.y = 20;
        this.app.stage.addChild(text);
        return text;
    }
    
    updateEnemyCountText() {
        this.enemyCountText.text = `Enemies: ${this.enemy.getEnemyCount()}/${this.levelManager.getMaxEnemies()}`;
    }
    
    startGame() {
        this.player.addToStage();
        this.setupGameLoop();
    }
    
    setupGameLoop() {
        this.app.ticker.add((delta) => this.gameLoop(delta));
    }
    
    gameLoop(delta) {
        if (this.gameOver) return;
        
        // Update level manager
        this.levelManager.update(delta);
        
        // Check for level up
        if (this.levelManager.checkLevelUp(this.score.getScore())) {
            console.log('Level up! Current level:', this.levelManager.getCurrentLevel());
        }
        
        // Update background
        this.background.update();
        
        // Update player
        this.player.update(this.inputHandler);
        this.player.updateBullets();
        
        // Handle shooting
        if (this.inputHandler.isSpacePressed() && !this.spacePressed) {
            this.player.shoot();
            this.spacePressed = true;
        } else if (!this.inputHandler.isSpacePressed()) {
            this.spacePressed = false;
        }
        
        // Update enemies
        if (this.enemy.shouldSpawnEnemy()) {
            this.enemy.spawnEnemy();
        }
        
        // Check if enemy reached bottom
        if (this.enemy.update()) {
            this.gameOver = true;
            console.log('Game Over! Final Score:', this.score.getScore());
            this.showGameOver();
            return;
        }
        
        // Check collisions - improved collision detection
        const { collision, score } = this.checkCollisions();
        
        // Update score if collision occurred
        if (collision) {
            this.score.updateScore(score);
        }
        
        // Update enemy count text
        this.updateEnemyCountText();
    }
    
    checkCollisions() {
        let collision = false;
        let score = 0;
        
        for (let i = this.player.bullets.length - 1; i >= 0; i--) {
            const bullet = this.player.bullets[i];
            if (!bullet) continue;
            
            for (let j = this.enemy.getEnemies().length - 1; j >= 0; j--) {
                const enemy = this.enemy.getEnemies()[j];
                if (!enemy) continue;
                
                // Calculate distance between bullet and enemy center
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Check if distance is less than collision radius
                if (distance < enemy.type.collisionRadius) {
                    // Remove bullet and enemy
                    this.player.removeBullet(bullet);
                    this.app.stage.removeChild(enemy);
                    this.enemy.getEnemies().splice(j, 1);
                    
                    // Add score
                    score += enemy.score;
                    collision = true;
                    
                    // Break out of enemy loop since bullet is destroyed
                    break;
                }
            }
        }
        
        return { collision, score };
    }
    
    showGameOver() {
        const gameOverText = new PIXI.Text('GAME OVER', {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: GAME_CONFIG.SCORE_FONT_SIZE * 1.2,
            fill: 0xFF0000,
            align: 'center'
        });
        gameOverText.x = GAME_CONFIG.GAME_WIDTH / 2;
        gameOverText.y = GAME_CONFIG.GAME_HEIGHT / 2 - 50;
        gameOverText.anchor.set(0.5);
        this.app.stage.addChild(gameOverText);
        
        const finalScoreText = new PIXI.Text(`Final Score: ${this.score.getScore()}`, {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: GAME_CONFIG.SCORE_FONT_SIZE,
            fill: GAME_CONFIG.SCORE_COLOR,
            align: 'center'
        });
        finalScoreText.x = GAME_CONFIG.GAME_WIDTH / 2;
        finalScoreText.y = GAME_CONFIG.GAME_HEIGHT / 2 + 20;
        finalScoreText.anchor.set(0.5);
        this.app.stage.addChild(finalScoreText);
        
        const restartText = new PIXI.Text('Press R to Restart', {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: GAME_CONFIG.SCORE_FONT_SIZE * 0.8,
            fill: 0xFFFF00,
            align: 'center'
        });
        restartText.x = GAME_CONFIG.GAME_WIDTH / 2;
        restartText.y = GAME_CONFIG.GAME_HEIGHT / 2 + 80;
        restartText.anchor.set(0.5);
        this.app.stage.addChild(restartText);
        
        // Add restart functionality
        const restartHandler = (e) => {
            if (e.key === 'r' || e.key === 'R') {
                document.removeEventListener('keydown', restartHandler);
                this.restartGame();
            }
        };
        
        // Make sure to add the event listener
        document.addEventListener('keydown', restartHandler);
    }
    
    restartGame() {
        // Remove all game objects
        this.app.stage.removeChildren();
        
        // Reset game state
        this.gameOver = false;
        this.spacePressed = false;
        
        // Reinitialize components
        this.levelManager = new LevelManager(this.app);
        this.background = new Background(this.app, this.levelManager);
        this.player = new Player(this.app);
        this.enemy = new Enemy(this.app, this.levelManager);
        this.score = new Score(this.app);
        this.enemyCountText = this.createEnemyCountText();
        
        // Show splash screen again
        this.splashScreen = new SplashScreen(this.app, () => this.startGame());
    }
}

// Start the game
new Game(); 