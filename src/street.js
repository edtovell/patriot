class Street extends Phaser.Scene {
    pc;
    hud;
    npcs;
    playerControlActive = true;
    missionText;
    objectivesText;
    pcSpeechText;
    npcSpeechText;
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

        this.load.image("jack", "./assets/jack.png");

        this.load.aseprite("pc", "./assets/sprites/PC_Soldier.png", "./assets/sprites/PC_Soldier.json");

        let npcSpriteFiles = [
            ["Alesja_NPC", "./assets/sprites/Alesja_NPC.png", "./assets/sprites/Alesja_NPC.json"],
            ["Basic_NPC_A", "./assets/sprites/Basic_NPC_A.png", "./assets/sprites/Basic_NPC_A.json"],
            ["Basic_NPC_B", "./assets/sprites/Basic_NPC_B.png", "./assets/sprites/Basic_NPC_B.json"],
            ["Basic_NPC_C", "./assets/sprites/Basic_NPC_C.png", "./assets/sprites/Basic_NPC_C.json"],
            ["Basic_NPC_D", "./assets/sprites/Basic_NPC_D.png", "./assets/sprites/Basic_NPC_D.json"],
            ["Basic_NPC_E", "./assets/sprites/Basic_NPC_E.png", "./assets/sprites/Basic_NPC_E.json"],
            ["Basic_NPC_F", "./assets/sprites/Basic_NPC_F.png", "./assets/sprites/Basic_NPC_F.json"],
            ["Basic_NPC_G", "./assets/sprites/Basic_NPC_G.png", "./assets/sprites/Basic_NPC_G.json"],
            ["Basic_NPC_H", "./assets/sprites/Basic_NPC_H.png", "./assets/sprites/Basic_NPC_H.json"],
            // ["Basic_NPC_Horror", "./assets/sprites/Basic_NPC_Horror.png", "./assets/sprites/Basic_NPC_Horror.json"],
            ["Basic_NPC_J", "./assets/sprites/Basic_NPC_J.png", "./assets/sprites/Basic_NPC_J.json"],
            ["Basic_NPC_K", "./assets/sprites/Basic_NPC_K.png", "./assets/sprites/Basic_NPC_K.json"],
            ["Basic_NPC_L", "./assets/sprites/Basic_NPC_L.png", "./assets/sprites/Basic_NPC_L.json"],
            ["Basic_NPC_M", "./assets/sprites/Basic_NPC_M.png", "./assets/sprites/Basic_NPC_M.json"],
            ["Basic_NPC_N", "./assets/sprites/Basic_NPC_N.png", "./assets/sprites/Basic_NPC_N.json"],
            ["Basic_NPC_P", "./assets/sprites/Basic_NPC_P.png", "./assets/sprites/Basic_NPC_P.json"],
            ["Basic_NPC_Q", "./assets/sprites/Basic_NPC_Q.png", "./assets/sprites/Basic_NPC_Q.json"],
            ["Basic_NPC_R", "./assets/sprites/Basic_NPC_R.png", "./assets/sprites/Basic_NPC_R.json"],
            ["Basic_NPC_S", "./assets/sprites/Basic_NPC_S.png", "./assets/sprites/Basic_NPC_S.json"],
            ["Basic_NPC_T", "./assets/sprites/Basic_NPC_T.png", "./assets/sprites/Basic_NPC_T.json"],
            ["Basic_NPC_W", "./assets/sprites/Basic_NPC_W.png", "./assets/sprites/Basic_NPC_W.json"],
            ["Basic_NPC_Z", "./assets/sprites/Basic_NPC_Z.png", "./assets/sprites/Basic_NPC_Z.json"],
            ["Ed_NPC", "./assets/sprites/Ed_NPC.png", "./assets/sprites/Ed_NPC.json"],
            ["Josiah_NPC", "./assets/sprites/Josiah_NPC.png", "./assets/sprites/Josiah_NPC.json"],
            ["Paddy_NPC", "./assets/sprites/Paddy_NPC.png", "./assets/sprites/Paddy_NPC.json"],
            ["Rishi_Soon_to_be_old_PM", "./assets/sprites/Rishi_Soon_to_be_old_PM.png", "./assets/sprites/Rishi_Soon_to_be_old_PM.json"],
        ];

        npcSpriteFiles.forEach((f)=>{this.load.aseprite(...f)});
        this.npcSpriteKeys = npcSpriteFiles.map((f)=>{return f[0]});

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    create() {
        this.physics.world.setBounds(10, 10, game.config.width - 20, game.config.height - 20);

        // PC
        var pc = this.physics.add.sprite(game.config.width / 2, 450, 'pc');
        pc.setScale(2);
        pc.moveSpeed = 50;
        pc.body.setSize(40,80);
        pc.setCollideWorldBounds(true);
        pc.setDepth(pc.y + 30);
        pc.isMoving = function() {
            return Boolean(this.body.velocity.x || this.body.velocity.y)
        }
        this.anims.createFromAseprite("pc");

        this.pc = pc;

        this.pcSpeechText = this.add.text(
            pc.body.x + pc.body.width,
            pc.y - 80,
            "",
            {fontSize: 10, fontFamily:"PressStart2P"}
        );
        this.pcSpeechText.setDepth(1000);
        this.npcSpeechText = this.add.text(
            0,
            0,
            "",
            {fontSize: 10, fontFamily:"PressStart2P", color: 0x42adf5}
        );
        this.npcSpeechText.setDepth(999);

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
        this.npcSpriteKeys.forEach((k)=>{this.anims.createFromAseprite(k)});

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
            (pc, npc)=>{return npc.interactable},
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

        // PC anims
        if(pc.body.velocity.x > 0){
            pc.anims.play("moveRight", true);
        } else if(pc.body.velocity.x < 0){
            pc.anims.play("moveLeft", true);
        } else {
            pc.anims.play("idle", true);
        }

        // PC controls
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
                if(this.targetNpc){
                    this.excuseMe();
                    this.playerControlActive = false;
                    this.interact(this.targetNpc);
                    this.time.addEvent({
                        callback: ()=>{this.playerControlActive=true},
                        callbackScope: this,
                        delay: 800,
                    })
                } else {
                    this.hello();
                    this.playerControlActive=false;
                    this.time.addEvent({
                        callback: ()=>{this.playerControlActive=true},
                        callbackScope: this,
                        delay: 400,
                    })
                }
            }
        } else {
            pc.body.setVelocityX(0);
        }

        this.pcSpeechText.setX(pc.body.x + 40);

        // Set target NPC
        if(pc.body.touching.none){
            this.targetNpc = null;
        }

        if(this.targetNpc){
            this.targetNpc.body.debugBodyColor = 0x42d7f5;
        }

        // Manage NPCs
        this.npcs.getChildren().forEach(
            (npc) => {
                // set animation

                if (npc.isMoving()){
                    npc.anims.play(npc.name + ".move", true);
                } else {
                    npc.anims.play(npc.name + ".idle", true);
                }

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

    excuseMe() {
        this.pcSpeechText.setText("excuse me do you\nhave any change");
        this.time.addEvent({
            callback: ()=>{this.pcSpeechText.setText("")},
            callbackScope: this,
            delay: 700,
        });
    }

    interact(npc) {
        if(npc.willIgnore){
            return
        }
        if(npc.willGive){
            this.npcSpeechText.setColor("green");
        } else {
            this.npcSpeechText.setColor("red");
        }
        npc.previousVelocity = npc.body.velocity.clone();
        npc.setVelocity(0,0);
        this.time.addEvent({
            callback: ()=>{
                this.npcSpeechText.setText(npc.response)
                    .setPosition(npc.body.x + 40, npc.y - 80)
                    .setVisible(true)
            },
            callbackScope: this,
            delay: 400,
        });
        this.time.addEvent({
            callback: ()=>{
                this.npcSpeechText.setVisible(false);
                npc.body.setVelocity(npc.previousVelocity.x, npc.previousVelocity.y);
                npc.interactable = false;
                this.hud.change += npc.change;
                this.targetNpc = null;
            },
            callbackScope: this,
            delay: 1000
        });
    }

    spawnNpc() {
        // NPC start coords
        let x = Phaser.Math.RND.between(100, game.config.width - 100);

        // Instantiate NPC
        let name = Phaser.Math.RND.pick(this.npcSpriteKeys)
        console.log("Spawning NPC: " + name);
        let npc = this.physics.add.sprite(x, -100, name);
        this.npcs.add(npc);
        npc.setName(name);
        npc.setScale(2);
        npc.body.setSize(40,80);
        npc.body.setVelocityY(80 + Phaser.Math.RND.between(-10, 10));

        // NPC anims
        npc.isMoving = function() {
            return Boolean(this.body.velocity.x || this.body.velocity.y);
        }

        // NPC direction
        let xVelocityOptions = [-30, -15, 0, 15, 30];
        if(x < 300){
            xVelocityOptions = [0, 15, 30];
        } else if(x>(game.config.width-300)){
            xVelocityOptions = [-30, -15, 0];
        }
        npc.body.setVelocityX(Phaser.Math.RND.pick(xVelocityOptions) + Phaser.Math.RND.between(-5, 5));

        // NPC interaction behaviour
        npc.interactable = true;
        npc.willIgnore = Phaser.Math.RND.pick([true, false]);
        if(npc.willIgnore){
            npc.willGive = false;
            npc.change = 0;
            npc.body.debugBodyColor = 0xf54242;
        } else {
            npc.willGive = Phaser.Math.RND.pick([true, false]);
            if(npc.willGive){
                npc.change = Phaser.Math.RND.pick([5, 6, 7, 10, 12, 20, 23, 28, 40, 50, 70, 100, 150, 200]);
                npc.response = "ok sure"
                npc.body.debugBodyColor = 0x65e071;
            } else {
                npc.change = 0;
                npc.response = "no, sorry";
            }
        }

    }
}