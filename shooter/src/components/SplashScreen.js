import * as PIXI from 'pixi.js';
import { GAME_CONFIG } from '../config/gameConfig.js';

export class SplashScreen {
    constructor(app, onStart) {
        this.app = app;
        this.onStart = onStart;
        this.container = this.createSplashScreen();
        this.isVisible = true;
        this.addToStage();
        this.setupKeyListener();
    }
    
    createSplashScreen() {
        const container = new PIXI.Container();
        
        // Background
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.9);
        background.drawRect(0, 0, GAME_CONFIG.GAME_WIDTH, GAME_CONFIG.GAME_HEIGHT);
        background.endFill();
        
        // Title
        const title = new PIXI.Text('SPACE SHOOTER', {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: 48,
            fill: 0x00FF00,
            align: 'center',
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 10,
            dropShadowDistance: 2
        });
        title.x = GAME_CONFIG.GAME_WIDTH / 2;
        title.y = GAME_CONFIG.GAME_HEIGHT / 3;
        title.anchor.set(0.5);
        
        // Instructions
        const instructions = new PIXI.Text('Use ARROW KEYS to move\nSPACE to shoot\nPress ENTER to start', {
            fontFamily: GAME_CONFIG.SCORE_FONT,
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center',
            lineHeight: 40
        });
        instructions.x = GAME_CONFIG.GAME_WIDTH / 2;
        instructions.y = GAME_CONFIG.GAME_HEIGHT / 2 + 50;
        instructions.anchor.set(0.5);
        
        // UFO decoration
        const ufo = this.createUfoDecoration();
        ufo.x = GAME_CONFIG.GAME_WIDTH / 2;
        ufo.y = GAME_CONFIG.GAME_HEIGHT / 2 - 100;
        
        // Add all elements to container
        container.addChild(background);
        container.addChild(title);
        container.addChild(instructions);
        container.addChild(ufo);
        
        return container;
    }
    
    createUfoDecoration() {
        const container = new PIXI.Container();
        
        // UFO body
        const body = new PIXI.Graphics();
        body.lineStyle(3, 0xFF0000);
        body.beginFill(0x330000);
        body.drawEllipse(0, 0, 40, 20);
        body.endFill();
        
        // UFO dome
        const dome = new PIXI.Graphics();
        dome.lineStyle(2, 0xFF0000);
        dome.beginFill(0x330000);
        dome.drawEllipse(0, -10, 25, 12);
        dome.endFill();
        
        // UFO lights
        const lights = new PIXI.Graphics();
        lights.beginFill(0xFF0000, 0.8);
        lights.drawCircle(-20, 0, 5);
        lights.drawCircle(20, 0, 5);
        lights.drawCircle(0, 5, 3);
        
        // Add glow effect
        const glow = new PIXI.Graphics();
        glow.beginFill(0xFF0000, 0.3);
        glow.drawCircle(-20, 0, 8);
        glow.drawCircle(20, 0, 8);
        glow.drawCircle(0, 5, 5);
        
        // Add all parts to container
        container.addChild(glow);
        container.addChild(body);
        container.addChild(dome);
        container.addChild(lights);
        
        return container;
    }
    
    addToStage() {
        this.app.stage.addChild(this.container);
    }
    
    setupKeyListener() {
        const keyHandler = (e) => {
            if (e.key === 'Enter' && this.isVisible) {
                this.hide();
                this.onStart();
                document.removeEventListener('keydown', keyHandler);
            }
        };
        
        document.addEventListener('keydown', keyHandler);
    }
    
    hide() {
        this.isVisible = false;
        this.app.stage.removeChild(this.container);
    }
    
    show() {
        this.isVisible = true;
        this.app.stage.addChild(this.container);
    }
} 