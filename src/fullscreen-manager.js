class FullscreenManager extends Phaser.Scene {
	constructor() {
        super({ key: "fullscreen-manager" });
    }

    create() {
    	const FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function ()
        {

            if (this.scale.isFullscreen)
            {
                this.scale.stopFullscreen();
            }
            else
            {
                this.scale.startFullscreen();
            }

        }, this);
    }
}
