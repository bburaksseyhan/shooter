import * as PIXI from 'pixi.js';
import { Player } from './entities/Player';
import { UFO } from './entities/UFO';
import { Star } from './entities/Star';
import { GameConfig } from './config';
import { LevelManager } from './managers/LevelManager';
import { BadgeManager } from './managers/BadgeManager';

class Game {
    constructor() {
        // Check if we're on a mobile device
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Set up responsive canvas
        this.setupResponsiveCanvas();
        
        this.app = new PIXI.Application({
            width: this.canvasWidth,
            height: this.canvasHeight,
            backgroundColor: 0x000000,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        document.body.appendChild(this.app.view);

        this.score = 0;
        this.scoreText = new PIXI.Text('Score: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
        });
        this.scoreText.position.set(10, 10);
        this.app.stage.addChild(this.scoreText);

        // Level text
        this.levelText = new PIXI.Text('Level: 1', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
        });
        this.levelText.position.set(10, 40);
        this.app.stage.addChild(this.levelText);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        this.init();
    }

    setupResponsiveCanvas() {
        // Calculate canvas size based on screen size
        if (this.isMobile) {
            // For mobile, use full screen width and a reasonable height
            this.canvasWidth = window.innerWidth;
            this.canvasHeight = window.innerHeight;
        } else {
            // For desktop, use fixed size
            this.canvasWidth = GameConfig.width;
            this.canvasHeight = GameConfig.height;
        }
    }

    handleResize() {
        // Update canvas size on resize
        this.setupResponsiveCanvas();
        
        // Resize the renderer
        this.app.renderer.resize(this.canvasWidth, this.canvasHeight);
        
        // Update UI positions
        this.updateUIPositions();
    }

    updateUIPositions() {
        // Update score text position
        this.scoreText.position.set(10, 10);
        
        // Update level text position
        this.levelText.position.set(10, 40);
        
        // Update player position if it exists
        if (this.player) {
            this.player.sprite.x = this.canvasWidth / 2;
            this.player.sprite.y = this.canvasHeight - 100;
            
            // Update health bar position
            this.player.healthBar.x = this.player.sprite.x;
            this.player.healthBar.y = this.player.sprite.y;
            
            // Update touch controls position
            if (this.isMobile && this.player.touchControls) {
                this.player.touchControls.children[0].y = this.canvasHeight - 50; // Left button
                this.player.touchControls.children[1].y = this.canvasHeight - 50; // Right button
                this.player.touchControls.children[2].y = this.canvasHeight - 50; // Shoot button
                this.player.touchControls.children[2].x = this.canvasWidth - 50; // Shoot button
            }
        }
    }

    init() {
        // Create starfield
        this.stars = [];
        for (let i = 0; i < GameConfig.starCount; i++) {
            const star = new Star();
            this.stars.push(star);
            this.app.stage.addChild(star.sprite);
        }

        // Create player
        this.player = new Player();
        this.app.stage.addChild(this.player.sprite);
        this.app.stage.addChild(this.player.healthBar);

        // UFO array
        this.ufos = [];

        // Initialize level manager
        this.levelManager = new LevelManager(this);
        this.updateLevelText();

        // Start game loop
        this.app.ticker.add((delta) => this.gameLoop(delta));

        // Spawn UFOs periodically
        this.spawnUFO();
    }

    updateLevelText() {
        const levelConfig = this.levelManager.getCurrentLevel();
        this.levelText.text = `Level: ${levelConfig.level} - ${levelConfig.name}`;
    }

    spawnUFO() {
        const levelConfig = this.levelManager.getCurrentLevel();
        const ufo = new UFO(levelConfig);
        this.ufos.push(ufo);
        this.app.stage.addChild(ufo.sprite);
        
        // Schedule next UFO spawn based on current level
        setTimeout(() => this.spawnUFO(), levelConfig.ufoSpawnInterval);
    }

