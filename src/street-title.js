class StreetTitle extends Phaser.Scene {

    constructor() {
        super({ key: "street-title" });
    }

    preload() {

    }

    create() {
        var titleMask = this.add.graphics()
            .fillStyle("black")
            .fillRect(0,0,game.config.width, game.config.height);

        var titleText = this.add.text(0,0, "   London\n20 years later",
            {fontFamily: "PressStart2P", fontSize:30});
        titleText.setPosition(
            game.config.width / 2.2,
            game.config.height / 1.5
        );

        this.cameras.main.fadeIn();
        this.time.addEvent({
            callback: ()=>{
                this.scene.stop("street-title");
            },
            callbackScope: this,
            delay: 4000,
        })
    }

    update() {

    }
}