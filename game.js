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
    scene: [
        TitleSplash,
        Desert,
        DesertHUD,
        DesertTitle,
        Street,
        StreetHUD,
        StreetTitle,
        FullscreenManager,
        Credits,
    ]
    // scene: [Street, StreetHUD, StreetTitle, FullscreenManager, TitleSplash, Credits]
}

const game = new Phaser.Game(config);