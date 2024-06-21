const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        }
    },
    scene: [Desert, DesertHUD, DesertTitle, Street, StreetHUD, StreetTitle]
    // scene: [Street, StreetHUD, StreetTitle]
}

const game = new Phaser.Game(config);