    gameLoop(delta) {
        // Update stars
        this.stars.forEach(star => star.update());

        // Update player
        this.player.update();

        // Update level manager
        this.levelManager.update(delta);

        // Update UFOs
        this.ufos.forEach((ufo, index) => {
            ufo.update();
            
            // Check collision with player's bullets
            this.player.bullets.forEach((bullet, bulletIndex) => {
                if (this.checkCollision(bullet, ufo)) {
                    this.app.stage.removeChild(bullet);
                    this.player.bullets.splice(bulletIndex, 1);
                    ufo.destroy();
                    this.app.stage.removeChild(ufo.sprite);
                    this.ufos.splice(index, 1);
                    
                    // Update score based on current level
                    const levelConfig = this.levelManager.getCurrentLevel();
                    this.score += levelConfig.ufoPoints;
                    this.scoreText.text = `Score: ${this.score}`;
                    
                    // Check for level up
                    if (this.levelManager.checkLevelUp()) {
                        this.updateLevelText();
                    }
                }
            });

            // Check collision with player
            if (this.checkCollision(this.player, ufo)) {
                const levelConfig = this.levelManager.getCurrentLevel();
                const isDead = this.player.takeDamage(levelConfig.ufoCollisionDamage);
                if (isDead) {
                    this.gameOver();
                }
            }

            // Check collision with UFO bullets
            ufo.bullets.forEach((bullet, bulletIndex) => {
                if (this.checkCollision(bullet, this.player)) {
                    const levelConfig = this.levelManager.getCurrentLevel();
                    const isDead = this.player.takeDamage(levelConfig.ufoBulletDamage);
                    if (isDead) {
                        this.gameOver();
                    }
                }
            });
        });
    }

    checkCollision(obj1, obj2) {
        const bounds1 = obj1.sprite ? obj1.sprite.getBounds() : obj1.getBounds();
        const bounds2 = obj2.sprite ? obj2.sprite.getBounds() : obj2.getBounds();

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }

    gameOver() {
        this.app.ticker.stop();
        
        // Show game over text
        const gameOverText = new PIXI.Text('Game Over!', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xff0000,
        });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(GameConfig.width / 2, GameConfig.height / 2);
        this.app.stage.addChild(gameOverText);
        
        // Show final score
        const finalScoreText = new PIXI.Text(`Final Score: ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
        });
        finalScoreText.anchor.set(0.5);
        finalScoreText.position.set(GameConfig.width / 2, GameConfig.height / 2 + 60);
        this.app.stage.addChild(finalScoreText);
        
        // Show level reached
        const levelConfig = this.levelManager.getCurrentLevel();
        const levelReachedText = new PIXI.Text(`Level Reached: ${levelConfig.level}`, {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
        });
        levelReachedText.anchor.set(0.5);
        levelReachedText.position.set(GameConfig.width / 2, GameConfig.height / 2 + 120);
        this.app.stage.addChild(levelReachedText);
        
        // Add restart button
        const restartButton = new PIXI.Graphics();
        restartButton.beginFill(0x00ff00);
        restartButton.drawRoundedRect(-100, -30, 200, 60, 10);
        restartButton.endFill();
        
        const restartText = new PIXI.Text('Restart', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x000000,
        });
        restartText.anchor.set(0.5);
        restartButton.addChild(restartText);
        
        restartButton.position.set(GameConfig.width / 2, GameConfig.height / 2 + 200);
        restartButton.interactive = true;
        restartButton.buttonMode = true;
        
        restartButton.on('pointerdown', () => {
            // Remove all game over elements
            this.app.stage.removeChild(gameOverText);
            this.app.stage.removeChild(finalScoreText);
            this.app.stage.removeChild(levelReachedText);
            this.app.stage.removeChild(restartButton);
            
            // Reset game
            this.resetGame();
        });
        
        this.app.stage.addChild(restartButton);
    }
    
    resetGame() {
        // Reset score
        this.score = 0;
        this.scoreText.text = 'Score: 0';
        
        // Reset player
        this.app.stage.removeChild(this.player.sprite);
        this.app.stage.removeChild(this.player.healthBar);
        this.player = new Player();
        this.app.stage.addChild(this.player.sprite);
        this.app.stage.addChild(this.player.healthBar);
        
        // Clear UFOs
        this.ufos.forEach(ufo => {
            ufo.destroy();
            this.app.stage.removeChild(ufo.sprite);
        });
        this.ufos = [];
        
        // Reset level manager
        this.levelManager = new LevelManager(this);
        this.updateLevelText();
        
        // Reset background
        this.app.renderer.backgroundColor = 0x000000;
        
        // Restart game loop
        this.app.ticker.start();
        
        // Start spawning UFOs
        this.spawnUFO();
    }
}

// Start the game
new Game(); 