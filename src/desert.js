class Desert extends Phaser.Scene {

	pc;
	r = 0;
	bullets;

	constructor() {
		super({key: "desert"})
	}

	preload() {
		var cam = this.cameras.main;

		var loadingBar = this.add.graphics();
        this.load.on("progress", function(val) {
            loadingBar.clear();
            loadingBar.fillStyle("red");
            loadingBar.fillRect(cam.midPoint.x - 200, cam.midPoint.y - 5, 400 * val, 10);
        })
        this.load.on("complete", function() {
            loadingBar.clear();
        })

        this.load.image("hv", "./assets/hummer.png");

        this.load.audio("pew", "./assets/sounds/pew.wav");

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	}

	create() {
		this.physics.world.setBounds(10, 10, game.config.width-20, game.config.height-20)

		this.pc = this.physics.add.sprite(game.config.width/2, 450, 'hv');
		this.pc.setScale(3)
		this.pc.moveSpeed = 300;
		this.pc.setCollideWorldBounds(true);

		this.bullets = this.physics.add.group();
	}

	update() {
		let pc = this.pc;

		if (this.cursors.left.isDown && this.cursors.right.isDown) {
            pc.body.setVelocity(0);
        } else if (this.cursors.right.isDown) {
            pc.body.setVelocityX(pc.moveSpeed);
        } else if (this.cursors.left.isDown) {
            pc.body.setVelocityX(-pc.moveSpeed);
        } else {
            pc.body.setVelocity(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
        	this.pew();
        }

        this.bullets.getChildren().forEach(
        	(b)=>{
        		if(b.body.y < 0){
        			b.destroy();
        		} else {
	        		b.setAngle(this.r*5);
	        	}
        });
        this.r++;

	}

	pew() {
		let pc = this.pc;
		let bullet = this.add.rectangle(pc.x, pc.body.y, 5, 5, 0xffff00);
		this.physics.add.existing(bullet);
		this.bullets.add(bullet);
		bullet.body.setVelocityY(-500);
		this.sound.play("pew", {detune: Phaser.Math.RND.between(-200, 200)});
		return bullet;
	}


}