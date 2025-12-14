// src/ui/DialogueBox.js
import { DIALOGUE_CONFIG } from '../config.js';

export class DialogueBox extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.fullText = "";
        this.isTyping = false;
        this.timerEvent = null;
        this.setScrollFactor(0);
        this.setDepth(1000); 
        this.createUI();
        this.setVisible(false);
    }

    createUI() {
        const { width } = this.scene.scale;
        const { HEIGHT, BG_COLOR, BG_ALPHA, PADDING, FONT_SIZE } = DIALOGUE_CONFIG;

        this.background = this.scene.add.graphics();
        this.background.fillStyle(BG_COLOR, BG_ALPHA);
        this.background.fillRect(0, 0, width, HEIGHT);
        
        this.add(this.background);

        this.portrait = this.scene.add.image(PADDING, HEIGHT / 2, 'face_player');
        this.portrait.setOrigin(0, 0.5); 
        this.portrait.setVisible(false);
        this.add(this.portrait);

        this.bitmapText = this.scene.add.bitmapText(PADDING, PADDING, 'pixelFont', '', FONT_SIZE);
        this.bitmapText.setMaxWidth(width - (PADDING * 2));
        this.add(this.bitmapText);
    }

    show(text, portraitKey = null) {
        if (this.visible) {
            this.cleanupInput();
        }

        const { width } = this.scene.scale;
        const { PADDING, PORTRAIT_WIDTH, PORTRAIT_MARGIN } = DIALOGUE_CONFIG;

        this.setVisible(true);

        if (portraitKey) {
            this.portrait.setTexture(portraitKey);
            this.portrait.setVisible(true);

            const textX = PADDING + PORTRAIT_WIDTH + PORTRAIT_MARGIN;
            const maxTextWidth = width - textX - PADDING;

            this.bitmapText.setX(textX);
            this.bitmapText.setMaxWidth(maxTextWidth);
        } else {
            this.portrait.setVisible(false);
            
            this.bitmapText.setX(PADDING);
            this.bitmapText.setMaxWidth(width - (PADDING * 2));
        }

        this.prepareText(text);
        this.startTypewriter();

        this.setupInput();

        const gameScene = this.scene.scene.get('Game');
        if (gameScene) gameScene.events.emit('dialogueStarted');
    }

    prepareText(text) {
        this.bitmapText.setText(text);

        const wrappedText = this.bitmapText.getTextBounds().wrappedText;
        
        this.fullText = wrappedText || text; // Fallback se não houver quebra
        
        this.bitmapText.setText('');
    }

     startTypewriter() {
        this.isTyping = true;
        let currentIndex = 0;

        if (this.timerEvent) this.timerEvent.remove();

        this.timerEvent = this.scene.time.addEvent({
            delay: DIALOGUE_CONFIG.TYPE_SPEED,
            callback: () => {
                this.bitmapText.setText(this.fullText.substring(0, currentIndex + 1));
                currentIndex++;

                if (currentIndex === this.fullText.length) {
                    this.isTyping = false;
                    this.timerEvent.remove();
                }
            },
            loop: true
        });
    }

    handleInput() {
        if (this.isTyping) {
            
            if (this.timerEvent) this.timerEvent.remove();
            
            this.bitmapText.setText(this.fullText);
            
            this.isTyping = false;
        } 

        else {
            this.hide();
        }
    }

    setupInput() {
        this.scene.input.on('pointerdown', this.handleInput, this);
        
        this.scene.input.keyboard.on('keydown-SPACE', this.handleInput, this);
    }

    cleanupInput() {
        this.scene.input.off('pointerdown', this.handleInput, this);
        this.scene.input.keyboard.off('keydown-SPACE', this.handleInput, this);
    }


    hide() {
        this.setVisible(false);
        this.scene.events.emit('dialogueFinished');

        this.cleanupInput();
    }
}