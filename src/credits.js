class Credits extends Phaser.Scene {
	
	constructor() {
		super({ key: "credits" });
	}

	preload() {

	}

	create () {
		this.cameras.main.fadeIn()

		this.propaganda = this.add.text(0,0,"",{fontFamily:"arial", fontSize:30});
		this.propaganda.setText("UK armed forces veterans are 3.8% of the population\n" +
			"but make up 6% of the rough sleepers")
		this.propaganda.setPosition((game.config.width/2) - (this.propaganda.width/2), 100);

		this.source = this.add.text(0,0,"",{fontFamily:"arial", fontSize:20});
		this.source.setText("source: https://homeless.org.uk/news/ending-veteran-homelessness-in-the-uk/");
		this.source.setPosition((game.config.width/2) - (this.source.width/2), 200);

		this.credit = this.add.text(0,0, "a game by Ed T and Paddy K", {fontFamily:"arial", fontSize:20});
		this.credit.setPosition((game.config.width/2) - (this.credit.width/2), 500)

		this.time.addEvent({
			callback: ()=>{
				this.sound.stopAll();
				this.scene.start("title-splash");
			},
			callbackScope: this,
			delay: 10000
		})


	}

	update () {

	}
}