/* global SB2 */
/* global Phaser */
"use strict";

/** Game state for the game's core */
SB2.Play = function (game) {
    // Call State constructor on this instance
    Phaser.State.call(this, game);

    // Add this state to game engine, without starting it
    game.state.add("Play", this, false);
};

// Extends Phaser.State
SB2.Play.prototype = Object.create(Phaser.State.prototype);
SB2.Play.prototype.constructor = SB2.Play;

//------------------------------------------------------------------------------
// Members
//------------------------------------------------------------------------------

/** Controls of player 1 and 2 */
SB2.Play.controls1;
SB2.Play.controls2;

/** This group contains all the solid and fixed platforms */
SB2.Play.platforms;

/** References to the cubes objects */
SB2.Play.cube1;
SB2.Play.cube2;

/** Timer for controls swap */
SB2.Play.swap;

/** The group of HUD indicators for swap */
SB2.Play.swapIndicators;

/** Tween used to make the indicators flash */
SB2.Play.swapTween;

//------------------------------------------------------------------------------
// Game state
//------------------------------------------------------------------------------
SB2.Play.prototype.PAUSED = 0;
SB2.Play.prototype.RUNNING = 1;

//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Play.prototype.preload = function () {
    // This is a plain color texture
    this.game.load.image('plain', SB2.ASSETS + '1.png');
    this.game.load.image('city1', SB2.ASSETS + 'city1.png');
    this.game.load.image('city2', SB2.ASSETS + 'city2.png');
    this.game.load.spritesheet('death', SB2.ASSETS + 'death.png', 10, 10, 9);
};

SB2.Play.prototype.create = function () {
    this.state = this.RUNNING;
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // Initilize the background
    this.initBackground();
    /* Adjust the size of the world */
    this.game.world.setBounds(0, 0, SB2.WIDTH*5, SB2.HEIGHT);
    //  Initialize the platforms group
    this.initLevel();
    // Initialize controls
    this.initControls();
    // Initialize the players entities
    this.cube1 = new SB2.Cube(this.game, 450, SB2.HEIGHT/2, this.controls1);
    this.cube2 = new SB2.Cube(this.game, 550, SB2.HEIGHT/2, this.controls2);
    // Add them to the world
    this.game.add.existing(this.cube1);
    this.game.add.existing(this.cube2);

    /* Initialize the cameraman */
    this.cameraman = new SB2.Cameraman(this.game.camera, this.game.time);
    // Initialize the swap indicators 
    this.initSwap();
};

SB2.Play.prototype.update = function () {
    // According to game state
    switch(this.state) {
    case this.DYING:
        this.updateDying();
        break;   
    case this.RUNNING:
        this.updateRunning();
        break;
    }
};

/** Update function that pause the game */
SB2.Play.prototype.updateDying = function () {
    if(this.cube1.state == SB2.Cube.prototype.DEAD && 
       this.cube2.state == SB2.Cube.prototype.DEAD) {
        this.game.state.start('Play');
    } else {
        this.cube1.myUpdate();
        this.cube2.myUpdate();
    }
};

SB2.Play.prototype.updateRunning = function () {
    //  Collide the cubes with the platforms
    this.game.physics.arcade.collide(this.cube1, this.platforms);
    this.game.physics.arcade.collide(this.cube2, this.platforms);

    // Control swap
    this.handleSwap();

    // Update cubes states
    this.cube1.myUpdate();
    this.cube2.myUpdate();
    
    // Tell the cameraman to follow players positions
    this.cameraman.update(this.cube1, this.cube2, this.cities);

    //  Checks to see if the both cubes overlap
    if(this.game.physics.arcade.overlap(this.cube1, this.cube2)) {
        this.deathTouch();
    }
};

SB2.Play.prototype.render = function() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
};

//------------------------------------------------------------------------------
// Other functions
//------------------------------------------------------------------------------

/** Measure time and swap controls if needed. Also in charge to
 * display timing indicators */
SB2.Play.prototype.handleSwap = function () {
    // For controls swapping
    var controls;

    // Check the timer 
    if(this.game.time.elapsedSince(this.swap.timer) >
       this.swap.count*SB2.INDIC_PERIOD) {
	    // If it's the last indicator
	    if(this.swap.count == SB2.NUM_INDIC) {
	        // Swap controls
	        controls = this.cube1.controls;
	        this.cube1.controls = this.cube2.controls;
	        this.cube2.controls = controls;
	        // Reset timer
	        this.swap = {timer: this.game.time.now,
		                 count: 1};
	        // Make a primary flash
	        this.swapIndicators.alpha = 1.0;
	        this.swapTween.primary.start();
	    } else {
            if(SB2.SECONDARY_INDICATOR) {
	            // Make a secondary flash
	            this.swapIndicators.alpha = 0.1;
	            this.swapTween.secondary.start();
            }
	        // Increment count
	        this.swap.count++;
	    }
    }
};

