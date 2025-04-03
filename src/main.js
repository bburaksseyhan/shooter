import * as PIXI from 'pixi.js';
import { Player } from './entities/Player';
import { UFO } from './entities/UFO';
import { Star } from './entities/Star';
import { GameConfig } from './config';

class Game {
    constructor() {
        this.app = new PIXI.Application({
            width: GameConfig.width,
            height: GameConfig.height,
            backgroundColor: 0x000000,
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

        this.init();
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

        // Start game loop
        this.app.ticker.add(() => this.gameLoop());

        // Spawn UFOs periodically
        setInterval(() => this.spawnUFO(), GameConfig.ufoSpawnInterval);
    }

    spawnUFO() {
        const ufo = new UFO();
        this.ufos.push(ufo);
        this.app.stage.addChild(ufo.sprite);
    }

    gameLoop() {
        // Update stars
        this.stars.forEach(star => star.update());

        // Update player
        this.player.update();

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
                    this.score += GameConfig.ufoPoints;
                    this.scoreText.text = `Score: ${this.score}`;
                }
            });

            // Check collision with player
            if (this.checkCollision(this.player, ufo)) {
                const isDead = this.player.takeDamage(GameConfig.ufoCollisionDamage);
                if (isDead) {
                    this.gameOver();
                }
            }

            // Check collision with UFO bullets
            ufo.bullets.forEach((bullet, bulletIndex) => {
                if (this.checkCollision(bullet, this.player)) {
                    const isDead = this.player.takeDamage(GameConfig.ufoBulletDamage);
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
        const gameOverText = new PIXI.Text('Game Over!', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xff0000,
        });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(GameConfig.width / 2, GameConfig.height / 2);
        this.app.stage.addChild(gameOverText);
    }
}

// Start the game
new Game(); 