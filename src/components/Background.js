import * as PIXI from 'pixi.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Background {
    constructor(app, levelManager) {
        this.app = app;
        this.levelManager = levelManager;
        this.stars = [];
        this.createStars();
    }
    
    createStars() {
        for (let i = 0; i < GAME_CONFIG.STAR_COUNT; i++) {
            const star = new PIXI.Graphics();
            star.beginFill(0xFFFFFF);
            star.drawCircle(0, 0, Math.random() * 2 + 1);
            star.endFill();
            
            star.x = Math.random() * GAME_CONFIG.GAME_WIDTH;
            star.y = Math.random() * GAME_CONFIG.GAME_HEIGHT;
            
            // Random star brightness (alpha)
            star.alpha = Math.random() * 0.5 + 0.5;
            
            this.stars.push(star);
            this.app.stage.addChild(star);
        }
    }
    
    update() {
        // Get current level's background speed
        const backgroundSpeed = this.levelManager.getBackgroundSpeed();
        
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.y += backgroundSpeed;
            
            // Reset star position when it goes off screen
            if (star.y > GAME_CONFIG.GAME_HEIGHT) {
                star.y = 0;
                star.x = Math.random() * GAME_CONFIG.GAME_WIDTH;
            }
        }
    }
} 