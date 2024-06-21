class TitleSplash extends Phaser.Scene {

    playerControlsEnabled = false;

    constructor() {
        super({ key: "title-splash" });
    }

    preload() {
        var cam = this.cameras.main;

        var loadingBar = this.add.graphics();
        this.load.on("progress", function(val) {
            loadingBar.clear();
            loadingBar.fillStyle(0xfff000);
            loadingBar.fillRect(cam.midPoint.x - 200, cam.midPoint.y - 5, 400 * val, 10);
        });
        this.load.on("complete", function() {
            loadingBar.clear();
        });

        this.load.image("jack", "./assets/jack.png");
    }

    create() {
        // ENABLE CONTROLS AFTER A FEW SECONDS
        this.time.addEvent({
            callback: ()=>{this.playerControlsEnabled=true},
            callbackScope: this,
            delay: 3000
        })

        // TITLE TEXT
        this.titleWords = [
            "GO",
            "HERO",
            "PATRIOT",
            "SOLDIER",
            "HERO",
            "FORCE",
        ];
        let delta = 300;
        let x = 50;
        this.titleWords.forEach(
            (w)=>{
                this.time.addEvent({
                    callback: ()=>{
                        var word = this.add.text(0,0, w, {fontFamily:"PressStart2P", fontSize: 90});
                        word.setPosition((game.config.width/2) - (word.width/2), game.config.height/2);
                        this.tweens.add({
                            targets: word,
                            x: x,
                            duration: 200,
                        })
                        word.setFontSize(20);
                        x += word.width + 20;
                    },
                    callbackScope: this,
                    delay: delta,
                });
                delta += 300;
            }
        );

        // UNION JACK OVERLAY
        const jack = this.add.image(game.config.width/2, game.config.height/2, "jack")
            .setScale(8,10)
            .setAlpha(0.5);

        this.tweens.add({
            targets: jack,
            alpha: 0.3,
            duration: 4000,
            loop: -1,
            yoyo: true,
        });
        this.tweens.add({
            targets: jack,
            x: jack.x + 10,
            duration: 8000,
            loop: -1,
            yoyo: true,
        });
        this.tweens.add({
            targets: jack,
            y: jack.y + 20,
            duration: 6000,
            loop: -1,
            yoyo: true,
        });

        this.cameras.main.fadeIn();

        // PRESS X TO START
        const XKey = this.input.keyboard.addKey('X');

        XKey.on('down', function (){
            if(this.playerControlsEnabled){
                this.playerControlsEnabled = false;
                this.cameras.main.once('camerafadeoutcomplete', function(){
                    this.scene.start("desert");
                }, this);
                this.cameras.main.fadeOut();
            }
        }, this);

        this.startText = this.add.text(0,0, "PRESS X TO START", {fontFamily: "PressStart2P", fontSize:15});
        this.startText.setPosition((game.config.width/2) - (this.startText.width/2), 500);
        this.startText.setVisible(false);
        this.tweens.add({
            targets: this.startText,
            alpha: 0,
            duration: 2000,
            loop: -1,
            yoyo: true,
        });

        this.time.addEvent({
            callback: ()=>{this.startText.setVisible(true)},
            callbackScope: this,
            delay: 2500
        });

    }

    update() {

    }
}