import { Player } from '../gameObjects/Player.js';
import { PartySystem } from '../systems/PartySystem.js';
import { CutsceneManager } from '../systems/Cutscenes.js';

export class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
    }

    create() {
        // 1. UI e Mapa
        this.scene.launch('UIScene'); // Garante que a UI continue
        const uiScene = this.scene.get('UIScene');

    // 2. Ensinamos o Level2 a mandar mensagens para a UI
    // Toda vez que 'showDialogue' for emitido AQUI, chamamos a função lá na UI
    this.events.on('showDialogue', (text, portrait) => {
        if (uiScene.dialogueSystem) {
            uiScene.dialogueSystem.show(text, portrait);
        }
    });

    // 3. Ensinamos o Level2 a escutar quando a UI fecha (para destravar movimento)
    // Precisamos ouvir o evento da UI, não do Level2
    // (Opcional: se você usa this.canMove no update)
    uiScene.events.on('dialogueFinished', () => {
        // Se a UI emitir um evento global, podemos capturar aqui
        // Mas como seu DialogueBox emite para "this.scene.gameScene", 
        // ele pode estar tentando avisar a cena errada ("Game" em vez de "Level2").
        
        // CORREÇÃO RÁPIDA: Destrava direto aqui se necessário
        this.canMove = true; 
    });
        this.calm = this.sound.add('calm');
        this.calm.play({loop:true});
        // Adicione seu mapa/fundo aqui
        const map = this.make.tilemap({ key: 'biblioteca' });
        
        const tilesetChao = map.addTilesetImage('floor', 'img_chao');
        const tilesetParede = map.addTilesetImage('walls', 'img_parede');
        const tilesetMark = map.addTilesetImage('walls', 'img_parede');
        const tilesetShelf = map.addTilesetImage('wood', 'img_moveis');
        const tilesetBook = map.addTilesetImage('books', 'img_book');

        const floorLayer = map.createLayer('floor', tilesetChao, 0, 0);
        const wallLayer = map.createLayer('walls', tilesetParede, 0, 0);
        const markLayer = map.createLayer('marks', tilesetMark, 0, 0);
        const shelfLayer = map.createLayer('shelf', tilesetShelf, 0, 0);
        const bookLayer = map.createLayer('books', tilesetBook, 0, 0);




        // 2. A Parede Secreta (Sprite que cobre o buraco)
        // Posicione ela onde o buraco estaria
        // 1. Parede Secreta (Fechada/Física) - Você já tem isso
        this.paredeSecreta = this.physics.add.sprite(500, 100, 'parede_falsa');
        this.paredeSecreta.setImmovable(true);

        // 2. Passagem Aberta (Imagem do buraco) - NOVO
        // Coloque na MESMA posição da parede secreta
        this.imagemPassagem = this.add.image(176, 143, 'passagem_aberta');
        this.imagemPassagem.setVisible(false); // Começa escondida
        
        // Ajuste de Profundidade:
        // Fundo (0) -> Passagem (1) -> Parede Fechada (2) -> Personagens (3)
        this.imagemPassagem.setDepth(0);
        this.paredeSecreta.setDepth(2);

        this.shadow = this.add.graphics();
        this.shadow.fillStyle(0x000000, 0.6); 
        this.shadow.fillEllipse(0, 0, 15, 5); 
        this.shadow.setDepth(0);

        // 3. Personagens (Lily e o Grupo)
        // Posicione Lily na entrada da biblioteca
        this.player = new Player(this, 175, 205, 'lily'); 
        this.canMove = true;
        this.player.body.setAllowGravity(false);
        
        // NPCs (Começam "em cima" ou logo atrás da Lily)
        this.kyle = this.physics.add.sprite(80, 205, 'kyle');
        this.kyle.body.setAllowGravity(false);
        this.kyle.walkAnim = 'right_kyle'; // <--- IMPORTANTE

        this.sofia = this.physics.add.sprite(60, 205, 'sofia');
        this.sofia.body.setAllowGravity(false);
        this.sofia.walkAnim = 'right_sofia'; // <--- IMPORTANTE

        this.pedro = this.physics.add.sprite(40, 205, 'pedro');
        this.pedro.body.setAllowGravity(false);
        this.pedro.walkAnim = 'right_pedro'; // <--- IMPORTANTE

        this.cursors = this.input.keyboard.createCursorKeys();

        // Configura Câmera e Colisões
        this.cameras.main.setBounds(0, 0, map.widthInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1, 0, 50);
        this.cameras.main.setZoom(2); 

        // 4. Iniciar Party System (Fila Indiana)
        this.partySystem = new PartySystem(this, this.player);
        this.partySystem.addFollower(this.kyle);
        this.partySystem.addFollower(this.sofia);
        this.partySystem.addFollower(this.pedro);
        this.partySystem.start();

        // 5. Setup da Estante Interativa
        this.setupBookshelf();

        // 6. Gerenciador de Cutscenes
        this.cutsceneManager = new CutsceneManager(this);
        this.canMove = true;
    }

    setupBookshelf() {
        // Contador de cliques
        this.bookCount = 0;

        // Dados dos livros (Roteiro)
        this.bookDialogues = [
            { text: '"O Corvo" — Edgar Allan Poe\n\nClássico. Meio sombrio… combina com essa casa.', face: 'face_kyle' },
            { text: '"Lenora" — Heloisa Prieto\n\nAi, eu amava esse na escola. Meio assustador, mas poético.', face: 'face_sofia' },
            { text: '"Alice no País das Maravilhas"\n\nEu sempre quis cair num mundo secreto assim. Mas sem perder a cabeça.', face: 'face_lily' },
            { text: '"Memórias do Subsolo"\n\nSe eu tivesse que ler isso nas férias eu voltava pra casa.', face: 'face_pedro' },
            { text: '"O Declínio de um Homem"\n\n Pesado demais pra estar aqui no meio desse nada…', face: 'face_sofia' }
        ];

        // ZONA INVISÍVEL (Clicável) na estante
        // Ajuste x, y, width, height para bater com o desenho da sua estante
        const shelfZone = this.add.zone(175, 140, 100, 100);
        shelfZone.setOrigin(0.5);
        shelfZone.setInteractive({ cursor: 'pointer' });

        shelfZone.on('pointerdown', () => {
            // Lógica dos Cliques
            if (this.bookCount < this.bookDialogues.length) {
                // MOSTRA OS COMENTÁRIOS DOS LIVROS
                const data = this.bookDialogues[this.bookCount];
                this.events.emit('showDialogue', data.text, data.face);
                this.bookCount++;
            } else if (this.bookCount === this.bookDialogues.length) {
                // ÚLTIMO CLIQUE: A DESCOBERTA
                this.cutsceneManager.playLibrarySecret();
                this.bookCount++; // Trava para não clicar mais
            }
        });
        
        //this.input.enableDebug(shelfZone, 0x00ff00);
    }

    update() {
        if (this.canMove){
        if (this.cursors.left.isDown){
            this.player.moveLeft();
        } 
        else if (this.cursors.right.isDown){
            this.player.moveRight();
        } 
        else {
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