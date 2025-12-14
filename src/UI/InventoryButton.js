import { INVENTORY_CONFIG } from '../config.js';

export class InventoryButton extends Phaser.GameObjects.Image {
    constructor(scene, inventory) {
        const { x, y } = INVENTORY_CONFIG.INVENTORY_BUTTON_POSITION;
        super(scene, x, y, 'backpack');
        this.scene = scene;
        this.inventory = inventory;

        scene.add.existing(this);
        this.setInteractive();
        this.setScrollFactor(0);
        this.setDepth(100);

        this.on('pointerdown', this.toggleInventory, this);
    }

    toggleInventory() {
        this.inventory.toggleInventory();
    }
}