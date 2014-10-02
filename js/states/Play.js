/* global SB2 */
/* global Phaser */
"use strict";

/** Game state for the game's core */
SB2.Play = function (game) {
    // Call State constructor on this instance and add this state to game engine, without starting it
    Phaser.State.call(this, game);
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
SB2.Play.swap; /** Timer for controls swap */
SB2.Play.swapIndicators; /** The group of HUD indicators for swap */
SB2.Play.swapTween; /** Tween used to make the indicators flash */

//------------------------------------------------------------------------------
// Game state
//------------------------------------------------------------------------------
SB2.Play.prototype.PAUSED = 0;
SB2.Play.prototype.RUNNING = 1;

//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Play.prototype.preload = function () {
    this.game.load.image('plain', SB2.ASSETS + '1.png'); // This is a plain color texture
    this.game.load.image('city1', SB2.ASSETS + 'city1.png');
    this.game.load.image('city2', SB2.ASSETS + 'city2.png');
    this.game.load.spritesheet('death', SB2.ASSETS + 'death.png', 10, 10, 9);
};

SB2.Play.prototype.create = function () {    
    /* We will define below, everything that should be started and instanciated
    * in order to make the addition of biome's contexts possible */

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    /* Adjust the size of the world. This will implicitly impacts the maximum 
    size of each biome */
    this.game.world.setBounds(0, 0, SB2.WIDTH*10, SB2.HEIGHT);

    /* Preparing the biome generation by creating a level's seed and
        instanciating a pseudo-random generator using a specific string
        that could be for example, the name of the level.
    */
    this.seed = SB2.Biome.prototype.genSeed("Greta Svabo Bech");
    this.randomizer = new SB2.Randomizer(this.seed);

    // Initialize the cameraman, the background and the swap indicators
    //this.cameraman = new SB2.Cameraman(this.game.camera, this.game.time);
    this.initSwap();
    this.initBackground();

    // Preparing controls and cubes; btw, cube's position will be set by the biome
    this.initControls();
    this.cube1 = new SB2.Cube(this.game, 200, 0, this.controls1);
    this.cube2 = new SB2.Cube(this.game, 0, 0, this.controls2);

    // Add them to the world
    this.game.add.existing(this.cube1);
    this.game.add.existing(this.cube2);

    // Create the two very first biomes
    this.currentBiome = new SB2.BasicBiome(this.seed, 0);
    this.currentBiome.setCubesPositions(this.cube1, this.cube2);
    //this.currentBiome.setCameraPosition(this.cameraman);
    this.currentBiome.setUpContent(this.game);

    this.nextBiome = new SB2.BasicBiome(this.seed, 1000);
    this.nextBiome.setUpContent(this.game);

    // Finally, set up the correct state
    this.state = this.RUNNING;
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
};

SB2.Play.prototype.updateRunning = function () {
    //  Collide the cubes with the platforms
    this.currentBiome.update(this.cube1, this.cube2, this.game);

    // Control swap
    this.handleSwap();

    // Update cubes states
    this.cube1.myUpdate();
    this.cube2.myUpdate();
    
    // Tell the cameraman to follow players positions
    // this.cameraman.update(this.cube1, this.cube2, this.cities);

    //  Checks to see if the both cubes overlap
    if(this.game.physics.arcade.overlap(this.cube1, this.cube2)) {
        this.deathTouch();
    }
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
    var c, // A cube
        death; // A death sprite
    var cubes = [this.cube1, this.cube2];
    for(var i = 0; i < cubes.length; i++) {
        c = cubes[i];
        // Pause the cube
        c.body.velocity = {x:0, y:0};
        c.velocity = {x:0, y:0};
        c.body.allowGravity = false;
        // Create death animation
        death = this.game.add.sprite(c.x, c.y, 'death');
        death.anchor = {x:0.5, y:0.5};
        death.scale.setTo(3, 3);
        death.rotation = c.rotation;
        death.animations.add('die');
        death.animations.play('die', 10, false);
    }
    // Update game state
    this.state = this.DYING;
};

//------------------------------------------------------------------------------
// Initialization functions
//------------------------------------------------------------------------------

/** Initialize the backgrounds of the game area */
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

/** Initialize swap and swap indicators 
*/
SB2.Play.prototype.initSwap = function() {
    var indic,  // Temporary variable to create swap indicators
    // constants shorthands
    H = SB2.HEIGHT, W = SB2.WIDTH,
    ITH = SB2.INDIC_THICK, U = SB2.UNIT,
    P = SB2.INDIC_PERIOD;

    this.swapIndicators = this.game.add.group(undefined, 'indicators', true,  false); // No body
    this.swapIndicators.alpha = 0;

    // Create 4 bars assembling into a frame
    // TOP
    indic = this.swapIndicators.create(0, 0, 'plain');
    indic.scale.setTo(W, ITH);
    // BOTTOM
    indic = this.swapIndicators.create(0, H - ITH, 'plain');
    indic.scale.setTo(W, ITH);
    // LEFT
    indic = this.swapIndicators.create(W - ITH, ITH, 'plain');
    indic.scale.setTo(ITH, H - 2*ITH);
    // RIGHT 
    indic = this.swapIndicators.create(0, ITH, 'plain');
    indic.scale.setTo(ITH, H - 2*ITH);

    //Init the indicator tweener
    this.swapTween = {
            primary: this.game.add.tween(this.swapIndicators),
            secondary: this.game.add.tween(this.swapIndicators)
    };
    this.swapTween.primary.from({alpha:0}, P/2);
    this.swapTween.secondary.from({alpha:0}, P/4);

    // Init swap timer
    this.swap = {timer: this.game.time.now, count: 0};    
};