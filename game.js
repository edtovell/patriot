const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        }
    },
    scene: [Desert, DesertHUD, Street, StreetHUD]
}

const game = new Phaser.Game(config);
