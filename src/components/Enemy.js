import { GAME_CONFIG } from '../config/gameConfig.js';

export class Enemy {
    constructor(app, levelManager) {
        this.app = app;
        this.levelManager = levelManager;
        this.enemies = [];
        this.enemyTypes = GAME_CONFIG.ENEMY_TYPES;
        this.lastSpawnTime = 0;
        this.spawnCooldown = 1000; // 1 second between spawns
    }
    
    createEnemy(type, speedMultiplier) {
        const container = new PIXI.Container();
        
        // Base UFO design
        const body = new PIXI.Graphics();
        body.lineStyle(2, type.color);
        body.beginFill(0x330000); // Dark red fill
        
        // Create different designs based on enemy type
        switch(type.name) {
            case 'small':
                // Small UFO - Classic flying saucer design
                body.drawEllipse(0, 0, 15, 8);
                // Dome
                body.lineStyle(2, type.color);
                body.beginFill(0x330000);
                body.drawEllipse(0, -2, 8, 4);
                // Lights
                const smallLights = new PIXI.Graphics();
                smallLights.beginFill(type.color, 0.8);
                smallLights.drawCircle(-8, 0, 2);
                smallLights.drawCircle(8, 0, 2);
                // Add glow effect
                const smallGlow = new PIXI.Graphics();
                smallGlow.beginFill(type.color, 0.3);
                smallGlow.drawCircle(-8, 0, 4);
                smallGlow.drawCircle(8, 0, 4);
                container.addChild(smallGlow);
                container.addChild(smallLights);
                break;
                
            case 'medium':
                // Medium UFO - Triangular design with lights
                body.moveTo(0, -15);
                body.lineTo(20, 10);
                body.lineTo(0, 5);
                body.lineTo(-20, 10);
                body.closePath();
                // Cockpit
                body.lineStyle(2, type.color);
                body.beginFill(0x330000);
                body.drawEllipse(0, -5, 10, 6);
                // Wing lights
                const mediumLights = new PIXI.Graphics();
                mediumLights.beginFill(type.color, 0.8);
                mediumLights.drawCircle(-15, 5, 3);
                mediumLights.drawCircle(15, 5, 3);
                // Add glow effect
                const mediumGlow = new PIXI.Graphics();
                mediumGlow.beginFill(type.color, 0.3);
                mediumGlow.drawCircle(-15, 5, 6);
                mediumGlow.drawCircle(15, 5, 6);
                container.addChild(mediumGlow);
                container.addChild(mediumLights);
                break;
                
            case 'large':
                // Large UFO - Hexagonal design with multiple lights
                const points = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    points.push(Math.cos(angle) * 25);
                    points.push(Math.sin(angle) * 15);
                }
                body.drawPolygon(points);
                // Central dome
                body.lineStyle(2, type.color);
                body.beginFill(0x330000);
                body.drawEllipse(0, 0, 12, 8);
                // Multiple lights
                const largeLights = new PIXI.Graphics();
                largeLights.beginFill(type.color, 0.8);
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    largeLights.drawCircle(
                        Math.cos(angle) * 20,
                        Math.sin(angle) * 12,
                        3
                    );
                }
                // Add glow effect
                const largeGlow = new PIXI.Graphics();
                largeGlow.beginFill(type.color, 0.3);
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    largeGlow.drawCircle(
                        Math.cos(angle) * 20,
                        Math.sin(angle) * 12,
                        6
                    );
                }
                container.addChild(largeGlow);
                container.addChild(largeLights);
                break;
        }
        
        container.addChild(body);
        
        // Set initial position
        container.x = Math.random() * (GAME_CONFIG.GAME_WIDTH - 50) + 25;
        container.y = -50;
        
        // Add properties
        container.type = type;
        container.speed = type.speed * speedMultiplier;
        container.health = type.health;
        container.score = type.score;
        
        return container;
    }
    
    spawnEnemy() {
        // Check if we've reached the maximum number of enemies for current level
        if (this.enemies.length >= this.levelManager.getMaxEnemies()) {
            return;
        }
        
        // Check if enough time has passed since the last spawn
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime < this.spawnCooldown) {
            return;
        }
        
        // Randomly select an enemy type based on spawn rates
        const totalSpawnRate = this.enemyTypes.reduce((sum, type) => sum + type.spawnRate, 0);
        let random = Math.random() * totalSpawnRate;
        
        let selectedType = this.enemyTypes[0];
        for (const type of this.enemyTypes) {
            if (random < type.spawnRate) {
                selectedType = type;
                break;
            }
            random -= type.spawnRate;
        }
        
        const enemy = this.createEnemy(selectedType, this.levelManager.getEnemySpeedMultiplier());
        this.enemies.push(enemy);
        this.app.stage.addChild(enemy);
        
        // Update last spawn time
        this.lastSpawnTime = currentTime;
    }
    
    update() {
        // Get current level's speed multiplier
        const speedMultiplier = this.levelManager.getEnemySpeedMultiplier();
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            // Apply level-based speed multiplier
            enemy.y += enemy.speed;
            if (enemy.y > GAME_CONFIG.GAME_HEIGHT) {
                this.app.stage.removeChild(enemy);
                this.enemies.splice(i, 1);
                return true; // Enemy reached bottom
            }
        }
        return false; // No enemy reached bottom
    }
    
    checkCollisions(bullets) {
        let collision = false;
        let score = 0;
        
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            if (!bullet) continue;
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (!enemy) continue;
                
                // Calculate distance between bullet and enemy center
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Check if distance is less than collision radius
                if (distance < enemy.type.collisionRadius) {
                    // Remove bullet and enemy
                    this.app.stage.removeChild(bullet);
                    this.app.stage.removeChild(enemy);
                    bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    
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
    
    shouldSpawnEnemy() {
        // Don't spawn if we've reached the maximum number of enemies for current level
        if (this.enemies.length >= this.levelManager.getMaxEnemies()) {
            return false;
        }
        
        // Check if enough time has passed since the last spawn
        const currentTime = Date.now();
        if (currentTime - this.lastSpawnTime < this.spawnCooldown) {
            return false;
        }
        
        // Apply level-based spawn rate multiplier
        const spawnRateMultiplier = this.levelManager.getSpawnRateMultiplier();
        
        // Check if any enemy type should spawn
        return this.enemyTypes.some(type => Math.random() < type.spawnRate * spawnRateMultiplier);
    }
    
    getEnemies() {
        return this.enemies;
    }
    
    getEnemyCount() {
        return this.enemies.length;
    }
    
    updateLevelSettings() {
        // Update spawn cooldown based on current level
        this.spawnCooldown = this.levelManager.getSpawnCooldown();
    }
} 