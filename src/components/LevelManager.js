import * as PIXI from 'pixi.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class LevelManager {
    constructor(app) {
        this.app = app;
        this.currentLevel = 1;
        this.levelText = this.createLevelText();
        this.addToStage();
        this.setupResponsiveLayout();
    }
    
    createLevelText() {
        // Create a background container
        const container = new PIXI.Container();
        
        // Create background rectangle
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.7); // Semi-transparent black background
        background.drawRoundedRect(0, 0, 100, 30, 8);
        background.endFill();
        
        // Create level text
        const text = new PIXI.Text('Level: 1', {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: GAME_CONFIG.SCORE_FONT_SIZE,
            fill: 0x00FF00, // Bright green color
            align: 'center',
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 3,
            dropShadowDistance: 1
        });
        
        // Position text within the background
        text.x = 10;
        text.y = 5;
        
        // Add both background and text to container
        container.addChild(background);
        container.addChild(text);
        
        return container;
    }
    
    setupResponsiveLayout() {
        // Initial position
        this.updatePosition();
        
        // Update position on window resize
        window.addEventListener('resize', () => this.updatePosition());
    }
    
    updatePosition() {
        const padding = 10;
        this.levelText.x = GAME_CONFIG.GAME_WIDTH - this.levelText.width - padding;
        this.levelText.y = padding;
    }
    
    addToStage() {
        this.app.stage.addChild(this.levelText);
    }
    
    update(delta) {
        // Update level text
        this.updateLevelText();
    }
    
    updateLevelText() {
        // Update the level text
        this.levelText.children[1].text = `Level: ${this.currentLevel}`;
    }
    
    checkLevelUp(score) {
        const nextLevelScore = this.currentLevel * GAME_CONFIG.SCORE_PER_LEVEL;
        if (score >= nextLevelScore) {
            this.currentLevel++;
            // Update the level text immediately when level changes
            this.updateLevelText();
            return true;
        }
        return false;
    }
    
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    getMaxEnemies() {
        return Math.min(
            GAME_CONFIG.ENEMY_SETTINGS.MAX_ENEMIES + (this.currentLevel - 1),
            GAME_CONFIG.ENEMY_SETTINGS.MAX_ENEMIES * 2
        );
    }
    
    getSpawnCooldown() {
        return Math.max(
            GAME_CONFIG.ENEMY_SETTINGS.SPAWN_COOLDOWN - (this.currentLevel - 1) * 100,
            GAME_CONFIG.ENEMY_SETTINGS.SPAWN_COOLDOWN / 2
        );
    }
    
    getEnemySpeedMultiplier() {
        return Math.min(
            GAME_CONFIG.ENEMY_SETTINGS.BASE_SPEED + (this.currentLevel - 1) * GAME_CONFIG.ENEMY_SETTINGS.SPEED_INCREMENT,
            GAME_CONFIG.ENEMY_SETTINGS.MAX_SPEED_MULTIPLIER
        );
    }
    
    getBackgroundSpeed() {
        // Increase background speed with level
        return Math.min(
            GAME_CONFIG.BACKGROUND_SPEED + (this.currentLevel - 1) * 0.2,
            GAME_CONFIG.BACKGROUND_SPEED * 2
        );
    }
    
    getSpawnRateMultiplier() {
        // Increase spawn rate with level
        return Math.min(
            1.0 + (this.currentLevel - 1) * 0.1,
            1.5
        );
    }
} 