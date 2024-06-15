class Desert extends Phaser.Scene {

    pc;
    r = 0;
    bullets;
    targets;
    hud;

    constructor() {
        super({ key: "desert" });
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

        this.load.image("hv", "./assets/hummer.png");
        this.load.image("target", "./assets/target.png");

        this.load.audio("pew", "./assets/sounds/pew.wav");

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    create() {
        this.physics.world.setBounds(10, 10, game.config.width - 20, game.config.height - 20)

        this.pc = this.physics.add.sprite(game.config.width / 2, 450, 'hv');
        this.pc.setScale(3)
        this.pc.moveSpeed = 300;
        this.pc.setCollideWorldBounds(true);

        this.bullets = this.physics.add.group();
        this.targets = this.physics.add.group();

        var targetSpawnEvent = this.time.addEvent({
            callback: this.spawnTarget,
            callbackScope: this,
            delay: 5000,
            loop: true
        });

        var targetCollider = this.physics.add.overlap(this.bullets, this.targets, this.killTarget, null, this)

        // Instantiate HUD
        if (this.scene.isActive("desert-hud")){
            this.scene.stop("desert-hud");
        }
        this.scene.launch("desert-hud");
        this.hud = this.scene.get("desert-hud");
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

        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)){
            this.hud.patriotism++;
        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.pew();
        }

        // despawn bullets when offscreen
        this.bullets.getChildren().forEach(
            (b) => {
                if (b.body.y < 0) {
                    b.destroy();
                } else {
                    b.setAngle(this.r * 5);
                }
            });
        this.r++;

        // despawn targets when offscreen
        this.targets.getChildren().forEach(
            (t) => {
                if (t.body.y > game.config.height + 100) {
                    t.destroy();
                }
            })
    }

    pew() {
        let pc = this.pc;
        let bullet = this.add.rectangle(pc.x, pc.body.y, 5, 5, 0xffff00);
        this.physics.add.existing(bullet);
        this.bullets.add(bullet);
        bullet.body.setVelocityY(-500);
        this.sound.play("pew", { detune: Phaser.Math.RND.between(-200, 200) });
    }

    spawnTarget() {
        let x = Phaser.Math.RND.between(100, game.config.width - 100);
        let target = this.physics.add.sprite(x, -100, "target");
        this.targets.add(target);
        target.body.setVelocityY(50);
    }

    killTarget(target, bullet) {
        bullet.destroy();
        target.destroy();
        this.sound.play("pew", { detune: -200, rate: 0.5 })
        this.hud.targetsHit++;
    }


}