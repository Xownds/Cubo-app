```javascript
export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");

        // Grupo que representa tudo que pertence ao cenário.
        // No futuro teremos aqui:
        // gelo, lava, espinhos, plataformas, obstáculos etc.
        this.world = null;

        // Posição anterior do dedo/mouse.
        this.lastPointerX = 0;
        this.lastPointerY = 0;

        // Indica se o jogador está arrastando.
        this.isDragging = false;

        // Velocidade do movimento.
        this.dragSpeed = 1;
    }

    create() {

        /*
         * Cria um container para o cenário.
         *
         * IMPORTANTE:
         * O cubo NÃO ficará nesse container.
         *
         * Assim conseguimos deixar o cubo parado
         * enquanto movimentamos apenas o mundo.
         */
        this.world = this.add.container(0, 0);

        this.createBackground();
        this.createGrid();
        this.createPlayer();

        /*
         * Eventos de toque/mouse.
         */
        this.input.on("pointerdown", this.startDrag, this);

        this.input.on("pointermove", this.moveWorld, this);

        this.input.on("pointerup", this.stopDrag, this);
        this.input.on("pointerupoutside", this.stopDrag, this);
    }

    createBackground() {

        /*
         * Fundo do jogo.
         *
         * Ele também pertence ao mundo,
         * portanto se movimentará junto.
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
         * Cria uma grade simples para deixar
         * o movimento do cenário visível.
         *
         * Essa grade será substituída futuramente
         * pelo cenário real das fases.
         */

        const size = 80;

        const worldWidth = 3000;
        const worldHeight = 3000;

        const graphics = this.add.graphics();

        graphics.lineStyle(1, 0x292929, 1);

        // Linhas verticais.
        for (let x = -worldWidth; x <= worldWidth; x += size) {

            graphics.lineBetween(
                x,
                -worldHeight,
                x,
                worldHeight
            );
        }

        // Linhas horizontais.
        for (let y = -worldHeight; y <= worldHeight; y += size) {

            graphics.lineBetween(
                -worldWidth,
                y,
                worldWidth,
                y
            );
        }

        this.world.add(graphics);

        /*
         * Pequeno ponto central do mundo.
         *
         * Ele ajuda a perceber que o cenário
         * está se movimentando em relação ao cubo.
         */
        const centerPoint = this.add.circle(
            0,
            0,
            5,
            0x555555
        );

        this.world.add(centerPoint);

        /*
         * Posiciona o mundo inicialmente no centro
         * da tela.
         */
        this.world.x = this.scale.width / 2;
        this.world.y = this.scale.height / 2;
    }

    createPlayer() {

        /*
         * O jogador fica FORA do container "world".
         *
         * Isso faz o cubo permanecer exatamente
         * no centro enquanto o cenário se movimenta.
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
         * Borda do cubo.
         */
        this.player.setStrokeStyle(
            4,
            0x000000
        );

        /*
         * Pequena sombra para dar profundidade.
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
         * A sombra precisa ficar atrás do cubo.
         */
        this.playerShadow.setDepth(0);

        this.player.setDepth(1);
    }

    startDrag(pointer) {

        /*
         * Guarda a posição inicial do toque.
         */
        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;

        this.isDragging = true;
    }

    moveWorld(pointer) {

        /*
         * Só movimentamos o cenário se
         * o jogador estiver arrastando.
         */
        if (!this.isDragging) {
            return;
        }

        /*
         * Calcula quanto o dedo se moveu
         * desde o último frame/evento.
         */
        const deltaX =
            pointer.x - this.lastPointerX;

        const deltaY =
            pointer.y - this.lastPointerY;

        /*
         * Movemos o cenário na mesma direção
         * do dedo.
         *
         * Depois podemos inverter esse comportamento
         * caso o controle fique mais natural para o jogo.
         */
        this.world.x += deltaX * this.dragSpeed;
        this.world.y += deltaY * this.dragSpeed;

        /*
         * Atualiza a última posição.
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
         * Mantém o jogador exatamente no centro
         * caso a tela seja redimensionada.
         */

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.player.setPosition(
            centerX,
            centerY
        );

        this.playerShadow.setPosition(
            centerX + 5,
            centerY + 5
        );
    }
}
```
