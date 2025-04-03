import * as PIXI from 'pixi.js';
import { Levels } from '../config/levels';

export class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 0;
        this.levelConfig = Levels[this.currentLevel];
        this.levelTransition = false;
        this.levelTransitionTime = 0;
        this.levelTransitionDuration = 3000; // 3 seconds
    }

    getCurrentLevel() {
        return this.levelConfig;
    }

    checkLevelUp() {
        if (this.currentLevel < Levels.length - 1 && 
            this.game.score >= this.levelConfig.requiredScore) {
            this.levelUp();
            return true;
        }
        return false;
    }

    levelUp() {
        this.currentLevel++;
        this.levelConfig = Levels[this.currentLevel];
        this.levelTransition = true;
        this.levelTransitionTime = 0;
        
        // Clear existing UFOs
        this.game.ufos.forEach(ufo => {
            ufo.destroy();
            this.game.app.stage.removeChild(ufo.sprite);
        });
        this.game.ufos = [];
        
        // Update background color
        this.game.app.renderer.backgroundColor = this.levelConfig.background;
        
        // Show level transition message
        this.showLevelTransitionMessage();
    }

    showLevelTransitionMessage() {
        const levelText = new PIXI.Text(`Level ${this.levelConfig.level}: ${this.levelConfig.name}`, {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xffffff,
            align: 'center'
        });
        
        levelText.anchor.set(0.5);
        levelText.position.set(this.game.app.screen.width / 2, this.game.app.screen.height / 2);
        
        this.game.app.stage.addChild(levelText);
        
        // Remove the text after 3 seconds
        setTimeout(() => {
            this.game.app.stage.removeChild(levelText);
            this.levelTransition = false;
        }, 3000);
    }

    update(delta) {
        if (this.levelTransition) {
            this.levelTransitionTime += delta;
        }
    }
} 