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
    scene: [Desert, DesertHUD]
}

const game = new Phaser.Game(config);
