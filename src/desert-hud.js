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
    }

    update() {
        this.targetsHitText.setText("Targets Hit : " + this.targetsHit.toString());

        this.patriotism-=0.01;

        if(this.patriotism < this.patriotismMin){
            this.patriotism = this.patriotismMin;
        } else if(this.patriotism > this.patriotismMax){
            this.patriotism = this.patriotismMax;
        }

        this.patriotismBarConfig[2] = this.patriotism;
        this.patriotismBar.clear();
        this.patriotismBar.fillStyle(0x0411c2).fillRect(...this.patriotismBarConfig);
    }


}