import { Player } from '../gameObjects/Player.js';
import { Item } from '../gameObjects/Item.js';
import { InteractableObject } from '../gameObjects/InteractableObject.js'; 
import { CutsceneManager } from '../systems/Cutscenes.js';
import { PartySystem } from '../systems/PartySystem.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Áudio
        this.calm = this.sound.add('calm');
        this.calm.play({ loop: true });

        // Mapa
        const map = this.make.tilemap({ key: 'meu_mapa' });
        const tilesetChao = map.addTilesetImage('Floor', 'img_chao');
        const tilesetParede = map.addTilesetImage('Wall', 'img_parede');
        
        const floorLayer = map.createLayer('Floor', tilesetChao, 0, 0);
        const wallLayer = map.createLayer('Walls', tilesetParede, 0, 0);

        // Decoração
        this.add.image(432, 232, 'door');
        this.add.image(272, 232, 'door');
        this.add.image(112, 232, 'door');
        this.add.image(512, 263, 'bench');
        this.aberto = this.add.image(800, 800, 'openDoor');

        // Física
        this.physics.world.setBounds(0, 0, 640, 360);

        // Sombra 
        this.shadow = this.add.graphics();
        this.shadow.fillStyle(0x000000, 0.6); 
        this.shadow.fillEllipse(0, 0, 15, 5); 
        this.shadow.setDepth(0);
        this.shadow.setVisible(false);

        // Player
        this.player = new Player(this, 272, 270);
        this.player.setDepth(1);
        this.player.body.setAllowGravity(false);
        this.player.setVisible(false);
        
        this.canMove = true;
        this.cursors = this.input.keyboard.createCursorKeys();

        // Câmera
        this.cameras.main.setBounds(0, 0, map.widthInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1, 0, 50);
        this.cameras.main.setZoom(2); 

        this.scene.launch('UIScene');

        // Eventos e objetos
        this.events.on('itemCollected', (itemId, itemData) => {
            this.events.emit('showDialogue', `Voce pegou: ${itemData.name || itemId}.`);
        });

        new Item(this, 512, 251, 'key', 'keyIcon', { name: 'Chave Dourada' });

        const porta = new InteractableObject(
            this, 592, 232, 'door', 'keyIcon', 
            "A porta esta trancada. Preciso de uma chave.",
            () => {
                porta.setTexture('openDoor');
                porta.disableInteractive(); 
                
                this.events.emit('showDialogue', "A porta abriu!");

                const zonaSaida = this.add.zone(porta.x, porta.y, porta.width, porta.height);
                zonaSaida.setOrigin(porta.originX, porta.originY);
                zonaSaida.setDepth(100); 
                zonaSaida.setInteractive({ cursor: 'pointer' });

                zonaSaida.on('pointerdown', () => {
                    this.cameras.main.fadeOut(500);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('Level2'); 
                    });
                });
            }
        );

        // NPCs 
        this.kyle = this.physics.add.sprite(-15, 270, 'kyle');
        this.kyle.body.setAllowGravity(false);
        this.kyle.walkAnim = 'right_kyle';
        this.kyle.body.enable = false;

        this.sofia = this.physics.add.sprite(-40, 270, 'sofia');
        this.sofia.body.setAllowGravity(false);
        this.sofia.walkAnim = 'right_sofia';
        this.sofia.body.enable = false;

        this.pedro = this.physics.add.sprite(-20, 270, 'pedro');
        this.pedro.body.setAllowGravity(false);
        this.pedro.walkAnim = 'right_pedro';
        this.pedro.body.enable = false;

        this.partySystem = new PartySystem(this, this.player);
        this.cutsceneManager = new CutsceneManager(this);

        this.time.delayedCall(100, () => {
            this.cutsceneManager.playIntro();
        });
    }

    update() {
        if (this.canMove) {
            if (this.cursors.left.isDown) {
                this.player.moveLeft();
            } else if (this.cursors.right.isDown) {
                this.player.moveRight();
            } else {
                this.player.idle();
            } 
            
            if (this.partySystem) {
                this.partySystem.update();
            }
        }
        
        this.shadow.x = this.player.x;
        this.shadow.y = this.player.y + 15; 
    }
}