//main game object
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio , Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update:update});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function preload()
{
	this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    firstRunLandscape = game.scale.isGameLandscape;
    this.scale.pageAlignHorizontally  = true;
    game.scale.forceOrientation(true, false);
    game.scale.enterIncorrectOrientation.add(handleIncorrect);
    game.scale.leaveIncorrectOrientation.add(handleCorrect);
    game.scale.refresh();
    //loading images
    game.load.image('background', 'assets/images/table.png');
    game.load.image('restartBtn','assets/images/restart.png');
    game.load.image('beaker_1', 'assets/images/beaker1.png');
    game.load.atlasJSONHash('sheet', 'assets/images/liquid.png', 'assets/images/liquid.json');
    game.load.atlasJSONHash('wow', 'assets/images/wow_anim.png', 'assets/images/wow_anim.json');
    game.load.atlasJSONHash('rotation', 'assets/images/last_chance.png', 'assets/images/last_chance.json');
    game.load.atlasJSONHash ('steam_2_0', 'assets/images/steam_2_full_-0.png', 'assets/images/steam_2_full_-0.json');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bottles, rotated bottles for them and text
var steam = { bottle: null, textBot: null, rotated: null, textRot: null, clickBot: false };		// 
var beaker = { bottle: null, textBot: null, rotated: null, textRot: null };						// bottle - green, rotated - NaOh
var wow = { bottle: null, textBot: null, rotated: null, textRot: null, clickBot: false };		// bottle - soap, rotated - (NH₄)₂SO₄

// other variables
var scaleRatio;
var bounds;
var naOhGroup;
var restartBtn;
var tSteam;
var tBeaker;
var tWow;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function create()
{
	//scaling
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically   = true;
    this.game.scale.refresh();
    game.input.mouse.capture = true;
    // enable physics
	//game.physics.startSystem(Phaser.Physics.ARCADE);
	// creating objects
	naOhGroup = game.add.group();
    this.background = this.add.image(0, 0, "background");
    this.background.height = this.game.height;
    this.background.width = this.game.width;

    var height = this.game.height;
    var width  = this.game.width;
    // creating new group
    //naOhGroup = game.add.group();
    //button behavior
    restartBtn = game.add.button(10, 10, 'restartBtn', restart, this,'over','out', 1);
    if (!game.device.desktop ){
        restartBtn.scale.setTo(2,2);
     }
    // adding bottle sprites
	steam.bottle 	= game.add.sprite (width / 4.80, height / 1.47, 'steam_2_0');
	beaker.bottle 	= game.add.sprite (width / 9.00, height / 1.18, 'sheet');
	wow.bottle 		= game.add.sprite (width / 3.30, height / 1.18, 'wow');
	// adding rotated sprites
    steam.rotated 	= game.add.sprite (width / 1.09, height / 1.18, 'rotation');
	beaker.rotated 	= game.add.sprite (width / 1.30, height / 1.18, 'rotation');
	wow.rotated 	= game.add.sprite (width / 1.19, height / 1.47, 'rotation');

	// set anchor
	setAnchorTo (steam.bottle, 1, 1);
	setAnchorTo (steam.rotated, 1, 1);
	setAnchorTo (beaker.bottle, 1, 1);
	setAnchorTo (beaker.rotated, 1, 1);
	setAnchorTo (wow.bottle, 1, 1);
	setAnchorTo (wow.rotated, 1, 1);

	// define properties of text for bottles
    var yText = beaker.bottle.height - beaker.bottle.height;
    var yText2 = beaker.bottle.height + beaker.bottle.height / 4 + 20;
     
    steam.textBot = game.add.text (-275, -yText, "NH₄OH + K₂CO₃\n(Розчин аміаку + карбонат калію)",
    {
        font: "25px Comic Sans MS, Comic Sans MS5, cursive",
        fill: "	#F0FFFF",
        align: "center"
    });
    steam.textFinished = game.add.text (-213, -yText, "K₂CO₃+2HCl = 2KCl+H₂O+CO₂ (Газ)\nNH₄OH + HCl = NH₄Cl + H₂O",
    {
        font: "25px Comic Sans MS, Comic Sans MS5, cursive",
        fill: "	#F0FFFF",
        align: "center"
    });
    beaker.textBot = game.add.text (-175, -yText, "FeSO₄\n(Сульфат заліза)",
    {
    	font: "25px Comic Sans MS, Comic Sans MS5, cursive",
    	fill: "#F0FFFF",
    	align: "center"
    });
    //-413
    beaker.textFinished = game.add.text(-413, -yText, "FeSO₄ + 2NaOH = Na₂SO₄ + Fe(OH)₂",
    {
        font: "25px Comic Sans MS, Comic Sans MS5, cursive",
        fill: " #F0FFFF",
        align: "center"    
    }); 
    wow.textBot = game.add.text(-265, -yText, "H₂O₂ + C₁₇H₃₅COOK\n(Перекис водню + рідке мило)",
    {
        font: "25px Comic Sans MS, Comic Sans MS5, cursive",
        fill: "	#F0FFFF",
        align: "center"
    });
   
    wow.textFinished = game.add.text();

    tSteam = steam.textBot.text;
    tBeaker = beaker.textBot.text;
    tWow = wow.textBot.text;
    // define properties of text for rotated
    steam.textRot = game.add.text (-175, -yText2, "HCL\n(Соляна кислота)",
    {
        font: "25px Comic Sans MS, Comic Sans MS5, cursive",
        fill: "	#F0FFFF",
        align: "center"
    });
	beaker.textRot = game.add.text(-220, -yText2, "NaOH\n(Гідроксид натрію - луг)",
	{
        font: "25px Comic Sans MS, Comic Sans MS5, cursive",
        fill: "	#F0FFFF",
        align: "center"
    });
    wow.textRot = game.add.text(-205, -yText2, "CuSO₄ + 6NH₃ + 2H₂O\n(Аміакат міді)",
    {
        font: "25px Comic Sans MS, Comic Sans MS5, cursive",
        fill: "	#F0FFFF",
        align: "center"
    });

    // make text invisible
    steam.textBot.visible = false;
    steam.textFinished.visible = false;
    beaker.textBot.visible = false;
    beaker.textFinished.visible = false
    wow.textBot.visible = false;
    wow.textFinished.visible = false;

    // adding text to bottles
    steam.bottle.addChildAt (steam.textBot, 0);
    steam.bottle.addChildAt (steam.textFinished, 1);
    beaker.bottle.addChildAt (beaker.textBot, 0);
    beaker.bottle.addChildAt (beaker.textFinished, 1);
    wow.bottle.addChildAt (wow.textBot, 0);
    wow.bottle.addChildAt (wow.textFinished, 1);
    // adding text to rotated
    steam.rotated.addChildAt (steam.textRot, 0);
    beaker.rotated.addChildAt (beaker.textRot, 0);
    wow.rotated.addChildAt (wow.textRot, 0);

    // enable input for bottles
    steam.bottle.inputEnabled = true;
	beaker.bottle.inputEnabled = true;
	wow.bottle.inputEnabled = true;
	//input for button
	restartBtn.inputEnabled = true;
	// enable input for rotated
	steam.rotated.inputEnabled = true;
	beaker.rotated.inputEnabled = true;
	wow.rotated.inputEnabled = true;

	// enable drag for bottles
	steam.bottle.input.enableDrag();
	beaker.bottle.input.enableDrag();
	wow.bottle.input.enableDrag();
	// enable drag for rotated
	steam.rotated.input.enableDrag();
	beaker.rotated.input.enableDrag();
	wow.rotated.input.enableDrag();

	// testing input handler
	// setting bounds for sprites
	bounds = new Phaser.Rectangle (0, (this.game.height / 2) - beaker.bottle.height, this.game.width, this.game.height - 60);

	// activate bounds for bottles
	steam.bottle.input.boundsRect = bounds;
	beaker.bottle.input.boundsRect = bounds;
	wow.bottle.input.boundsRect = bounds;
	// activate bounds for rotated
	steam.rotated.input.boundsRect = bounds;
	beaker.rotated.input.boundsRect = bounds;
	wow.rotated.input.boundsRect = bounds;
	
	// collision settings
	// enable physics for bottles
	game.physics.enable (steam.bottle, Phaser.Physics.ARCADE);
	game.physics.enable (beaker.bottle, Phaser.Physics.ARCADE);
	game.physics.enable (wow.bottle, Phaser.Physics.ARCADE);
	// enable physics for rotated bottles
	game.physics.enable (steam.rotated, Phaser.Physics.ARCADE);
	game.physics.enable (beaker.rotated, Phaser.Physics.ARCADE);
	game.physics.enable (wow.rotated, Phaser.Physics.ARCADE);
	// set size of BODY
	steam.bottle.body.setSize (0, 0, 0, steam.bottle.height);
	beaker.bottle.body.setSize (0, 0, 0, beaker.bottle.height);
	wow.bottle.body.setSize (0, 0, 0, wow.bottle.height);


    steam.bottle.events.onInputDown.add (click, steam, 0);
    beaker.bottle.events.onInputDown.add (click, beaker, 0);
    wow.bottle.events.onInputDown.add (click, wow, 0);		// 29000
   //*/
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function update()
{
	game.physics.arcade.collide (beaker.rotated, beaker.bottle, collisionHandling, null, this);
	game.physics.arcade.collide (wow.rotated, wow.bottle, collisionHandling, null, this);
	game.physics.arcade.collide (steam.rotated, steam.bottle, collisionHandling, null, this);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function click ()
{
	if (this.textBot.visible)
	{
		this.textBot.visible = false;
	}
	if (!this.clickBot)
	{
		this.clickBot = true;
		game.time.events.add(300, function()
		{
			this.clickBot = false;
		}, this);
	return;
	}
	this.textBot.visible = true;
}//*/

function setAnchorTo (object, x, y)
{
	object.anchor.x = x;
	object.anchor.y = y;
}

function collisionHandling (object1, object2)
{
	// set new rotated bottle coordinates
	object1.y = object2.y - 100;
	object1.x = object2.x + 217;
	// make input disable
	object1.inputEnabled = false;
	object2.inputEnabled = false;
	// make text invisible
	object1.getChildAt(0).visible = false;
	var visTextObj2 = (object2.getChildAt(0).visible ? true : false);
	if (visTextObj2)
	{
		object2.getChildAt(0).visible = false;
	}

	// set properties of animation
	object1.animations.add ('rotation');
	object1.animations.play ('rotation', 50);
	game.time.events.add (500, function()
	{
		object2.animations.add ('sheet');
		object2.animations.play ('sheet', 50);
	}, this);
	// when playing of animations complete for ROTATED
	object1.events.onAnimationComplete.add (function()
	{
		// make input enable
		object1.inputEnabled = true;
		// make text visible
		object1.getChildAt(0).visible = true;
		// set new rotated bottle coordinates
		object1.y = object2.y - 20;
		object1.x = (object2.x + object1.width >= this.game.width ? object2.x - object1.width : object2.x + object1.width);	// we don't want the bottle appearing out of screen
    }, this);
    // when playing of animations complete for BOTTLE
    object2.events.onAnimationComplete.add (function()
    {
         object2.getChildAt(0).setText(object2.getChildAt(1).text);
         if(object2.key == 'sheet'){
         	object2.getChildAt(0).x = -293;
         }
    	// make input enable
    	object2.inputEnabled = true;
    }, this);
}

function handleIncorrect(){

   if(!game.device.desktop){
    document.getElementById("response").style.display ="block";
   }
}
    
    
function handleCorrect(){
   if(!game.device.desktop){
      if(!firstRunLandscape){
        game.width = window.innerWidth * window.devicePixelRatio;
        game.height = window.innerHeight * window.devicePixelRatio;
        game.renderer.resize(game.width,game.height);
      }
    document.getElementById("response").style.display ="none";
   }

}
function restart(){
    steam.bottle.frame =0;
    beaker.bottle.frame =0;
    wow.bottle.frame = 0;

    steam.rotated.frame =0;
    beaker.rotated.frame =0;
    wow.rotated.frame = 0;

    steam.bottle.getChildAt(0).setText(tSteam);
    beaker.bottle.getChildAt(0).setText(tBeaker);
    wow.bottle.getChildAt(0).setText(tWow);
}
