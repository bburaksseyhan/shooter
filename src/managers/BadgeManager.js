import * as PIXI from 'pixi.js';

export class BadgeManager {
    constructor(game) {
        this.game = game;
        this.badges = [];
        this.badgeContainer = new PIXI.Container();
        this.badgeContainer.position.set(10, 70); // Position below score and level text
        this.game.app.stage.addChild(this.badgeContainer);
        
        // Define available badges
        this.availableBadges = {
            sharpshooter: {
                name: 'Sharpshooter',
                description: 'Hit 10 UFOs in a row without missing',
                icon: this.createBadgeIcon(0x00ff00, '🎯'),
                condition: () => this.checkSharpshooter(),
                earned: false
            },
            survivor: {
                name: 'Survivor',
                description: 'Survive for 5 minutes',
                icon: this.createBadgeIcon(0xff0000, '⏱️'),
                condition: () => this.checkSurvivor(),
                earned: false
            },
            highScorer: {
                name: 'High Scorer',
                description: 'Reach 1000 points',
                icon: this.createBadgeIcon(0xffff00, '🏆'),
                condition: () => this.checkHighScorer(),
                earned: false
            },
            levelMaster: {
                name: 'Level Master',
                description: 'Reach level 5',
                icon: this.createBadgeIcon(0x0000ff, '⭐'),
                condition: () => this.checkLevelMaster(),
                earned: false
            }
        };
        
        // Initialize tracking variables
        this.consecutiveHits = 0;
        this.gameStartTime = Date.now();
        this.missedShots = 0;
    }
    
    createBadgeIcon(color, emoji) {
        const badge = new PIXI.Container();
        
        // Create badge background
        const background = new PIXI.Graphics();
        background.beginFill(color);
        background.drawCircle(0, 0, 20);
        background.endFill();
        
        // Create badge text
        const text = new PIXI.Text(emoji, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xffffff
        });
        text.anchor.set(0.5);
        
        badge.addChild(background);
        badge.addChild(text);
        
        return badge;
    }
    
    checkSharpshooter() {
        return this.consecutiveHits >= 10 && !this.availableBadges.sharpshooter.earned;
    }
    
    checkSurvivor() {
        const survivalTime = (Date.now() - this.gameStartTime) / 1000 / 60; // in minutes
        return survivalTime >= 5 && !this.availableBadges.survivor.earned;
    }
    
    checkHighScorer() {
        return this.game.score >= 1000 && !this.availableBadges.highScorer.earned;
    }
    
    checkLevelMaster() {
        const currentLevel = this.game.levelManager.getCurrentLevel().level;
        return currentLevel >= 5 && !this.availableBadges.levelMaster.earned;
    }
    
    addBadge(badgeKey) {
        if (this.availableBadges[badgeKey] && !this.availableBadges[badgeKey].earned) {
            const badge = this.availableBadges[badgeKey];
            badge.earned = true;
            
            // Create badge display
            const badgeDisplay = new PIXI.Container();
            badgeDisplay.position.set(this.badges.length * 50, 0);
            
            // Add badge icon
            const icon = badge.icon.clone();
            badgeDisplay.addChild(icon);
            
            // Add badge name
            const nameText = new PIXI.Text(badge.name, {
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xffffff
            });
            nameText.position.set(0, 25);
            nameText.anchor.set(0.5, 0);
            badgeDisplay.addChild(nameText);
            
            // Add to container
            this.badgeContainer.addChild(badgeDisplay);
            this.badges.push(badgeDisplay);
            
            // Show notification
            this.showBadgeNotification(badge);
            
            return true;
        }
        return false;
    }
    
    showBadgeNotification(badge) {
        // Create notification container
        const notification = new PIXI.Container();
        notification.position.set(this.game.canvasWidth / 2, 100);
        
        // Create notification background
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.8);
        background.drawRoundedRect(-150, -30, 300, 60, 10);
        background.endFill();
        
        // Create notification text
        const text = new PIXI.Text(`Badge Earned: ${badge.name}`, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xffffff
        });
        text.anchor.set(0.5);
        
        // Add to notification
        notification.addChild(background);
        notification.addChild(text);
        
        // Add to stage
        this.game.app.stage.addChild(notification);
        
        // Animate and remove after delay
        let alpha = 0;
        const fadeIn = () => {
            alpha += 0.05;
            notification.alpha = alpha;
            if (alpha < 1) {
                requestAnimationFrame(fadeIn);
            } else {
                setTimeout(() => {
                    const fadeOut = () => {
                        alpha -= 0.05;
                        notification.alpha = alpha;
                        if (alpha > 0) {
                            requestAnimationFrame(fadeOut);
                        } else {
                            this.game.app.stage.removeChild(notification);
                        }
                    };
                    fadeOut();
                }, 2000);
            }
        };
        fadeIn();
    }
    
    update() {
        // Check for badge conditions
        if (this.checkSharpshooter()) {
            this.addBadge('sharpshooter');
        }
        
        if (this.checkSurvivor()) {
            this.addBadge('survivor');
        }
        
        if (this.checkHighScorer()) {
            this.addBadge('highScorer');
        }
        
        if (this.checkLevelMaster()) {
            this.addBadge('levelMaster');
        }
    }
    
    // Called when player hits a UFO
    onHit() {
        this.consecutiveHits++;
        this.missedShots = 0;
    }
    
    // Called when player misses a shot
    onMiss() {
        this.consecutiveHits = 0;
        this.missedShots++;
    }
    
    // Reset badges when game restarts
    reset() {
        // Clear existing badges
        this.badges.forEach(badge => {
            this.badgeContainer.removeChild(badge);
        });
        this.badges = [];
        
        // Reset badge states
        Object.keys(this.availableBadges).forEach(key => {
            this.availableBadges[key].earned = false;
        });
        
        // Reset tracking variables
        this.consecutiveHits = 0;
        this.gameStartTime = Date.now();
        this.missedShots = 0;
    }
} 