class DesertTitle extends Phaser.Scene {

    constructor() {
        super({ key: "desert-title" });
    }

    preload() {

    }

    create() {
        var titleMask = this.add.graphics()
            .fillStyle("black")
            .fillRect(0,0,game.config.width, game.config.height);

        var titleText = this.add.text(0,0, "Afghanistan\n2004",
            {fontFamily: "PressStart2P", fontSize:30});
        titleText.setPosition(
            game.config.width / 1.8,
            game.config.height / 1.5
        );

        this.cameras.main.fadeIn();
        this.time.addEvent({
            callback: ()=>{
                this.scene.stop("desert-title");
            },
            callbackScope: this,
            delay: 4000,
        })
    }

    update() {

    }
}