export class Item extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, id, data = {}) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.id = id; 
        this.itemData = data; 

        scene.add.existing(this);
        this.setInteractive();
        this.on('pointerdown', this.collectItem, this);
    }

    collectItem() {
        this.scene.sound.play('plim', { volume: 0.2 });
        this.scene.events.emit('itemCollected', this.id, this.itemData);
        this.destroy();
    }
}