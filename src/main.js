import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { Preloader } from './scenes/Preloader.js';
import { UIScene } from './scenes/UIScene.js'; // Importar
import { Level2 } from './scenes/Level2.js';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    pixelArt:true,
    roundPixels: true,
    parent: 'game-container',
    backgroundColor: '#028af8',
    dom: {
        createContainer: false 
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 500 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        Game,
        Level2,
        UIScene,
        GameOver
    ]
};

new Phaser.Game(config);
