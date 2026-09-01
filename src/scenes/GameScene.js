export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");

        /*
         * Container que contém todos os elementos
         * do cenário.
         *
         * O cubo do jogador NÃO ficará aqui.
         * Assim o cubo permanece parado no centro
         * enquanto o cenário se movimenta.
         */
        this.world = null;

        /*
         * Guarda a última posição do dedo/mouse
         * durante o arrasto.
         */
        this.lastPointerX = 0;
        this.lastPointerY = 0;

        /*
         * Indica se o jogador está arrastando
         * o cenário.
         */
        this.isDragging = false;

        /*
         * Velocidade do arrasto.
         *
         * 1 = acompanha exatamente o dedo.
         */
        this.dragSpeed = 1;
    }

    create() {

        /*
         * Cria o container do mundo.
         *
         * Tudo que pertence ao cenário será colocado
         * dentro dele.
         */
        this.world = this.add.container(0, 0);

        // Cria o fundo.
        this.createBackground();

        // Cria a grade do cenário.
        this.createGrid();

        // Cria o cubo do jogador.
        this.createPlayer();

        /*
         * Quando o jogador toca ou clica na tela,
         * começa o arrasto.
         */
        this.input.on(
            "pointerdown",
            this.startDrag,
            this
        );

        /*
         * Enquanto o dedo/mouse se movimenta,
         * movimentamos o cenário.
         */
        this.input.on(
            "pointermove",
            this.moveWorld,
            this
        );

        /*
         * Quando solta o dedo/mouse,
         * termina o arrasto.
         */
        this.input.on(
            "pointerup",
            this.stopDrag,
            this
        );

        /*
         * Também encerra o arrasto caso o ponteiro
         * saia da área do jogo.
         */
        this.input.on(
            "pointerupoutside",
            this.stopDrag,
            this
        );
    }

    createBackground() {

        /*
         * Cria o fundo do mundo.
         *
         * Ele fica dentro do container "world",
         * então acompanha o cenário.
         */

        const width = this.scale.width;
        const height = this.scale.height;

        const background = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x151515
        );

        background.setOrigin(0.5);

        this.world.add(background);
    }

    createGrid() {

        /*
         * Cria uma grade grande para representar
         * o cenário.
         *
         * Nesta primeira etapa ela serve para
         * enxergarmos claramente o movimento.
         *
         * Futuramente ela será substituída pelas
         * fases, plataformas, obstáculos etc.
         */

        const gridSize = 80;

        const worldWidth = 3000;
        const worldHeight = 3000;

        const graphics = this.add.graphics();

        /*
         * Define a aparência das linhas da grade.
         */
        graphics.lineStyle(
            1,
            0x292929,
            1
        );

        /*
         * Cria as linhas verticais.
         */
        for (
            let x = -worldWidth;
            x <= worldWidth;
            x += gridSize
        ) {
            graphics.lineBetween(
                x,
                -worldHeight,
                x,
                worldHeight
            );
        }

        /*
         * Cria as linhas horizontais.
         */
        for (
            let y = -worldHeight;
            y <= worldHeight;
            y += gridSize
        ) {
            graphics.lineBetween(
                -worldWidth,
                y,
                worldWidth,
                y
            );
        }

        this.world.add(graphics);

        /*
         * Marca o centro original do cenário.
         *
         * Isso ajuda a perceber que o mundo está
         * se movimentando enquanto o cubo permanece
         * parado.
         */
        const centerPoint = this.add.circle(
            0,
            0,
            5,
            0x555555
        );

        this.world.add(centerPoint);

        /*
         * Posiciona o mundo no centro da tela.
         */
        this.world.x = this.scale.width / 2;
        this.world.y = this.scale.height / 2;
    }

    createPlayer() {

        /*
         * Cria o cubo do jogador.
         *
         * IMPORTANTE:
         * O cubo fica diretamente na cena,
         * e NÃO dentro do "world".
         *
         * Por isso ele não acompanha o cenário.
         */

        const size = 60;

        this.player = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            size,
            size,
            0xffffff
        );

        this.player.setOrigin(0.5);

        /*
         * Adiciona uma borda preta ao cubo.
         */
        this.player.setStrokeStyle(
            4,
            0x000000
        );

        /*
         * Cria uma pequena sombra para deixar
         * o cubo mais destacado.
         */
        this.playerShadow = this.add.rectangle(
            this.player.x + 5,
            this.player.y + 5,
            size,
            size,
            0x000000,
            0.25
        );

        /*
         * A sombra fica atrás do cubo.
         */
        this.playerShadow.setDepth(0);

        /*
         * O cubo fica na frente da sombra.
         */
        this.player.setDepth(1);
    }

    startDrag(pointer) {

        /*
         * Guarda a posição inicial do ponteiro.
         */
        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;

        /*
         * Ativa o modo de arrasto.
         */
        this.isDragging = true;
    }

    moveWorld(pointer) {

        /*
         * Se não estiver arrastando,
         * não fazemos nada.
         */
        if (!this.isDragging) {
            return;
        }

        /*
         * Calcula quanto o dedo/mouse se moveu
         * desde a última atualização.
         */
        const deltaX =
            pointer.x - this.lastPointerX;

        const deltaY =
            pointer.y - this.lastPointerY;

        /*
         * Move o cenário de acordo com o movimento
         * do dedo.
         */
        this.world.x +=
            deltaX * this.dragSpeed;

        this.world.y +=
            deltaY * this.dragSpeed;

        /*
         * Atualiza a posição anterior do ponteiro.
         */
        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;
    }

    stopDrag() {

        /*
         * Finaliza o arrasto.
         */
        this.isDragging = false;
    }

    update() {

        /*
         * Mantém o cubo exatamente no centro
         * mesmo quando a tela muda de tamanho.
         */
        const centerX =
            this.scale.width / 2;

        const centerY =
            this.scale.height / 2;

        this.player.setPosition(
            centerX,
            centerY
        );

        /*
         * Mantém a sombra alinhada com o cubo.
         */
        this.playerShadow.setPosition(
            centerX + 5,
            centerY + 5
        );
    }
}
