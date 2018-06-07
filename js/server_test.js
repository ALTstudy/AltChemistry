

var TheGame = {
};

TheGame.Params = {
	baseWidth: 1920,
	baseHeight: 1080,
	iconSize: 364
};

TheGame.Boot = function (game) { };

TheGame.Boot.prototype =  {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },
    preload: function () {
        this.load.image("loading", "loading.png");
    },
    create: function () {
        this.state.start("Loading");
    }	
};

TheGame.Loading = function (game) {
};

TheGame.Loading.prototype = {
    init: function () {
    },
    preload: function () {
        this.stage.backgroundColor = 0x222222;
        var loadingBar = this.add.sprite(this.world.centerX, this.world.centerY, "loading");
        loadingBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(loadingBar);

        this.load.image("gametitle", "gametitle.png");
        this.load.spritesheet("settings", "settings.png", 364, 364);
	this.load.image("background", "background.png");
    },
    create: function () {
       this.state.start("GameTitle");
    }
};

TheGame.MainMenu = function (game) {
};

TheGame.MainMenu.prototype = {
    create: function () {
        this.background = this.add.image(0, 0, "background");
        this.background.height = this.game.height;
        this.background.width = this.game.width;
		
        this.title = this.game.add.image(this.world.centerX, this.world.centerY - this.game.height / 3, "gametitle");
        this.title.anchor.setTo(0.5);
        this.scaleSprite(this.title, this.game.width, this.game.height / 3, 50, 1);
			
        this.playButton = this.game.add.button(this.world.centerX, this.world.centerY, "settings", this.playTheGame, this);
        this.playButton.anchor.setTo(0.5);
        this.playButton.frame = 0;
        this.playButton.clicked = false;
        this.scaleSprite(this.playButton, this.game.width, this.game.height / 3, 50, 1);

        this.infoButton = this.game.add.button(this.world.centerX - TheGame.Params.iconSize / 2 , this.world.centerY + this.game.height / 3, "settings", this.viewGameHelp, this);
        this.infoButton.anchor.setTo(0.5);
        this.infoButton.frame = 4;
        this.infoButton.clicked = false;
        this.scaleSprite(this.infoButton, this.game.width, this.game.height / 3, 50, 0.5);
        this.infoButton.x = this.world.centerX - this.infoButton.width / 2;
		
        this.audioButton = this.game.add.button(this.world.centerX + TheGame.Params.iconSize / 2 , this.world.centerY + this.game.height / 3, "settings", this.setAudio, this);
        this.audioButton.anchor.setTo(0.5);
        this.audioButton.frame = 2;
        this.audioButton.clicked = false;
        this.scaleSprite(this.audioButton, this.game.width, this.game.height / 3, 50, 0.5);
        this.audioButton.x = this.world.centerX + this.infoButton.width / 2;
       },
	scaleSprite: function (sprite, availableSpaceWidth, availableSpaceHeight, padding, scaleMultiplier) {
		var scale = this.getSpriteScale(sprite._frame.width, sprite._frame.height, availableSpaceWidth, availableSpaceHeight, padding);
		sprite.scale.x = scale * scaleMultiplier;
		sprite.scale.y = scale * scaleMultiplier;
	},
	getSpriteScale: function (spriteWidth, spriteHeight, availableSpaceWidth, availableSpaceHeight, minPadding) {
		var ratio = 1;
		var currentDevicePixelRatio = window.devicePixelRatio;
		// Sprite needs to fit in either width or height
		var widthRatio = (spriteWidth * currentDevicePixelRatio + 2 * minPadding) / availableSpaceWidth;
		var heightRatio = (spriteHeight * currentDevicePixelRatio + 2 * minPadding) / availableSpaceHeight;
		if(widthRatio > 1 || heightRatio > 1){
			ratio = 1 / Math.max(widthRatio, heightRatio);
		} 
		return ratio * currentDevicePixelRatio;	
	},
	resize: function (width, height) {
		this.background.height = height;
		this.background.width = width;

		this.scaleSprite(this.title, width, height / 3, 50, 1);
		this.title.x = this.world.centerX;
		this.title.y = this.world.centerY - height / 3;

		this.scaleSprite(this.playButton, width, height / 3, 50, 1);
		this.playButton.x = this.world.centerX;
		this.playButton.y = this.world.centerY ;

		this.scaleSprite(this.infoButton, width, height / 3, 50, 0.5);
		this.infoButton.x = this.world.centerX - this.infoButton.width / 2;
		this.infoButton.y = this.world.centerY + height / 3;

		this.scaleSprite(this.audioButton, width, height / 3, 50, 0.5);
		this.audioButton.x = this.world.centerX + this.audioButton.width / 2;
		this.audioButton.y = this.world.centerY + height / 3;

	},
    playTheGame: function (button) {
        if (!button.clicked) {
            button.clicked = true;
        }
    },
    viewGameHelp: function (button) {
        if (!button.clicked) {
            button.clicked = true;
        }
    },
    setAudio: function (button) {
        if (!button.clicked) {
            button.clicked = true;
        }
    }
};

var mygame;
window.onload = function () {
	mygame = new Phaser.Game(TheGame.Params.baseWidth, TheGame.Params.height, Phaser.AUTO);	
	mygame.state.add("Boot", TheGame.Boot);
	mygame.state.add("Loading", TheGame.Loading);
	mygame.state.add("GameTitle", TheGame.MainMenu);
	mygame.state.start("Boot");
}

