class StreetHUD extends Phaser.Scene {
    change = 0;
    patriotism = 80;
    patriotismMax = 100;
    patriotismMin = 0;
    patriotismBarConfig = [
        game.config.width - 160,
        50,
        150,
        18
    ]

    constructor() {
        super({ key: "street-hud" });
    }

    preload() {

    }

    create() {
        var HUDTextConfig = { fontSize: 18, fontFamily: "PressStart2P" };

        this.changeText = this.add.text(20, 50, "Change £0.00", HUDTextConfig);
        var patriotismText = this.add.text(game.config.width - 380, 50, "Patriotism: ", HUDTextConfig);

        var patriotismBarContainer = this.add.graphics()
            .lineStyle(1, 0xffffff)
            .strokeRect(...this.patriotismBarConfig);

        this.patriotismBarConfig[2] = this.patriotism;
        this.patriotismBar = this.add.graphics()
            .fillStyle(0x0411c2)
            .fillRect(...this.patriotismBarConfig);

        this.tooltip1 = this.add.text(0,0, "Z   X", {fontFamily: "PressStart2P", fontSize:20});
        this.tooltip1.setPosition(150, 580);

        this.tooltip2 = this.add.text(0,0, "←   →", {fontFamily: "PressStart2P", fontSize:20});
        this.tooltip2.setPosition(game.config.width - this.tooltip2.width - 150, 580);
    }

    update() {
        this.changeText.setText("Change £" + (this.change / 100).toFixed(2).toString());

        this.patriotism -= 0.05;

        if (this.patriotism < this.patriotismMin) {
            this.patriotism = this.patriotismMin;
        } else if (this.patriotism > this.patriotismMax) {
            this.patriotism = this.patriotismMax;
        }

        this.patriotismBarConfig[2] = this.patriotism;
        this.patriotismBar.clear();
        this.patriotismBar.fillStyle(0x0411c2).fillRect(...this.patriotismBarConfig);
    }


}