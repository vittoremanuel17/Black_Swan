// src/gameObjects/InteractableObject.js
export class InteractableObject extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, requiredItemId, defaultMessage = "Isso não funciona.") {
        super(scene, x, y, texture);
        this.scene = scene;
        this.requiredItemId = requiredItemId;
        this.defaultMessage = defaultMessage;
        
        this.isSolved = false;

        scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });

        this.on('pointerdown', this.handleInteraction, this);
    }

    handleInteraction() {
        if (this.isSolved) {
            return;
        }

        const uiScene = this.scene.scene.get('UIScene');

        const inventory = uiScene.inventory;
        const selectedItem = inventory.selectedItem;

        if (selectedItem && selectedItem.id === this.requiredItemId) {
            this.onSuccess(inventory);
        } else {
            this.onFail();
        }
    }

    onSuccess(inventory) {
        inventory.consumeSelectedItem();
        
        this.isSolved = true;

        if (this.onSolveCallback) {
            this.onSolveCallback();
        } else {
            this.scene.events.emit('showDialogue', "Funcionou!");
        }

        this.scene.events.emit('puzzleSolved', this);
    }

    onFail() {
        console.log("teste"); // Debug
        
        this.scene.events.emit('showDialogue', this.defaultMessage);
        
        this.scene.tweens.add({
            targets: this,
            x: this.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3
        });
    }
}