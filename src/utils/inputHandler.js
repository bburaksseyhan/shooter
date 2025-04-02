// Input handler class to manage keyboard input
export class InputHandler {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }
    
    isKeyPressed(key) {
        return this.keys[key] === true;
    }
    
    isSpacePressed() {
        return this.isKeyPressed(' ');
    }
    
    isLeftArrowPressed() {
        return this.isKeyPressed('ArrowLeft');
    }
    
    isRightArrowPressed() {
        return this.isKeyPressed('ArrowRight');
    }
} 