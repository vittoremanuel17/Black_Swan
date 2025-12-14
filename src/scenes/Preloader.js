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
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.tilemapTiledJSON('meu_mapa', 'Background_mansion.json');

        this.load.bitmapFont('pixelFont', 'round_6x6.png', 'round_6x6.xml');


        this.load.image('img_chao', 'floors.png');
        this.load.image('img_parede', 'walls.png');
        this.load.image('img_moveis', 'dark_wood.png');
        this.load.image('star', 'star.png');
        this.load.image('item1', 'item1.png');
        this.load.image('item2', 'item2.png');
        this.load.image('item3', 'item3.png');
        this.load.image('door', 'Sprite-0004.png');
        this.load.image('backpack', 'backpack.png');
               
        this.load.spritesheet(
            'girl',
            'pinkspritesheet.png',
            {frameWidth: 32, frameHeight: 32}
        )
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
