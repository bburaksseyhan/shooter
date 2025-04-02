import { GAME_CONFIG } from '../config/gameConfig.js';

export class Score {
    constructor(app) {
        this.app = app;
        this.score = 0;
        this.container = this.createScoreDisplay();
        this.addToStage();
    }
    
    createScoreDisplay() {
        // Create a background container
        const container = new PIXI.Container();
        
        // Create background rectangle
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.7); // Semi-transparent black background
        background.drawRoundedRect(0, 0, 200, 40, 10);
        background.endFill();
        
        // Create score text
        const text = new PIXI.Text('Score: 0', {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: GAME_CONFIG.SCORE_FONT_SIZE,
            fill: GAME_CONFIG.SCORE_COLOR,
            align: 'left',
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 4,
            dropShadowDistance: 2
        });
        
        // Position text within the background
        text.x = 20; // Left padding
        text.y = 20; // Center vertically
        text.anchor.set(0, 0.5); // Left align horizontally, center vertically
        
        // Add both background and text to container
        container.addChild(background);
        container.addChild(text);
        
        // Position the container
        container.x = 20;
        container.y = 20;
        
        return container;
    }
    
    addToStage() {
        this.app.stage.addChild(this.container);
    }
    
    updateScore(points) {
        this.score += points;
        // Update the text (second child of the container)
        const scoreText = this.container.children[1];
        scoreText.text = `Score: ${this.score}`;
        
        // Ensure anchor point is maintained
        scoreText.anchor.set(0, 0.5);
        
        // Ensure position is maintained
        scoreText.x = 20;
        scoreText.y = 20;
    }
    
    getScore() {
        return this.score;
    }
} 