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
};

SB2.Play.prototype.create = function () {
    // Temporary variable to create ground objects
    var ground,
        // Temporary variable to create swap indicators
        indic,
        // Reference to the keyboard
        kb,
        // The two sets of Controls
        control1,
        control2,
        // Some constants
        HEIGHT = SB2.HEIGHT,
        WIDTH = SB2.WIDTH,
        INDIC_THICK = SB2.INDIC_THICK,
        UNIT = SB2.UNIT;
    
    this.state = this.RUNNING;

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Initilize the background
    this.initBackground();

    /** Adjust the size of the world */
    this.game.world.setBounds(0, 0, SB2.WIDTH*5, SB2.HEIGHT);

    //  Initialize the platforms group
    this.platforms = this.game.add.group(undefined, // No parent group
			       'platforms', // Name for debug
			       false, // Add directly to the stage
			       true, // Enable body
			       Phaser.Physics.ARCADE);

    // Here we create the ground.
    ground = this.platforms.create(0, HEIGHT - 2*UNIT, 'plain');
    //  Scale it to fit the width of the game
    ground.scale.setTo(WIDTH*10, 2*UNIT);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    ground = this.platforms.create(0, HEIGHT - 4*UNIT, 'plain');
    //  Scale it to fit the width of the game
    ground.scale.setTo(WIDTH/3, 2*UNIT);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    ground = this.platforms.create(WIDTH/2, HEIGHT - 7*UNIT, 'plain');
    //  Scale it to fit the width of the game
    ground.scale.setTo(WIDTH/2, 2*UNIT);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // Initialize controls
    kb = this.game.input.keyboard;
    control1 = new SB2.Controls(kb.addKey(Phaser.Keyboard.FIVE),
			    null,
			    kb.addKey(Phaser.Keyboard.Y),
			    kb.addKey(Phaser.Keyboard.R));
    control2 = new SB2.Controls(kb.addKey(Phaser.Keyboard.UP),
			    null,
			    kb.addKey(Phaser.Keyboard.RIGHT),
			    kb.addKey(Phaser.Keyboard.LEFT));


    // Initialize this player entity
    this.cube1 = new SB2.Cube(this.game, WIDTH/4, HEIGHT/2, control1);
    this.cube2 = new SB2.Cube(this.game, 3*WIDTH/4, HEIGHT/2, control2);

    /** Initialize the cameraman */
    // this.cameraman = new SB2.Cameraman(this.game.camera, this.game.time);

    // Initialize the swap indicators 
    this.swapIndicators = this.game.add.group(undefined, 'indicators', true, 
				    false); // No body
    this.swapIndicators.alpha = 0;

    // Create 4 bars assembling into a frame
    // TOP
    indic = this.swapIndicators.create(0, 0, 'plain');
    indic.scale.setTo(WIDTH, INDIC_THICK);
    // BOTTOM
    indic = this.swapIndicators.create(0, HEIGHT - INDIC_THICK, 'plain');
    indic.scale.setTo(WIDTH, INDIC_THICK);
    // LEFT
    indic = this.swapIndicators.create(WIDTH - INDIC_THICK, INDIC_THICK, 'plain');
    indic.scale.setTo(INDIC_THICK, HEIGHT - 2*INDIC_THICK);
    // RIGHT 
    indic = this.swapIndicators.create(0, INDIC_THICK, 'plain');
    indic.scale.setTo(INDIC_THICK, HEIGHT - 2*INDIC_THICK);

    //Init the indicator tweener
    this.swapTween = {primary: this.game.add.tween(this.swapIndicators),
		      secondary: this.game.add.tween(this.swapIndicators)};
    this.swapTween.primary.from({alpha:0}, SB2.INDIC_PERIOD/2);
    this.swapTween.secondary.from({alpha:0}, SB2.INDIC_PERIOD/4);

    // Init swap timer
    this.swap = {timer:this.game.time.now,
                 count:0};
};

SB2.Play.prototype.update = function () {
    // According to game state
    switch(this.state) {
    case this.PAUSED:
        this.updatePaused();
        break;   
    case this.RUNNING:
        this.updateRunning();
        break;
    }
}

/** Update function that pause the game */
SB2.Play.prototype.updatePaused = function () {
    // Cubes shouldn't move
    this.cube1.body.velocity = {x: 0, y:0};
    this.cube2.body.velocity = {x: 0, y:0};
}

SB2.Play.prototype.updateRunning = function () {

    // Control swap
    this.handleSwap();

    //  Collide the cubes with the platforms
    this.game.physics.arcade.collide(this.cube1.sprite, this.platforms);
    this.game.physics.arcade.collide(this.cube2.sprite, this.platforms);

    //  Checks to see if the both cubes overlap
    this.game.physics.arcade.overlap(this.cube1.sprite, this.cube2.sprite, 
				this.deathTouch,
				null, this);	

    // Update cubes states
    this.cube1.update();
    this.cube2.update();

    // Tell the cameraman to follow players positions
    // this.cameraman.update(this.cube1, this.cube2, this.cities);
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


/** Called when the two players collide
 * @param {Object} c1 The first entity 
 * @param {Object} c2 The second entity */
SB2.Play.prototype.deathTouch = function (c1, c2) {
    // Animation for the death
    var deathTween1 = this.game.add.tween(this.cube1.sprite.scale);
    var deathTween2 = this.game.add.tween(this.cube2.sprite.scale);
    var to = {x:2*SB2.UNIT,
              y:2*SB2.UNIT};

    deathTween1.to(to, 2000);
    deathTween2.to(to, 2000);

    // Pause the game
    this.state = this.PAUSED;

    // On complete, reset the game
    deathTween1.onComplete.add(function () {
        deathTween2.stop();
        this.game.state.start('Play');
    }, this);
    
    deathTween1.start();
    deathTween2.start();
};





