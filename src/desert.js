class Desert extends Phaser.Scene {
    pc;
    r = 0;
    bullets;
    targets;
    targetSpawnEvent;
    hud;
    playerControlActive = true;

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

        this.load.image("bg", "./assets/desert-bg.png");
        this.load.image("hv", "./assets/hummer.png");
        this.load.image("target", "./assets/target.png");
        this.load.image("jack", "./assets/jack.png");

        // With thanks to https://saricden.github.io/phaser3-blow-things-up
        this.load.spritesheet("boom", "./assets/boom.png", {frameWidth:64, frameHeight:64});

        this.load.audio("pew", "./assets/sounds/pew.wav");
        this.load.audio("beep", "./assets/sounds/beep.wav");
        this.load.audio("boom", "./assets/sounds/boom.wav");
        this.load.audio("discord", "./assets/sounds/discord.wav");

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    create() {
        this.bg = this.add.tileSprite(game.config.width/2, game.config.height/2, 1024, 1024, "bg");

        this.physics.world.setBounds(10, 10, game.config.width - 20, game.config.height - 20)

        this.pc = this.physics.add.sprite(game.config.width / 2, 450, 'hv');
        this.pc.setScale(3)
        this.pc.moveSpeed = 300;
        this.pc.setDepth(this.pc.y + 30);
        this.pc.setCollideWorldBounds(true);

        this.anims.create({
            key: "kerplode", 
            frames: this.anims.generateFrameNumbers("boom", {start: 0, end: 7}),
            repeat: 0,
            frameRate: 16
        });
        this.boom = this.physics.add.sprite(0,0, "boom");
        this.boom.setScale(3);
        this.boom.setDepth(this.pc.depth + 1);
        this.boom.setVisible(false);
        this.boom.on("animationcomplete", ()=>{this.boom.setVisible(false)});

        this.patriotismEmitter = this.add.particles(0, 0, "jack", {
            scale: { start: 0.3, end: 0 },
            lifespan: 1500,
            alpha: { start: 0.5, end: 0 },
            angle: { min: 220, max: 320 },
            speed: { min: 50, max: 50 },
            emitting: false,
        });

        this.bullets = this.physics.add.group();
        this.targets = this.physics.add.group();

        this.targetSpawnEvent = this.time.addEvent({
            callback: this.spawnTarget,
            callbackScope: this,
            delay: 5000,
            loop: true
        });

        var targetCollider = this.physics.add.overlap(this.bullets, this.targets, this.killTarget, null, this)

        // Instantiate HUD
        if (this.scene.isActive("desert-hud")) {
            this.scene.stop("desert-hud");
        }
        this.scene.launch("desert-hud");
        this.hud = this.scene.get("desert-hud");
    }

    update() {
        this.bg.tilePositionY--;

        let pc = this.pc;
        if (this.playerControlActive){
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

            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                this.pew();
            }
        }

        this.boom.setPosition(this.pc.body.x+this.pc.body.width, this.pc.y);
        
        this.bullets.getChildren().forEach(
            (b) => {
                // despawn bullets when offscreen
                if (b.body.y < 0) {
                    b.destroy();
                } else {
                // rotate for bullet-y-ness
                    b.setAngle(this.r * 5);
                }
            });
        this.r++;

        this.targets.getChildren().forEach(
            (t) => {
                // set display depth
                t.setDepth(t.y);

                // despawn targets when offscreen
                if (t.body.y > game.config.height + 100) {
                    t.destroy();
                }
            });
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
        target.body.setVelocityY(60);
    }

    killTarget(target, bullet) {
        bullet.destroy();
        target.destroy();
        this.sound.play("pew", { detune: -200, rate: 0.5 })
        this.hud.targetsHit++;

        if(this.hud.targetsHit == 5){
            this.hitMine();
        }
    }

    endingCutscene() {
        this.targetSpawnEvent.destroy();
        
        this.time.addEvent({
            callback: ()=>{
                
            },
            callbackScope: this,
            delay: 2000,
        });

        this.time.addEvent({
            callback: this.hitMine,
            callbackScope: this,
            delay: 10000
        })
    }

    hitMine() {
        // stop player
        this.playerControlActive = false;
        this.pc.setVelocityX(0);

        this.sound.play("beep", {detune: 200});

        // go boom
        this.time.addEvent({
            callback: ()=>{
                this.boom.setVisible(true);
                this.boom.play("kerplode");
                this.sound.play("boom");
                this.cameras.main.flash();
                this.cameras.main.shake(400);
            },
            delay: 400,
            callbackScope: this
        });

        // cut to black
        this.time.addEvent({
            callback: ()=>{
                this.scene.stop("desert-hud");
                this.cameras.main.setVisible(false);
                this.sound.play("discord", {loop: true});
            },
            delay: 800,
            callbackScope: this
        });

        // go to next scene
        this.time.addEvent({
            
        });

    }
}