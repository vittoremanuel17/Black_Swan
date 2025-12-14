// src/scenes/UIScene.js
import { Inventory } from '../systems/Inventory.js';
import { InventoryButton } from '../ui/InventoryButton.js';
import { DialogueBox } from '../ui/DialogueBox.js';

export class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        const gameScene = this.scene.get('Game');

        this.inventory = new Inventory(this, gameScene);

        this.inventoryButton = new InventoryButton(this, this.inventory).setScale(1.5);

        this.dialogueSystem = new DialogueBox(this);
        this.add.existing(this.dialogueSystem);

        gameScene.events.on('showDialogue', (text, portrait) => {
            this.dialogueSystem.show(text, portrait);
        });

        this.scene.bringToTop();
    }
}