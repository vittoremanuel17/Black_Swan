export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        this.load.setPath('assets');

        this.load.tilemapTiledJSON('meu_mapa', 'Background_mansion.json');
        this.load.tilemapTiledJSON('biblioteca', 'Mapa2.json');

        this.load.bitmapFont('pixelFont', 'round_6x6.png', 'round_6x6.xml');

        this.load.image('inventory_background', 'inv.png');
        this.load.image('slot_background', 'slots.png');
        
        this.load.image('passagem_aberta', 'fakewall.png');
        this.load.image('img_chao', 'floors.png');
        this.load.image('img_book', 'books.png');
        this.load.image('img_parede', 'walls.png');
        this.load.image('img_moveis', 'dark_wood.png');
        this.load.image('item1', 'item1.png');
        this.load.image('item2', 'item2.png');
        this.load.image('item3', 'item3.png');
        this.load.image('bench', 'bench.png');
        this.load.image('key', './items/keysprite.png');
        this.load.image('keyIcon', './items/keyIcon.png');
        this.load.image('door', 'Sprite-0004.png');
        this.load.image('openDoor', 'Sprite-0005.png');
        this.load.image('backpack', 'backpack.png');
        this.load.audio('calm', './sounds/calm.mp3');
        this.load.audio('dark', './sounds/dark.mp3');
        this.load.audio('car', './sounds/car.mp3');
        this.load.audio('plim', './sounds/plim.mp3');

        this.load.image('face_pedro', 'pedroHead.png');
        this.load.image('face_lily', 'lilyHead.png');
        this.load.image('face_sofia', 'sofiaHead.png');
        this.load.image('face_kyle', 'kyleHead.png');
               
        this.load.spritesheet(
            'lily',
            'lilySpritesheet.png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet(
            'pedro',
            'pedroSpritesheet.png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet(
            'kyle',
            'Spriteblue.png',
            {frameWidth: 32, frameHeight: 32}
        );
        this.load.spritesheet(
            'sofia',
            'pinkspritesheet.png',
            {frameWidth: 32, frameHeight: 32}
        );
    }

    create() {
        this.anims.create({
            key: 'left_pedro',
            frames: this.anims.generateFrameNumbers('pedro', {start: 1, end: 4}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'turn_pedro',
            frames: [ {key: 'pedro', frame: 0}],
            frameRate: 1,
        });

        this.anims.create({
            key: 'right_pedro',
            frames: this.anims.generateFrameNumbers('pedro', {start: 1, end: 4}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'left_sofia',
            frames: this.anims.generateFrameNumbers('sofia', {start: 1, end: 4}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'turn_sofia',
            frames: [ {key: 'sofia', frame: 0}],
            frameRate: 1,
        });

        this.anims.create({
            key: 'right_sofia',
            frames: this.anims.generateFrameNumbers('sofia', {start: 1, end: 4}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'left_kyle',
            frames: this.anims.generateFrameNumbers('kyle', {start: 1, end: 4}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'turn_kyle',
            frames: [ {key: 'kyle', frame: 0}],
            frameRate: 1,
        });

        this.anims.create({
            key: 'right_kyle',
            frames: this.anims.generateFrameNumbers('kyle', {start: 1, end: 4}),
            frameRate: 5,
            repeat: -1
        });
        this.scene.start('Game');
    }
}