/** Called when the two players collide */
SB2.Play.prototype.deathTouch = function () {
    this.cube1.die();
    this.cube2.die();
    // Update game state
    this.state = this.DYING;
};


//------------------------------------------------------------------------------
// Initializations
//------------------------------------------------------------------------------

/** Initialize the backgrounds of the game area
*/
SB2.Play.prototype.initBackground = function() {
    var city, cityNames, i; // Used for temporary setting

    // Set the background color
    this.game.stage.backgroundColor = SB2.BACKGROUND_COLOR;

    // Add two cities in the background giving a parallax effect
    this.cities = [];
    cityNames = ['city1', 'city2'];
    for ( i = 0; i < cityNames.length; i++) {
        city = this.game.add.tileSprite(0, 0, 800, 600, cityNames[i]);
        city.fixedToCamera = true;
        this.cities.push(city);
    }

};

/** This function initialize the level. (Generate the first platforms) */
SB2.Play.prototype.initLevel = function () {
    // For platform creation
    var ground;

    this.platforms = this.game.add.group(undefined, // Parent group
			                 'platforms', // Name for debug
			                 false, // Add directly to the stage
			                 true, // Enable body
			                 Phaser.Physics.ARCADE);

    // Here we create the ground.
    ground = this.platforms.create(0, SB2.HEIGHT - 2*SB2.UNIT, 'plain');
    //  Scale it to fit the width of the game
    ground.scale.setTo(SB2.WIDTH*10, 2*SB2.UNIT);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    ground = this.platforms.create(0, SB2.HEIGHT - 4*SB2.UNIT, 'plain');
    //  Scale it to fit the width of the game
    ground.scale.setTo(SB2.WIDTH/3, 2*SB2.UNIT);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    ground = this.platforms.create(SB2.WIDTH/2, SB2.HEIGHT - 7*SB2.UNIT, 'plain');
    //  Scale it to fit the width of the game
    ground.scale.setTo(SB2.WIDTH/2, 2*SB2.UNIT);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
};

/** Initialize the swap indicators and begin the swap timer. */
SB2.Play.prototype.initSwap = function () {
    // For creating indicators
    var indic;

    this.swapIndicators = this.game.add.group(undefined, 'indicators', true, 
				    false); // No body
    this.swapIndicators.alpha = 0;

    // Create 4 bars assembling into a frame
    // TOP
    indic = this.swapIndicators.create(0, 0, 'plain');
    indic.scale.setTo(SB2.WIDTH, SB2.INDIC_THICK);
    // BOTTOM
    indic = this.swapIndicators.create(0, SB2.HEIGHT - SB2.INDIC_THICK, 'plain');
    indic.scale.setTo(SB2.WIDTH, SB2.INDIC_THICK);
    // LEFT
    indic = this.swapIndicators.create(SB2.WIDTH - SB2.INDIC_THICK, SB2.INDIC_THICK, 'plain');
    indic.scale.setTo(SB2.INDIC_THICK, SB2.HEIGHT - 2*SB2.INDIC_THICK);
    // RIGHT 
    indic = this.swapIndicators.create(0, SB2.INDIC_THICK, 'plain');
    indic.scale.setTo(SB2.INDIC_THICK, SB2.HEIGHT - 2*SB2.INDIC_THICK);

    // Init the indicator tweener
    this.swapTween = {primary: this.game.add.tween(this.swapIndicators),
		      secondary: this.game.add.tween(this.swapIndicators)};
    this.swapTween.primary.from({alpha:0}, SB2.INDIC_PERIOD/2);
    this.swapTween.secondary.from({alpha:0}, SB2.INDIC_PERIOD/4);

    // Init swap timer
    this.swap = {timer:this.game.time.now,
                 count:0};
};

/** Initialize the controls for player 1 and 2 */
SB2.Play.prototype.initControls = function () {
    var kb = this.game.input.keyboard;
    this.controls1 = new SB2.Controls(kb.addKey(Phaser.Keyboard.UP),
			               null,
			               kb.addKey(Phaser.Keyboard.RIGHT),
			               kb.addKey(Phaser.Keyboard.LEFT));
    this.controls2 = new SB2.Controls(kb.addKey(Phaser.Keyboard.FIVE),
			               null,
			               kb.addKey(Phaser.Keyboard.Y),
			               kb.addKey(Phaser.Keyboard.R));
};





