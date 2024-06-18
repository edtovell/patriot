class Street extends Phaser.Scene {
    pc;
    hud;
    npcs;

    constructor() {
        super({ key: "street" });
    }

    preload() {
        var cam = this.cameras.main;

        var loadingBar = this.add.graphics();
        this.load.on("progress", function(val) {
            loadingBar.clear();
            loadingBar.fillStyle(0xfff000);
            loadingBar.fillRect(cam.midPoint.x - 200, cam.midPoint.y - 5, 400 * val, 10);
        })
        this.load.on("complete", function() {
            loadingBar.clear();
        })

        this.load.image("pc", "./assets/pc.png");
        this.load.image("npc", "./assets/npc.png");
        this.load.image("jack", "./assets/jack.png");

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    create() {
        this.physics.world.setBounds(10, 10, game.config.width - 20, game.config.height - 20);

        this.pc = this.physics.add.sprite(game.config.width / 2, 450, 'pc');
        this.pc.setScale(2);
        this.pc.moveSpeed = 50;
        this.pc.setCollideWorldBounds(true);
        this.pc.setDepth(this.pc.y + 30);

        this.patriotismEmitter = this.add.particles(0, 0, "jack", {
            scale: { start: 0.3, end: 0 },
            lifespan: 1500,
            alpha: { start: 0.5, end: 0 },
            angle: { min: 220, max: 320 },
            speed: { min: 50, max: 50 },
            emitting: false,
        });

        this.npcs = this.physics.add.group()
        var npcSpawnEvent = this.time.addEvent({
            callback: this.spawnNpc,
            callbackScope: this,
            delay: 3000,
            loop: true
        });

        // Instantiate HUD
        if (this.scene.isActive("street-hud")) {
            this.scene.stop("street-hud");
        }
        this.scene.launch("street-hud");
        this.hud = this.scene.get("street-hud");
    }

    update() {
        let pc = this.pc;

        if (this.cursors.left.isDown && this.cursors.right.isDown) {
            pc.body.setVelocity(0);
        } else if (this.cursors.right.isDown) {
            pc.body.setVelocityX(pc.moveSpeed);
        } else if (this.cursors.left.isDown) {
            pc.body.setVelocityX(-pc.moveSpeed);
        } else {
            pc.body.setVelocity(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.hud.patriotism++;
            this.patriotismEmitter.emitParticleAt(pc.x, pc.y - 70);
        }

        this.npcs.getChildren().forEach(
            (npc) => {
                // set display depth
                npc.setDepth(npc.y);

                // despawn npcs when offscreen
                if (npc.body.y > game.config.height + 100) {
                    npc.destroy();
                }
            })


    }

    spawnNpc() {
        let x = Phaser.Math.RND.between(100, game.config.width - 100);
        let npc = this.physics.add.sprite(x, -100, "npc");
        this.npcs.add(npc);
        npc.setScale(2);
        npc.body.setVelocityY(80 + Phaser.Math.RND.between(-10, 10));

        let xVelocityOptions = [-30, -15, 0, 15, 30];
        if(x < 300){
            xVelocityOptions = [0, 15, 30];
        } else if(x>(game.config.width-300)){
            xVelocityOptions = [-30, -15, 0];
        }
        npc.body.setVelocityX(Phaser.Math.RND.pick(xVelocityOptions) + Phaser.Math.RND.between(-5, 5));

    }
}