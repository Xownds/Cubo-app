import GameScene from "./scenes/GameScene.js";

/*
 * Configuração principal do jogo.
 *
 * Tudo que for específico da cena ficará dentro
 * de GameScene.js.
 */

const config = {
    type: Phaser.AUTO,

    // O jogo tentará usar WebGL e cairá para Canvas
    // caso o dispositivo não tenha suporte.
    render: {
        antialias: true,
        pixelArt: false
    },

    // Ajuste automático para celular e PC.
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    // 60 FPS como objetivo.
    fps: {
        target: 60,
        forceSetTimeOut: false
    },

    // Entrada por mouse e toque.
    input: {
        activePointers: 2
    },

    // Cena principal.
    scene: GameScene,

    backgroundColor: "#111111"
};

// Inicializa o jogo.
new Phaser.Game(config);
