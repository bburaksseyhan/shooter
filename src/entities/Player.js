import * as PIXI from 'pixi.js';
import { GameConfig } from '../config';

export class Player {
    constructor() {
        this.sprite = new PIXI.Graphics();
        this.drawSpaceship();
        
        this.sprite.x = GameConfig.width / 2;
        this.sprite.y = GameConfig.height - 100;
        
        this.bullets = [];
        this.setupControls();
        
        // Health system
        this.health = 100;
        this.maxHealth = 100;
        this.healthBar = this.createHealthBar();
        this.healthBar.x = this.sprite.x;
        this.healthBar.y = this.sprite.y;
        
        // Touch controls for mobile
        this.touchControls = this.createTouchControls();
    }

    drawSpaceship() {
        this.sprite.clear();
        this.sprite.lineStyle(2, 0x00ff00);
        this.sprite.beginFill(0x00ff00);
        
        // Draw spaceship shape
        this.sprite.moveTo(0, -20);
        this.sprite.lineTo(10, 10);
        this.sprite.lineTo(-10, 10);
        this.sprite.lineTo(0, -20);
        
        this.sprite.endFill();
    }

    createHealthBar() {
        const healthBar = new PIXI.Graphics();
        this.updateHealthBar(healthBar);
        return healthBar;
    }

    updateHealthBar(healthBar) {
        healthBar.clear();
        
        // Background (gray)
        healthBar.beginFill(0x333333);
        healthBar.drawRect(-15, -30, 30, 5);
        healthBar.endFill();
        
        // Health (green to red based on percentage)
        const healthPercent = this.health / this.maxHealth;
        let healthColor;
        
        if (healthPercent > 0.6) {
            healthColor = 0x00ff00; // Green
        } else if (healthPercent > 0.3) {
            healthColor = 0xffff00; // Yellow
        } else {
            healthColor = 0xff0000; // Red
        }
        
        healthBar.beginFill(healthColor);
        healthBar.drawRect(-15, -30, 30 * healthPercent, 5);
        healthBar.endFill();
    }

    setupControls() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                this.shoot();
            }
        });
    }

    shoot() {
        const bullet = new PIXI.Graphics();
        bullet.beginFill(0x00ff00);
        bullet.drawCircle(0, 0, 3);
        bullet.endFill();
        
        bullet.x = this.sprite.x;
        bullet.y = this.sprite.y - 20;
        
        this.bullets.push(bullet);
        this.sprite.parent.addChild(bullet);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        
        // Update health bar
        this.updateHealthBar(this.healthBar);
        
        return this.health <= 0;
    }

    createTouchControls() {
        const controls = new PIXI.Container();
        
        // Left button
        const leftButton = new PIXI.Graphics();
        leftButton.beginFill(0x00ff00, 0.5);
        leftButton.drawCircle(0, 0, 30);
        leftButton.endFill();
        leftButton.position.set(50, GameConfig.height - 50);
        leftButton.interactive = true;
        leftButton.buttonMode = true;
        
        // Right button
        const rightButton = new PIXI.Graphics();
        rightButton.beginFill(0x00ff00, 0.5);
        rightButton.drawCircle(0, 0, 30);
        rightButton.endFill();
        rightButton.position.set(120, GameConfig.height - 50);
        rightButton.interactive = true;
        rightButton.buttonMode = true;
        
        // Shoot button
        const shootButton = new PIXI.Graphics();
        shootButton.beginFill(0xff0000, 0.5);
        shootButton.drawCircle(0, 0, 30);
        shootButton.endFill();
        shootButton.position.set(GameConfig.width - 50, GameConfig.height - 50);
        shootButton.interactive = true;
        shootButton.buttonMode = true;
        
        // Add touch events
        leftButton.on('pointerdown', () => this.keys['ArrowLeft'] = true);
        leftButton.on('pointerup', () => this.keys['ArrowLeft'] = false);
        leftButton.on('pointerout', () => this.keys['ArrowLeft'] = false);
        
        rightButton.on('pointerdown', () => this.keys['ArrowRight'] = true);
        rightButton.on('pointerup', () => this.keys['ArrowRight'] = false);
        rightButton.on('pointerout', () => this.keys['ArrowRight'] = false);
        
        shootButton.on('pointerdown', () => this.shoot());
        
        controls.addChild(leftButton);
        controls.addChild(rightButton);
        controls.addChild(shootButton);
        
        return controls;
    }

    update() {
        // Movement
        if (this.keys['ArrowLeft'] && this.sprite.x > 20) {
            this.sprite.x -= GameConfig.playerSpeed;
        }
        if (this.keys['ArrowRight'] && this.sprite.x < GameConfig.width - 20) {
            this.sprite.x += GameConfig.playerSpeed;
        }

        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.y -= GameConfig.bulletSpeed;
            
            // Remove bullets that are off screen
            if (bullet.y < 0) {
                this.sprite.parent.removeChild(bullet);
                this.bullets.splice(index, 1);
            }
        });
        
        // Update health bar position
        this.healthBar.x = this.sprite.x;
        this.healthBar.y = this.sprite.y;
    }
} 