class DesertHUD extends Phaser.Scene {
    targetsHit = 0;
    patriotism = 100;
    patriotismMax = 150;
    patriotismMin = 80;
    patriotismBarConfig = [
        game.config.width - 160,
        50,
        this.patriotismMax,
        18
    ]

    constructor() {
        super({ key: "desert-hud" });
    }

    preload() {

    }

    create() {
        var HUDTextConfig = { fontSize: 18, fontFamily: "PressStart2P" };

        this.targetsHitText = this.add.text(20, 50, "Targets Hit: 0", HUDTextConfig);
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
        this.targetsHitText.setText("Targets Hit : " + this.targetsHit.toString());

        this.patriotism -= 0.01;

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