export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");

        /*
         * ============================================================
         * CONFIGURAÇÕES DO MUNDO
         * ============================================================
         */

        // Container que contém as plataformas e elementos da fase.
        this.world = null;

        // Tamanho aproximado do mundo.
        this.worldWidth = 3600;
        this.worldHeight = 2200;

        /*
         * ============================================================
         * CONTROLE DO ARRASTO
         * ============================================================
         */

        // Indica se o jogador está segurando a tela.
        this.isDragging = false;

        // Última posição conhecida do ponteiro.
        this.lastPointerX = 0;
        this.lastPointerY = 0;

        // Velocidade atual do mundo.
        this.velocityX = 0;
        this.velocityY = 0;

        /*
         * Velocidade desejada.
         *
         * O cenário não acompanha o dedo de forma seca.
         * Ele vai suavemente até a posição desejada.
         */
        this.targetVelocityX = 0;
        this.targetVelocityY = 0;

        // Intensidade do movimento.
        this.dragStrength = 1;

        // Quanto tempo leva para atingir a velocidade desejada.
        this.acceleration = 0.18;

        // Força da desaceleração quando o dedo é solto.
        this.friction = 0.88;

        // Velocidade máxima do cenário.
        this.maxVelocity = 55;

        /*
         * ============================================================
         * LIMITES DA CÂMERA / MUNDO
         * ============================================================
         */

        this.minWorldX = 0;
        this.maxWorldX = 0;

        this.minWorldY = 0;
        this.maxWorldY = 0;
    }

    create() {

        /*
         * ============================================================
         * FUNDO
         * ============================================================
         *
         * O fundo fica FORA do mundo.
         *
         * Assim ele permanece parado enquanto as plataformas
         * se movimentam.
         */

        this.createBackground();

        /*
         * ============================================================
         * MUNDO
         * ============================================================
         */

        this.world = this.add.container(
            this.scale.width / 2,
            this.scale.height / 2
        );

        /*
         * Cria os elementos da fase.
         */
        this.createLevel();

        /*
         * Cria o cubo.
         *
         * O cubo fica fora do world e permanece no centro.
         */
        this.createPlayer();

        /*
         * Calcula os limites que o mundo pode atingir.
         */
        this.updateWorldBounds();

        /*
         * ============================================================
         * CONTROLES
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

        /*
         * Quando a tela muda de tamanho, recalculamos
         * os limites do mundo.
         */
        this.scale.on(
            "resize",
            this.handleResize,
            this
        );
    }

    createBackground() {

        /*
         * ============================================================
         * FUNDO
         * ============================================================
         */

        const width = this.scale.width;
        const height = this.scale.height;

        /*
         * Fundo principal.
         */
        this.background = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x0d1017
        );

        this.background.setDepth(-10);

        /*
         * Pequenos pontos decorativos.
         *
         * Eles ficam no fundo e não acompanham o mundo.
         */
        this.backgroundDetails = this.add.graphics();

        this.backgroundDetails.setDepth(-9);

        this.drawBackgroundDetails();
    }

    drawBackgroundDetails() {

        /*
         * Limpa os detalhes antigos.
         */
        this.backgroundDetails.clear();

        /*
         * Desenha pequenos pontos no fundo.
         */
        this.backgroundDetails.fillStyle(
            0x1b2230,
            0.8
        );

        const width = this.scale.width;
        const height = this.scale.height;

        const spacing = 90;

        for (
            let x = 0;
            x <= width;
            x += spacing
        ) {
            for (
                let y = 0;
                y <= height;
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
         * Agora temos plataformas reais.
         *
         * As posições são relativas ao centro do mundo.
         */

        this.createPlatform(
            -900,
            500,
            500,
            70
        );

        this.createPlatform(
            -250,
            350,
            350,
            70
        );

        this.createPlatform(
            300,
            200,
            300,
            70
        );

        this.createPlatform(
            750,
            50,
            420,
            70
        );

        this.createPlatform(
            100,
            -150,
            380,
            70
        );

        this.createPlatform(
            -550,
            -250,
            450,
            70
        );

        this.createPlatform(
            -1100,
            -50,
            300,
            70
        );

        this.createPlatform(
            900,
            -350,
            500,
            70
        );

        this.createPlatform(
            300,
            -550,
            320,
            70
        );

        /*
         * Plataforma inicial.
         *
         * O cubo começa visualmente sobre ela.
         */
        this.createPlatform(
            0,
            300,
            260,
            70
        );

        /*
         * Plataforma final.
         */
        this.createPlatform(
            1100,
            450,
            500,
            70
        );

        /*
         * Decoração no mundo.
         */
        this.createWorldDecorations();
    }

    createPlatform(
        x,
        y,
        width,
        height
    ) {

        /*
         * Cria uma plataforma com aparência
         * mais próxima de um jogo real.
         */

        const platform = this.add.graphics();

        /*
         * Corpo da plataforma.
         */
        platform.fillStyle(
            0x252c38,
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
         * Parte superior da plataforma.
         */
        platform.fillStyle(
            0x4b5668,
            1
        );

        platform.fillRoundedRect(
            x - width / 2,
            y - height / 2,
            width,
            10,
            5
        );

        /*
         * Pequeno detalhe inferior.
         */
        platform.lineStyle(
            2,
            0x151a22,
            1
        );

        platform.strokeRoundedRect(
            x - width / 2,
            y - height / 2,
            width,
            height,
            14
        );

        this.world.add(platform);
    }

    createWorldDecorations() {

        /*
         * ============================================================
         * DECORAÇÕES
         * ============================================================
         */

        const decorations = this.add.graphics();

        decorations.lineStyle(
            2,
            0x202735,
            1
        );

        /*
         * Algumas linhas decorativas grandes.
         */
        decorations.lineBetween(
            -1500,
            800,
            1500,
            800
        );

        decorations.lineBetween(
            -1500,
            -800,
            1500,
            -800
        );

        /*
         * Pequenos círculos espalhados pelo mundo.
         */
        decorations.fillStyle(
            0x313b4c,
            0.8
        );

        const points = [
            [-1300, 500],
            [-800, -500],
            [-300, 700],
            [500, -700],
            [1000, 100],
            [1300, -500]
        ];

        for (const point of points) {

            decorations.fillCircle(
                point[0],
                point[1],
                5
            );
        }

        this.world.add(decorations);
    }

    createPlayer() {

        /*
         * ============================================================
         * JOGADOR
         * ============================================================
         *
         * O cubo permanece sempre no centro da tela.
         */

        const size = 58;

        /*
         * Sombra do cubo.
         */
        this.playerShadow = this.add.rectangle(
            this.scale.width / 2 + 6,
            this.scale.height / 2 + 8,
            size,
            size,
            0x000000,
            0.35
        );

        this.playerShadow.setDepth(5);

        /*
         * Corpo do cubo.
         */
        this.player = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            size,
            size,
            0xf5f7fa
        );

        this.player.setDepth(6);

        /*
         * Borda do cubo.
         */
        this.player.setStrokeStyle(
            4,
            0x090b0f
        );

        /*
         * Detalhe interno para dar um pouco
         * mais de personalidade ao cubo.
         */
        this.playerHighlight = this.add.rectangle(
            this.player.x - 10,
            this.player.y - 10,
            10,
            10,
            0xffffff,
            0.7
        );

        this.playerHighlight.setDepth(7);

        /*
         * Pequena animação de respiração.
         *
         * Ainda não é animação de morte ou movimento.
         * É apenas um movimento visual muito sutil.
         */
        this.tweens.add({
            targets: this.player,
            scaleX: 1.025,
            scaleY: 1.025,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    startDrag(pointer) {

        /*
         * Começa um novo arrasto.
         */

        this.isDragging = true;

        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;

        /*
         * Zera a velocidade ao começar um novo
         * movimento manual.
         */
        this.velocityX = 0;
        this.velocityY = 0;
    }

    moveWorld(pointer) {

        /*
         * Só movimenta o mundo enquanto o dedo
         * ou mouse estiver pressionado.
         */
        if (!this.isDragging) {
            return;
        }

        /*
         * Calcula a distância percorrida pelo dedo.
         */
        const deltaX =
            pointer.x - this.lastPointerX;

        const deltaY =
            pointer.y - this.lastPointerY;

        /*
         * A velocidade desejada acompanha o movimento
         * do dedo.
         */
        this.targetVelocityX =
            Phaser.Math.Clamp(
                deltaX * this.dragStrength,
                -this.maxVelocity,
                this.maxVelocity
            );

        this.targetVelocityY =
            Phaser.Math.Clamp(
                deltaY * this.dragStrength,
                -this.maxVelocity,
                this.maxVelocity
            );

        /*
         * Atualiza a posição do ponteiro.
         */
        this.lastPointerX = pointer.x;
        this.lastPointerY = pointer.y;
    }

    stopDrag() {

        /*
         * Finaliza o arrasto.
         *
         * A velocidade atual continua por alguns instantes,
         * criando a sensação de inércia.
         */
        this.isDragging = false;

        this.targetVelocityX = 0;
        this.targetVelocityY = 0;
    }

    update() {

        /*
         * ============================================================
         * MOVIMENTO SUAVE DO MUNDO
         * ============================================================
         */

        if (this.isDragging) {

            /*
             * Aproxima a velocidade atual da velocidade
             * desejada suavemente.
             */
            this.velocityX = Phaser.Math.Linear(
                this.velocityX,
                this.targetVelocityX,
                this.acceleration
            );

            this.velocityY = Phaser.Math.Linear(
                this.velocityY,
                this.targetVelocityY,
                this.acceleration
            );

        } else {

            /*
             * Quando o jogador solta o dedo,
             * o mundo desacelera naturalmente.
             */
            this.velocityX *= this.friction;
            this.velocityY *= this.friction;

            /*
             * Evita que valores muito pequenos
             * continuem sendo processados.
             */
            if (Math.abs(this.velocityX) < 0.05) {
                this.velocityX = 0;
            }

            if (Math.abs(this.velocityY) < 0.05) {
                this.velocityY = 0;
            }
        }

        /*
         * Aplica a velocidade ao mundo.
         */
        this.world.x += this.velocityX;
        this.world.y += this.velocityY;

        /*
         * ============================================================
         * LIMITES DO MUNDO
         * ============================================================
         */

        this.world.x = Phaser.Math.Clamp(
            this.world.x,
            this.minWorldX,
            this.maxWorldX
        );

        this.world.y = Phaser.Math.Clamp(
            this.world.y,
            this.minWorldY,
            this.maxWorldY
        );

        /*
         * ============================================================
         * MANTÉM O CUBO NO CENTRO
         * ============================================================
         */

        const centerX =
            this.scale.width / 2;

        const centerY =
            this.scale.height / 2;

        this.player.setPosition(
            centerX,
            centerY
        );

        this.playerShadow.setPosition(
            centerX + 6,
            centerY + 8
        );

        this.playerHighlight.setPosition(
            centerX - 10,
            centerY - 10
        );
    }

    updateWorldBounds() {

        /*
         * ============================================================
         * LIMITES DO MUNDO
         * ============================================================
         *
         * Impede que o jogador arraste o cenário
         * para fora da área útil da fase.
         */

        const halfWidth =
            this.worldWidth / 2;

        const halfHeight =
            this.worldHeight / 2;

        const screenHalfWidth =
            this.scale.width / 2;

        const screenHalfHeight =
            this.scale.height / 2;

        this.minWorldX =
            screenHalfWidth - halfWidth;

        this.maxWorldX =
            screenHalfWidth + halfWidth;

        this.minWorldY =
            screenHalfHeight - halfHeight;

        this.maxWorldY =
            screenHalfHeight + halfHeight;
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
         * Redesenha os detalhes do fundo.
         */
        this.drawBackgroundDetails();

        /*
         * Atualiza os limites do mundo.
         */
        this.updateWorldBounds();

        /*
         * Mantém o cubo no centro.
         */
        this.player.setPosition(
            width / 2,
            height / 2
        );

        this.playerShadow.setPosition(
            width / 2 + 6,
            height / 2 + 8
        );

        this.playerHighlight.setPosition(
            width / 2 - 10,
            height / 2 - 10
        );
    }
}
