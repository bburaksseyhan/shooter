import { GAME_CONFIG } from '../config/gameConfig.js';

export class Player {
    constructor(app) {
        this.app = app;
        this.sprite = this.createPlayer();
        this.x = GAME_CONFIG.GAME_WIDTH / 2;
        this.y = GAME_CONFIG.GAME_HEIGHT - 50;
        this.speed = GAME_CONFIG.PLAYER_SPEED;
        this.bullets = [];
        this.lastShot = 0;
        this.shootCooldown = 250; // 250ms cooldown between shots
        
        // Initialize sounds
        this.shotSound = new Audio('./src/assets/sounds/shot.mp3');
        this.laserSound = new Audio('./src/assets/sounds/laser.mp3');
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
        if (currentTime - this.lastShot < this.shootCooldown) {
            return null;
        }
        
        // Create bullet
        const bullet = new PIXI.Graphics();
        bullet.beginFill(GAME_CONFIG.BULLET_COLOR);
        bullet.drawCircle(0, 0, GAME_CONFIG.BULLET_RADIUS);
        bullet.endFill();
        
        // Position bullet at player's position
        bullet.x = this.sprite.x;
        bullet.y = this.sprite.y - 20;
        
        // Add bullet to stage and store in array
        this.app.stage.addChild(bullet);
        this.bullets.push(bullet);
        
        // Update last shot time
        this.lastShot = currentTime;
        
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