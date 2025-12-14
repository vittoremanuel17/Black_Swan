import { Player } from '../gameObjects/Player.js';
import { Item } from '../gameObjects/Item.js';
import { TeleportArea } from '../gameObjects/TeleportArea.js';
import { InteractableObject } from '../gameObjects/InteractableObject.js'; 
import { DialogueBox } from '../ui/DialogueBox.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Configuração do Mapa
        const map = this.make.tilemap({ key: 'meu_mapa' });
        
        const tilesetChao = map.addTilesetImage('Floor', 'img_chao');
        const tilesetParede = map.addTilesetImage('Wall', 'img_parede');
        
        const floorLayer = map.createLayer('Floor', tilesetChao, 0, 0);
        const wallLayer = map.createLayer('Walls', tilesetParede, 0, 0);

        this.physics.world.setBounds(0, 0, 640, 360);

        // Sombra
        this.shadow = this.add.graphics();
        this.shadow.fillStyle(0x000000, 0.6); 
        this.shadow.fillEllipse(0, 0, 15, 5); 
        this.shadow.setDepth(0);

        // Jogador
        this.player = new Player(this, 100, 270);
        this.player.setDepth(1);
        this.player.body.setAllowGravity(false);
        
        this.cursors = this.input.keyboard.createCursorKeys();

        // Câmera
        this.cameras.main.setBounds(0, 0, map.widthInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1, 0, 50);
        this.cameras.main.setZoom(2); 

        // Interface e Diálogos
        this.scene.launch('UIScene');
        this.dialogueSystem = new DialogueBox(this);
        this.add.existing(this.dialogueSystem);
        this.isReading = false; // Flag de controle de leitura

        // Eventos
        this.events.on('itemCollected', (itemId, itemData) => {
            this.events.emit('showDialogue', `Você pegou: ${itemData.name || itemId}.`);
        });

        this.events.on('dialogueFinished', () => {
            this.isReading = false;
        });

        // Itens e Objetos
        this.item1 = new Item(this, 300, 350, 'item1', 'item1', { name: 'Lança', damage: 15 });
        this.item2 = new Item(this, 400, 350, 'item2', 'item2', { name: 'Espada', cura: 20 });
        this.item3 = new Item(this, 500, 350, 'item3', 'item3', { name: 'Pá', defense: 10 }); 
        this.keyItem = new Item(this, 600, 350, 'item_icon', 'chave_dourada', { name: 'Chave do Porão' });

        this.lockedDoor = new InteractableObject(
            this, 
            592, 233, 
            'door', 
            'chave_dourada', 
            "A porta está trancada. Preciso de uma chave."
        );

        this.events.on('puzzleSolved', (object) => {
            if (object === this.lockedDoor) {
                console.log("A porta do porão se abriu!");
                // Adicione sons ou troca de textura aqui
            }
        });
        
        this.teleportArea1 = new TeleportArea(this, 700, 380, 100, 100, 700, 150);
        this.teleportArea2 = new TeleportArea(this, 700, 170, 100, 100, 700, 360);
    }

    update() {
        if (this.cursors.left.isDown){
            this.player.moveLeft();
        } 
        else if (this.cursors.right.isDown){
            this.player.moveRight();
        } 
        else {
            this.player.idle();
        }

        this.shadow.x = this.player.x;
        this.shadow.y = this.player.y + 15; 

        this.checkTeleportAreaOverlap(this.teleportArea1);
        this.checkTeleportAreaOverlap(this.teleportArea2);

        if (!this.dialogueSystem.visible) {
            this.player.update();
        } else {
            this.player.body.setVelocity(0);
        }
    }

    checkTeleportAreaOverlap(teleportArea) {
        const isOverlapping = this.physics.overlap(this.player, teleportArea);

        if (isOverlapping && !teleportArea.playerInArea) {
            teleportArea.onPlayerEnter(this.player, teleportArea); 
        } else if (!isOverlapping && teleportArea.playerInArea) {
            teleportArea.hideTeleportButton();
        }
    }
}
