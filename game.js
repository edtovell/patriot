const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        }
    },
    // scene: [Desert, DesertHUD, DesertTitle, Street, StreetHUD, StreetTitle, FullscreenManager]
    scene: [Street, StreetHUD, StreetTitle, FullscreenManager]
}

const game = new Phaser.Game(config);
