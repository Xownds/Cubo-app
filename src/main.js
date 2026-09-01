import GameScene from "./scenes/GameScene.js";

/*
 * Configuração principal do jogo.
 *
 * O Phaser já é carregado pelo index.html antes
 * deste arquivo ser executado.
 */

const config = {
    /*
     * Phaser.AUTO faz o jogo tentar usar WebGL.
     * Se WebGL não estiver disponível, ele usa Canvas.
     */
    type: Phaser.AUTO,

    /*
     * Configurações de renderização.
     */
    render: {
        antialias: true,
        pixelArt: false
    },

    /*
     * Faz o jogo ocupar e acompanhar
     * o tamanho da tela.
     *
     * Isso será importante quando colocarmos
     * o jogo no Android.
     */
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    /*
     * Objetivo de 60 FPS.
     */
    fps: {
        target: 60,
        forceSetTimeOut: false
    },

    /*
     * Permite utilizar mouse e toque.
     *
     * activePointers: 2 permite até dois
     * pontos de toque simultâneos.
     */
    input: {
        activePointers: 2
    },

    /*
     * Define a cena que será executada
     * quando o jogo começar.
     */
    scene: GameScene,

    /*
     * Cor de fundo inicial do jogo.
     */
    backgroundColor: "#111111"
};

/*
 * Cria e inicia o jogo Phaser.
 */
new Phaser.Game(config);
