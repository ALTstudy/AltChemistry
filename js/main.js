//main game object
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio , Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update:update});
function preload() {
    //loading images
    game.load.image('background','/assets/images/background2.png');
    game.load.image('beaker_1','/assets/images/beaker1.png');
    game.load.atlasJSONHash('sheet','/assets/images/liquid.png','/assets/images/liquid.json');
    game.load.atlasJSONHash('rotation','/assets/images/last_chance.png','/assets/images/last_chance.json'); 
    game.load.atlasJSONHash('wow','/assets/images/wow_anim.png','/assets/images/wow_anim.json'); 
    game.load.atlasJSONHash('rotationAn','/assets/images/last_chance.png','/assets/images/last_chance.json'); 
    //game.load.atlasJSONHash('anim_2','/assets/images/anim_2.png','/assets/images/anim_2.json');
}
var scaleRatio;
var beaker_1;
var bounds;
var rotated;
var wow;
var anim_2;
var naOhGroup;
var textForRotated;
var textForWow;
var rotationAn;
function create() {
	//scaling
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally  = true;
    this.scale.pageAlignVertically   = true;
    this.game.scale.refresh();
    game.input.mouse.capture = true;
    //enable physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//creating objects
	naOhGroup = game.add.group();
    this.background = this.add.image(0, 0, "background");
    this.background.height = this.game.height;
    this.background.width = this.game.width;
    naOhGroup = game.add.group();
	beaker_1 = game.add.sprite(750,400, 'sheet');
	wow = game.add.sprite(850, 200, 'wow');
	rotationAn = game.add.sprite(300,300, 'rotationAn');
	rotated = game.add.sprite(1050,200,'rotation');
	rotated.animations.add('rotation');
	textForRotated = game.add.text(20,-60, "NaOH", {
        font: "55px Arial",
        fill: "	#F0FFFF",
        align: "center"
    });
    textForWow = game.add.text(-70,60,"H2O2+C17H35COOK(Мило)",{
        font: "35px Arial",
        fill: "	#F0FFFF",
        align: "center"
    });
    textForRotationAn = game.add.text(-20,-60,"(NH₄)₂SO₄", {
        font: "55px Arial",
        fill: "	#F0FFFF",
        align: "center"
    });
    textForWow.visible = false;
    rotationAn.addChildAt(textForRotationAn,0);
    rotated.addChildAt(textForRotated,0);
    wow.addChildAt(textForWow,0);
   // naOhGroup.add(textForRotated);
	//naOhGroup.add(rotated);
	//input configurations
    //naOhGroup.inputEnableChildren = true;
	beaker_1.inputEnabled = true;
	rotated.inputEnabled = true;
	wow.inputEnabled = true;
	rotationAn.inputEnabled = true;
	beaker_1.input.enableDrag();
	rotated.input.enableDrag();
	wow.input.enableDrag();
	rotationAn.input.enableDrag();
	wow.events.onInputDown.add(click,this);
	//testing input handler
	//setting bounds for sprites
	bounds = new Phaser.Rectangle(0,(this.game.height/2)-beaker_1.height,this.game.width,this.game.height-60);
	beaker_1.input.boundsRect = bounds;
	rotated.input.boundsRect = bounds;
	rotationAn.input.boundsRect = bounds;
	wow.input.boundsRect = bounds;
	//collision settings
	game.physics.enable(beaker_1, Phaser.Physics.ARCADE);
	game.physics.enable(wow, Phaser.Physics.ARCADE);
	//beaker_1.anchor.x =0.5;
	//beaker_1.anchor.y = 0.5;
	beaker_1.body.setSize(0,0 , 0, beaker_1.height);
	wow.body.setSize(0,0,0,wow.height);
	game.physics.enable(rotated, Phaser.Physics.ARCADE);
	game.physics.enable(rotationAn, Phaser.Physics.ARCADE);

}

function update(){
game.physics.arcade.collide(rotated, beaker_1, collisionHandling, null, this);
game.physics.arcade.collide(rotationAn, wow, collisionHandling1, null, this);

}
var clicked = false;
function click() {
if(textForWow.visible){
	textForWow.visible = false;
}
if (!clicked) { 
clicked = true;
game.time.events.add(300, function(){
clicked = false;
},this);
return;
}
textForWow.visible = true;
} 
function onDown2(){
	anim_2.animations.add('anim_2');
	anim_2.animations.play('anim_2',50);
}
function onDown(){
	wow.animations.add('wow');
	wow.animations.play('wow',50);
}
function collisionHandling(){
	rotated.y = beaker_1.y - 200;
	rotated.x = beaker_1.x+40;
	rotated.inputEnabled = false;
	beaker_1.inputEnabled = false;
	textForRotated.visible = false;
	rotated.animations.add('rotation');
	rotated.animations.play('rotation',50);
	game.time.events.add(500,function(){
    beaker_1.animations.add('sheet');
    beaker_1.animations.play('sheet',50);
},this);
    rotated.events.onAnimationComplete.add(function(){
    	rotated.inputEnabled = true;
    	beaker_1.inputEnabled = true;
    	textForRotated.visible = true;
    },this);
}
function collisionHandling1(){
	rotationAn.y = wow.y - 100;
	rotationAn.x = wow.x+70;
	rotationAn.inputEnabled = false;
	wow.inputEnabled = false;
	textForRotationAn.visible = false;
	rotationAn.animations.add('rotationAn');
	rotationAn.animations.play('rotationAn',50);
	game.time.events.add(500,function(){
    wow.animations.add('wow');
    wow.animations.play('wow',50);
},this);
    rotationAn.events.onAnimationComplete.add(function(){
    	rotationAn.inputEnabled = true;
    	wow.inputEnabled = true;
    	textForRotationAn.visible = true;
    	rotationAn.y = wow.y + 100;
    },this);
}


	