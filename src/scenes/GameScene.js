export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");

        /*
         * ============================================================
         * CONFIGURAÇÃO DO MUNDO
         * ============================================================
         */

        this.world = null;

        // Tamanho total da fase.
        this.worldWidth = 4200;
        this.worldHeight = 2600;

        /*
         * ============================================================
         * JOGADOR
         * ============================================================
         */

        this.player = null;
        this.playerShadow = null;

        // Posição real do cubo dentro do mundo.
        this.playerWorldX = 0;
        this.playerWorldY = 180;

        // Velocidade física do cubo.
        this.playerVelocityX = 0;
        this.playerVelocityY = 0;

        // Gravidade.
        this.gravity = 0.65;

        // Força do salto automático.
        this.jumpForce = -13;

        // Tamanho do cubo.
        this.playerSize = 58;

        /*
         * ============================================================
         * FÍSICA
         * ============================================================
         */

        this.groundY = 0;

        this.isGrounded = false;

        /*
         * ============================================================
         * ARRASTO DO MUNDO
         * ============================================================
         */

        this.isDragging = false;

        this.lastPointerX = 0;
        this.lastPointerY = 0;

        // Velocidade atual do cenário.
        this.worldVelocityX = 0;
        this.worldVelocityY = 0;

        // Velocidade desejada.
        this.targetWorldVelocityX = 0;
        this.targetWorldVelocityY = 0;

        // Intensidade do arrasto.
        this.dragStrength = 1.0;

        // Suavidade da aceleração.
        this.dragAcceleration = 0.20;

        // Inércia após soltar.
        this.dragFriction = 0.90;

        // Velocidade máxima do cenário.
        this.maxWorldVelocity = 45;

        /*
         * ============================================================
         * PLATAFORMAS
         * ============================================================
         */

        this.platforms = [];

        /*
         * ============================================================
         * LIMITES
         * ============================================================
         */

        this.minWorldX = 0;
        this.maxWorldX = 0;

        this.minWorldY = 0;
        this.maxWorldY = 0;

        /*
         * ============================================================
         * ESTADO DO JOGO
         * ============================================================
         */

        this.gameStarted = false;
        this.levelCompleted = false;
    }

    create() {

        /*
         * Cria o fundo.
         */
        this.createBackground();

        /*
         * Cria o mundo.
         */
        this.world = this.add.container(
            this.scale.width / 2,
            this.scale.height / 2
        );

        /*
         * Cria a fase.
         */
        this.createLevel();

        /*
         * Cria o jogador.
         */
        this.createPlayer();

        /*
         * Calcula os limites do mundo.
         */
        this.updateWorldBounds();

        /*
         * Configura os controles.
         */
        this.setupInput();

        /*
         * Ajusta o jogo quando a tela muda.
         */
        this.scale.on(
            "resize",
            this.handleResize,
            this
        );

        /*
         * O jogo começa automaticamente.
         */
        this.gameStarted = true;
    }

    createBackground() {

        /*
         * ============================================================
         * FUNDO
         * ============================================================
         */

        const width = this.scale.width;
        const height = this.scale.height;

        this.background = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x0b0f16
        );

        this.background.setDepth(-20);

        /*
         * Detalhes do fundo.
         */
        this.backgroundDetails = this.add.graphics();

        this.backgroundDetails.setDepth(-19);

        this.drawBackground();
    }

    drawBackground() {

        /*
         * Limpa os detalhes anteriores.
         */
        this.backgroundDetails.clear();

        /*
         * Pequenos pontos decorativos.
         */
        this.backgroundDetails.fillStyle(
            0x202938,
            0.8
        );

        const spacing = 90;

        for (
            let x = 0;
            x < this.scale.width;
            x += spacing
        ) {

            for (
                let y = 0;
                y < this.scale.height;
                y += spacing
            ) {

                this.backgroundDetails.fillCircle(
                    x,
                    y,
                    2
                );
            }
        }
    }

    createLevel() {

        /*
         * ============================================================
         * FASE
         * ============================================================
         *
         * Agora as plataformas possuem posições reais
         * dentro do mundo.
         */

        this.createPlatform(
            -700,
            400,
            500,
            70
        );

        this.createPlatform(
            -50,
            300,
            320,
            70
        );

        this.createPlatform(
            500,
            180,
            360,
            70
        );

        this.createPlatform(
            1050,
            50,
            420,
            70
        );

        this.createPlatform(
            1450,
            220,
            300,
            70
        );

        this.createPlatform(
            1900,
            400,
            500,
            70
        );

        this.createPlatform(
            2450,
            250,
            380,
            70
        );

        this.createPlatform(
            2900,
            50,
            420,
            70
        );

        this.createPlatform(
            3400,
            300,
            550,
            70
        );

        /*
         * Plataforma inicial.
         */
        this.createPlatform(
            0,
            240,
            400,
            70
        );

        /*
         * Plataforma final.
         */
        this.createPlatform(
            3850,
            100,
            450,
            70
        );
    }

    createPlatform(
        x,
        y,
        width,
        height
    ) {

        /*
         * Cria o gráfico da plataforma.
         */
        const platform = this.add.graphics();

        /*
         * Corpo.
         */
        platform.fillStyle(
            0x273142,
            1
        );

        platform.fillRoundedRect(
            x - width / 2,
            y - height / 2,
            width,
            height,
            14
        );

        /*
         * Parte superior.
         */
        platform.fillStyle(
            0x5d6a7e,
            1
        );

        platform.fillRoundedRect(
            x - width / 2,
            y - height / 2,
            width,
            9,
            5
        );

        /*
         * Borda.
         */
        platform.lineStyle(
            2,
            0x151b24,
            1
        );

        platform.strokeRoundedRect(
            x - width / 2,
            y - height / 2,
            width,
            height,
            14
        );

        /*
         * Adiciona ao mundo.
         */
        this.world.add(platform);

        /*
         * Guarda os dados físicos da plataforma.
         */
        this.platforms.push({
            object: platform,
            x: x,
            y: y,
            width: width,
            height: height
        });
    }

    createPlayer() {

        /*
         * ============================================================
         * CUBO
         * ============================================================
         */

        this.playerWorldX = 0;
        this.playerWorldY = 180;

        /*
         * Sombra.
         */
        this.playerShadow = this.add.rectangle(
            this.scale.width / 2 + 6,
            this.scale.height / 2 + 8,
            this.playerSize,
            this.playerSize,
            0x000000,
            0.35
        );

        this.playerShadow.setDepth(5);

        /*
         * Cubo.
         */
        this.player = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.playerSize,
            this.playerSize,
            0xf5f7fa
        );

        this.player.setStrokeStyle(
            4,
            0x090b0f
        );

        this.player.setDepth(6);

        /*
         * Pequeno brilho.
         */
        this.playerHighlight = this.add.rectangle(
            this.player.x - 10,
            this.player.y - 10,
            10,
            10,
            0xffffff,
            0.8
        );

        this.playerHighlight.setDepth(7);
    }

    setupInput() {

        /*
         * ============================================================
         * CONTROLES DE TOQUE E MOUSE
         * ============================================================
         */

        this.input.on(
            "pointerdown",
            this.startDrag,
            this
        );

        this.input.on(
            "pointermove",
            this.moveWorld,
            this
        );

        this.input.on(
            "pointerup",
            this.stopDrag,
            this
        );

        this.input.on(
            "pointerupoutside",
            this.stopDrag,
            this
        );
    }

    startDrag(pointer) {

        /*
         * Guarda a posição inicial.
         */
        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;

        this.isDragging = true;

        /*
         * Zera a velocidade antiga para que um novo
         * arrasto seja controlável.
         */
        this.worldVelocityX = 0;
        this.worldVelocityY = 0;

        this.targetWorldVelocityX = 0;
        this.targetWorldVelocityY = 0;
    }

    moveWorld(pointer) {

        /*
         * Só movimenta enquanto o dedo estiver pressionado.
         */
        if (!this.isDragging) {
            return;
        }

        /*
         * Distância percorrida pelo dedo.
         */
        const deltaX =
            pointer.x - this.lastPointerX;

        const deltaY =
            pointer.y - this.lastPointerY;

        /*
         * Calcula a velocidade desejada.
         */
        this.targetWorldVelocityX =
            Phaser.Math.Clamp(
                deltaX * this.dragStrength,
                -this.maxWorldVelocity,
                this.maxWorldVelocity
            );

        this.targetWorldVelocityY =
            Phaser.Math.Clamp(
                deltaY * this.dragStrength,
                -this.maxWorldVelocity,
                this.maxWorldVelocity
            );

        /*
         * Atualiza o ponteiro.
         */
        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;
    }

    stopDrag() {

        /*
         * Soltou o dedo.
         *
         * O mundo continuará se movimentando por um
         * curto período graças à inércia.
         */
        this.isDragging = false;

        this.targetWorldVelocityX = 0;
        this.targetWorldVelocityY = 0;
    }

    update() {

        /*
         * Só atualiza se o jogo estiver iniciado.
         */
        if (!this.gameStarted) {
            return;
        }

        /*
         * ============================================================
         * FÍSICA DO CUBO
         * ============================================================
         */

        this.updatePlayerPhysics();

        /*
         * ============================================================
         * MOVIMENTO DO MUNDO
         * ============================================================
         */

        this.updateWorldMovement();

        /*
         * ============================================================
         * POSIÇÃO VISUAL DO CUBO
         * ============================================================
         */

        this.updatePlayerVisual();
    }

    updatePlayerPhysics() {

        /*
         * A gravidade puxa o cubo para baixo.
         */
        this.playerVelocityY += this.gravity;

        /*
         * Atualiza a posição real.
         */
        this.playerWorldY +=
            this.playerVelocityY;

        /*
         * Assume que o cubo está no ar.
         */
        this.isGrounded = false;

        /*
         * Verifica todas as plataformas.
         */
        for (const platform of this.platforms) {

            /*
             * Limites horizontais da plataforma.
             */
            const platformLeft =
                platform.x - platform.width / 2;

            const platformRight =
                platform.x + platform.width / 2;

            /*
             * Parte superior da plataforma.
             */
            const platformTop =
                platform.y - platform.height / 2;

            /*
             * Limites do cubo.
             */
            const playerLeft =
                this.playerWorldX -
                this.playerSize / 2;

            const playerRight =
                this.playerWorldX +
                this.playerSize / 2;

            const playerBottom =
                this.playerWorldY +
                this.playerSize / 2;

            /*
             * Verifica se existe sobreposição horizontal.
             */
            const horizontalCollision =
                playerRight > platformLeft &&
                playerLeft < platformRight;

            /*
             * Verifica se o cubo está caindo
             * sobre a plataforma.
             */
            const verticalCollision =
                this.playerVelocityY >= 0 &&
                playerBottom >= platformTop &&
                playerBottom <=
                platformTop + 35;

            if (
                horizontalCollision &&
                verticalCollision
            ) {

                /*
                 * Coloca o cubo exatamente em cima
                 * da plataforma.
                 */
                this.playerWorldY =
                    platformTop -
                    this.playerSize / 2;

                /*
                 * Para a queda.
                 */
                this.playerVelocityY = 0;

                this.isGrounded = true;

                /*
                 * Salto automático.
                 *
                 * Isso mantém a mecânica contínua:
                 * o jogador manipula o mundo enquanto
                 * o cubo atravessa as plataformas.
                 */
                this.playerVelocityY =
                    this.jumpForce;

                break;
            }
        }

        /*
         * Se o cubo cair muito abaixo da fase,
         * ele volta para o início.
         */
        if (
            this.playerWorldY >
            this.worldHeight / 2
        ) {

            this.respawnPlayer();
        }
    }

    updateWorldMovement() {

        /*
         * ============================================================
         * MOVIMENTO SUAVE
         * ============================================================
         */

        if (this.isDragging) {

            /*
             * Aproxima suavemente a velocidade atual
             * da velocidade desejada.
             */
            this.worldVelocityX =
                Phaser.Math.Linear(
                    this.worldVelocityX,
                    this.targetWorldVelocityX,
                    this.dragAcceleration
                );

            this.worldVelocityY =
                Phaser.Math.Linear(
                    this.worldVelocityY,
                    this.targetWorldVelocityY,
                    this.dragAcceleration
                );

        } else {

            /*
             * Inércia.
             */
            this.worldVelocityX *=
                this.dragFriction;

            this.worldVelocityY *=
                this.dragFriction;

            /*
             * Elimina movimentos muito pequenos.
             */
            if (
                Math.abs(this.worldVelocityX) <
                0.05
            ) {
                this.worldVelocityX = 0;
            }

            if (
                Math.abs(this.worldVelocityY) <
                0.05
            ) {
                this.worldVelocityY = 0;
            }
        }

        /*
         * Move o mundo.
         */
        this.world.x +=
            this.worldVelocityX;

        this.world.y +=
            this.worldVelocityY;

        /*
         * Limita o mundo.
         */
        this.world.x =
            Phaser.Math.Clamp(
                this.world.x,
                this.minWorldX,
                this.maxWorldX
            );

        this.world.y =
            Phaser.Math.Clamp(
                this.world.y,
                this.minWorldY,
                this.maxWorldY
            );
    }

    updatePlayerVisual() {

        /*
         * ============================================================
         * CUBO FIXO NO CENTRO DA TELA
         * ============================================================
         */

        const centerX =
            this.scale.width / 2;

        const centerY =
            this.scale.height / 2;

        /*
         * O cubo permanece visualmente no centro.
         */
        this.player.setPosition(
            centerX,
            centerY
        );

        /*
         * Sombra.
         */
        this.playerShadow.setPosition(
            centerX + 6,
            centerY + 8
        );

        /*
         * Brilho.
         */
        this.playerHighlight.setPosition(
            centerX - 10,
            centerY - 10
        );

        /*
         * Pequena deformação visual dependendo
         * da velocidade vertical.
         */
        const verticalSpeed =
            Math.abs(this.playerVelocityY);

        const stretch =
            Phaser.Math.Clamp(
                verticalSpeed * 0.003,
                0,
                0.08
            );

        this.player.scaleY =
            1 + stretch;

        this.player.scaleX =
            1 - stretch * 0.5;
    }

    respawnPlayer() {

        /*
         * ============================================================
         * RENASCIMENTO BÁSICO
         * ============================================================
         *
         * O sistema completo de morte/respawn virá depois.
         * Aqui apenas evitamos que o cubo desapareça.
         */

        this.playerWorldX = 0;
        this.playerWorldY = 180;

        this.playerVelocityX = 0;
        this.playerVelocityY = 0;

        /*
         * Reposiciona o mundo.
         */
        this.world.x =
            this.scale.width / 2;

        this.world.y =
            this.scale.height / 2;

        /*
         * Zera a inércia.
         */
        this.worldVelocityX = 0;
        this.worldVelocityY = 0;

        this.targetWorldVelocityX = 0;
        this.targetWorldVelocityY = 0;
    }

    updateWorldBounds() {

        /*
         * ============================================================
         * LIMITES DO MUNDO
         * ============================================================
         */

        const halfWorldWidth =
            this.worldWidth / 2;

        const halfWorldHeight =
            this.worldHeight / 2;

        const halfScreenWidth =
            this.scale.width / 2;

        const halfScreenHeight =
            this.scale.height / 2;

        this.minWorldX =
            halfScreenWidth -
            halfWorldWidth;

        this.maxWorldX =
            halfScreenWidth +
            halfWorldWidth;

        this.minWorldY =
            halfScreenHeight -
            halfWorldHeight;

        this.maxWorldY =
            halfScreenHeight +
            halfWorldHeight;
    }

    handleResize(gameSize) {

        /*
         * ============================================================
         * REDIMENSIONAMENTO
         * ============================================================
         */

        const width = gameSize.width;
        const height = gameSize.height;

        /*
         * Atualiza o fundo.
         */
        this.background.setPosition(
            width / 2,
            height / 2
        );

        this.background.setSize(
            width,
            height
        );

        /*
         * Redesenha os detalhes.
         */
        this.drawBackground();

        /*
         * Recalcula os limites.
         */
        this.updateWorldBounds();

        /*
         * Mantém o mundo corretamente posicionado.
         */
        this.world.x =
            Phaser.Math.Clamp(
                this.world.x,
                this.minWorldX,
                this.maxWorldX
            );

        this.world.y =
            Phaser.Math.Clamp(
                this.world.y,
                this.minWorldY,
                this.maxWorldY
            );
    }
}
