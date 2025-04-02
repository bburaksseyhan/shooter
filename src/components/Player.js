import * as PIXI from 'pixi.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class Player {
    constructor(app) {
        this.app = app;
        this.sprite = this.createPlayer();
        this.x = GAME_CONFIG.GAME_WIDTH / 2;
        this.y = GAME_CONFIG.GAME_HEIGHT - 50;
        this.speed = GAME_CONFIG.PLAYER_SPEED;
        this.bullets = [];
        this.lastShotTime = 0;
        this.shootCooldown = 250; // 250ms cooldown between shots
    }
    
    createPlayer() {
        const container = new PIXI.Container();
        
        // Main body of the spacecraft
        const body = new PIXI.Graphics();
        body.lineStyle(2, 0x00FF00);
        body.beginFill(0x003300);
        
        // Main fuselage
        body.moveTo(0, -20);
        body.lineTo(15, 10);
        body.lineTo(0, 15);
        body.lineTo(-15, 10);
        body.closePath();
        body.endFill();
        
        // Wings
        body.lineStyle(2, 0x00FF00);
        body.beginFill(0x003300);
        // Left wing
        body.moveTo(-15, 10);
        body.lineTo(-30, 5);
        body.lineTo(-15, 0);
        body.closePath();
        body.endFill();
        // Right wing
        body.moveTo(15, 10);
        body.lineTo(30, 5);
        body.lineTo(15, 0);
        body.closePath();
        body.endFill();
        
        // Engine glow
        const engineGlow = new PIXI.Graphics();
        engineGlow.beginFill(0x00FF00, 0.5);
        engineGlow.drawCircle(0, 15, 5);
        engineGlow.endFill();
        
        // Cockpit
        const cockpit = new PIXI.Graphics();
        cockpit.lineStyle(2, 0x00FF00);
        cockpit.beginFill(0x003300);
        cockpit.drawEllipse(0, -5, 8, 5);
        cockpit.endFill();
        
        // Add all parts to container
        container.addChild(body);
        container.addChild(engineGlow);
        container.addChild(cockpit);
        
        // Position the container
        container.x = GAME_CONFIG.GAME_WIDTH / 2;
        container.y = GAME_CONFIG.GAME_HEIGHT - 50;
        
        return container;
    }
    
    addToStage() {
        this.app.stage.addChild(this.sprite);
    }
    
    removeFromStage() {
        this.app.stage.removeChild(this.sprite);
    }
    
    update(inputHandler) {
        // Move player based on input
        if (inputHandler.isLeftArrowPressed() && this.x > 15) {
            this.x -= this.speed;
        }
        if (inputHandler.isRightArrowPressed() && this.x < GAME_CONFIG.GAME_WIDTH - 15) {
            this.x += this.speed;
        }
        
        // Update sprite position
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
    
    shoot() {
        // Check if enough time has passed since the last shot
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime < this.shootCooldown) {
            return null;
        }
        
        const bullet = new PIXI.Graphics();
        bullet.beginFill(GAME_CONFIG.BULLET_COLOR);
        bullet.drawCircle(0, 0, GAME_CONFIG.BULLET_RADIUS);
        bullet.endFill();
        bullet.x = this.x;
        bullet.y = this.y - 15;
        
        // Add a unique ID to the bullet for better tracking
        bullet.id = `bullet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.bullets.push(bullet);
        this.app.stage.addChild(bullet);
        
        // Update last shot time
        this.lastShotTime = currentTime;
        
        return bullet;
    }
    
    updateBullets() {
        // Create a copy of the bullets array to avoid modification during iteration
        const bulletsCopy = [...this.bullets];
        
        for (let i = 0; i < bulletsCopy.length; i++) {
            const bullet = bulletsCopy[i];
            if (!bullet) continue;
            
            bullet.y -= GAME_CONFIG.BULLET_SPEED;
            
            // Remove bullets that go off screen
            if (bullet.y < 0) {
                this.app.stage.removeChild(bullet);
                
                // Remove from the original array
                const bulletIndex = this.bullets.findIndex(b => b.id === bullet.id);
                if (bulletIndex !== -1) {
                    this.bullets.splice(bulletIndex, 1);
                }
            }
        }
    }
    
    getBullets() {
        return this.bullets;
    }
    
    removeBullet(bullet) {
        // Remove bullet from the stage
        if (bullet && bullet.parent) {
            bullet.parent.removeChild(bullet);
        }
        
        // Remove bullet from the bullets array
        const bulletIndex = this.bullets.indexOf(bullet);
        if (bulletIndex !== -1) {
            this.bullets.splice(bulletIndex, 1);
        }
    }
} 