import * as PIXI from 'pixi.js';
import { GameConfig } from '../config';

export class UFO {
    constructor() {
        this.sprite = new PIXI.Graphics();
        this.drawUFO();
        
        // Random starting position at the top of the screen
        this.sprite.x = Math.random() * (GameConfig.width - 40) + 20;
        this.sprite.y = -20;
        
        // Random movement direction
        this.direction = Math.random() * Math.PI * 2;
        
        // Bullets array
        this.bullets = [];
        
        // Start shooting periodically
        this.shootInterval = setInterval(() => this.shoot(), GameConfig.ufoShootInterval);
    }

    drawUFO() {
        this.sprite.clear();
        this.sprite.lineStyle(2, 0xff0000);
        this.sprite.beginFill(0xff0000);
        
        // Draw UFO shape
        this.sprite.drawEllipse(0, 0, 20, 10);
        this.sprite.drawEllipse(0, 0, 15, 5);
        
        this.sprite.endFill();
    }

    shoot() {
        const bullet = new PIXI.Graphics();
        bullet.beginFill(0xff0000);
        bullet.drawCircle(0, 0, 3);
        bullet.endFill();
        
        bullet.x = this.sprite.x;
        bullet.y = this.sprite.y + 10;
        
        this.bullets.push(bullet);
        if (this.sprite.parent) {
            this.sprite.parent.addChild(bullet);
        }
    }

    update() {
        // Move UFO
        this.sprite.x += Math.cos(this.direction) * GameConfig.ufoSpeed;
        this.sprite.y += Math.sin(this.direction) * GameConfig.ufoSpeed;
        
        // Bounce off screen edges
        if (this.sprite.x < 20 || this.sprite.x > GameConfig.width - 20) {
            this.direction = Math.PI - this.direction;
        }
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y += GameConfig.ufoBulletSpeed;
            
            // Remove bullets that are off screen
            if (bullet.y > GameConfig.height) {
                if (bullet.parent) {
                    bullet.parent.removeChild(bullet);
                }
                this.bullets.splice(i, 1);
            }
        }
        
        // Remove if off screen
        if (this.sprite.y > GameConfig.height + 20) {
            if (this.sprite.parent) {
                this.sprite.parent.removeChild(this.sprite);
            }
            clearInterval(this.shootInterval);
        }
    }

    destroy() {
        clearInterval(this.shootInterval);
        this.bullets.forEach(bullet => {
            if (bullet.parent) {
                bullet.parent.removeChild(bullet);
            }
        });
    }
} 