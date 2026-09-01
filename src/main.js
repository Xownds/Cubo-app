import GameScene from "./scenes/GameScene.js";

// Configuração principal do jogo
const config = {
    // Phaser tenta usar WebGL e usa Canvas como alternativa
    type: Phaser.AUTO,

    // Configurações de renderização
    render: {
        antialias: true,
        pixelArt: false
    },

    // Faz o jogo se adaptar ao tamanho da tela
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    // Objetivo de 60 FPS
    fps: {
        target: 60,
        forceSetTimeOut: false
    },

    // Permite entrada por mouse e toque
    input: {
        activePointers: 2
    },

    // Cena principal do jogo
    scene: GameScene,

    // Cor de fundo
    backgroundColor: "#111111"
};

// Inicia o jogo
new Phaser.Game(config);
