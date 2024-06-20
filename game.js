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
    scene: [Desert, DesertHUD, Street, StreetHUD]
    // scene: [Street, StreetHUD]
}

const game = new Phaser.Game(config);
