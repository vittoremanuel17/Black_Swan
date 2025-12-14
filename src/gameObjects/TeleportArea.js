// js/objects/TeleportArea.js
export class TeleportArea extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height, targetX, targetY) {
        super(scene, x, y, width, height);

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.body.setAllowGravity(false);
        this.body.moves = false;

        this.targetX = targetX;
        this.targetY = targetY;

        this.button = null;
        this.playerInArea = false;

        scene.physics.add.overlap(scene.player, this, this.onPlayerEnter, null, this);
    }

    onPlayerEnter(player, zone) {
        if (!this.playerInArea) { 
            this.playerInArea = true;
            this.createTeleportButton();
        }
    }

    createTeleportButton() {
        if (this.button) return;

        const buttonX = this.x;
        const buttonY = this.y - 50;

        this.button = this.scene.add.text(buttonX, buttonY, '[ R ] Teleportar', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#007bff',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.teleportPlayer());

        this.scene.input.keyboard.on('keydown-R', this.teleportPlayer, this);
    }

    hideTeleportButton() {
        if (this.button) {
            this.button.destroy();
            this.button = null;
            this.scene.input.keyboard.off('keydown-R', this.teleportPlayer, this); // Remove o listener do teclado
        }
        this.playerInArea = false;
    }

    teleportPlayer() {
        if (this.button && this.playerInArea) { 
            this.scene.player.setPosition(this.targetX, this.targetY);
            this.hideTeleportButton();
            console.log('Jogador teleportado!');
        }
    }
}