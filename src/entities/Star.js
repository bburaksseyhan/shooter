import * as PIXI from 'pixi.js';
import { GameConfig } from '../config';

export class Star {
    constructor() {
        this.sprite = new PIXI.Graphics();
        this.drawStar();
        
        // Random position
        this.sprite.x = Math.random() * GameConfig.width;
        this.sprite.y = Math.random() * GameConfig.height;
        
        // Random speed
        this.speed = Math.random() * 2 + 1;
    }

    drawStar() {
        this.sprite.clear();
        this.sprite.beginFill(0xffffff);
        this.sprite.drawCircle(0, 0, 1);
        this.sprite.endFill();
    }

    update() {
        this.sprite.y += this.speed;
        
        // Reset star position when it goes off screen
        if (this.sprite.y > GameConfig.height) {
            this.sprite.y = 0;
            this.sprite.x = Math.random() * GameConfig.width;
        }
    }
} 