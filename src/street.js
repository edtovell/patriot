class Street extends Phaser.Scene {
    pc;
    hud;
    npcs;
    playerControlActive = true;
    missionText;
    objectivesText;
    pcSpeechText;
    targetNpc = null;

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

        // PC
        var pc = this.physics.add.sprite(game.config.width / 2, 450, 'pc');
        pc.setScale(2);
        pc.moveSpeed = 50;
        pc.setCollideWorldBounds(true);
        pc.setDepth(pc.y + 30);

        this.pc = pc;

        this.pcSpeechText = this.add.text(
            pc.body.x + pc.body.width,
            pc.y - 70,
            "",
            {fontSize: 10, fontFamily:"PressStart2P"}
        );
        this.pcSpeechText.setDepth(1000);

        // Patriotism effect
        this.patriotismEmitter = this.add.particles(0, 0, "jack", {
            scale: { start: 0.3, end: 0 },
            lifespan: 1500,
            alpha: { start: 0.5, end: 0 },
            angle: { min: 220, max: 320 },
            speed: { min: 50, max: 50 },
            emitting: false,
        });

        // Spawn NPCs
        this.npcs = this.physics.add.group()
        var npcSpawnEvent = this.time.addEvent({
            callback: this.spawnNpc,
            callbackScope: this,
            delay: 3000,
            loop: true,
            startAt: -6000,
        });

        // Mission Objectives
        this.missionText = this.add.text(0, 200, "", {fontSize: 30, fontFamily: "PressStart2P"});
        this.objectivesText = this.add.text(0, 240, "", {fontSize: 20, fontFamily: "PressStart2P"});

        this.time.addEvent({
            callback: ()=>{
                this.missionText.setText("LEVEL 7691");
                this.missionText.setX((game.config.width/2) - (this.missionText.width/2));
                this.objectivesText.setText("MISSION OBJECTIVES\n - Ask for money", {align: 1});
                this.objectivesText.setX((game.config.width/2) - (this.objectivesText.width/2));
            },
            callbackScope: this,
            delay: 1000
        })

        this.time.addEvent({
            callback: ()=>{
                this.missionText.setVisible(false);
                this.objectivesText.setVisible(false);
            },
            callbackScope: this,
            delay: 6000,
        });

        // Recognise NPCs when overlapping
        var pcNpcOverlap = this.physics.add.overlap(
            this.pc,
            this.npcs,
            (pc, npc)=>{
                if(npc.y < pc.y){
                    this.targetNpc = npc;
                } else {
                    this.targetNpc = null;
                    npc.body.debugBodyColor = 0xe09fdc;
                }
            },
            (pc, npc)=>{
                return !npc.willIgnore;
            },
            this,
        );

        // Instantiate HUD
        if (this.scene.isActive("street-hud")) {
            this.scene.stop("street-hud");
        }
        this.scene.launch("street-hud");
        this.hud = this.scene.get("street-hud");
    }

    update() {
        let pc = this.pc;

        if(this.playerControlActive){
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
                this.hello();
                this.playerControlActive=false;
                this.time.addEvent({
                    callback: ()=>{this.playerControlActive=true},
                    callbackScope: this,
                    delay: 400,
                })
            }
        } else {
            pc.body.setVelocityX(0);
        }

        this.pcSpeechText.setX(pc.body.x + pc.body.width);

        if(pc.body.touching.none){
            this.targetNpc = null;
        }

        if(this.targetNpc){
            this.targetNpc.body.debugBodyColor = 0x42d7f5;
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

    hello() {
        this.pcSpeechText.setText("hello");
        this.time.addEvent({
            callback: ()=>{this.pcSpeechText.setText("")},
            callbackScope: this,
            delay: 500,
        });
    }

    interact(npc) {

    }

    spawnNpc() {
        // NPC start coords
        let x = Phaser.Math.RND.between(100, game.config.width - 100);
        let npc = this.physics.add.sprite(x, -100, "npc");
        this.npcs.add(npc);
        npc.setScale(2);
        npc.body.setVelocityY(80 + Phaser.Math.RND.between(-10, 10));

        // NPC direction
        let xVelocityOptions = [-30, -15, 0, 15, 30];
        if(x < 300){
            xVelocityOptions = [0, 15, 30];
        } else if(x>(game.config.width-300)){
            xVelocityOptions = [-30, -15, 0];
        }
        npc.body.setVelocityX(Phaser.Math.RND.pick(xVelocityOptions) + Phaser.Math.RND.between(-5, 5));

        // NPC interaction behaviour
        npc.willIgnore = Phaser.Math.RND.pick([true, false]);
        if(npc.willIgnore){
            npc.willGive = false;
            npc.change = 0;
            npc.body.debugBodyColor = 0xf54242;
        } else {
            npc.willGive = Phaser.Math.RND.pick([true, false]);
            if(npc.willGive){
                npc.change = Phaser.Math.RND.pick([5, 6, 7, 10, 12, 20, 23, 28, 40, 50, 70, 100, 150, 200]);
                npc.body.debugBodyColor = 0x65e071;
            } else {
                npc.change = 0;
            }
        }

    }
}