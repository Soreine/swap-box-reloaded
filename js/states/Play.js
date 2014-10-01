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
SB2.Play.platforms; /** This group contains all the solid and fixed platforms */
SB2.Play.cube1; /** References to the cubes objects */
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
};

SB2.Play.prototype.create = function () {
    var control1, control2; // The two sets of Controls
    
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

    // Preparing controls and cubes; btw, cube's position will be set by the biome
    [control1, control2] = this.initControls();
    this.cube1 = new SB2.Cube(this.game, 0, 0, control1);
    this.cube2 = new SB2.Cube(this.game, 0, 0, control2);

    // Initialize the cameraman, the background and the swap indicators
    this.cameraman = new SB2.Cameraman(this.game.camera, this.game.time);
    this.initSwap();
    this.initBackground();

    // Create the two very first biomes
    this.currentBiome = new SB2.BasicBiome(this.seed, 0);
    this.currentBiome.setCubesPositions(this.cube1, this.cube2);
    this.currentBiome.setCameraPosition(this.cameraman);
    this.currentBiome.setUpContent(this.game);

    this.nextBiome = new SB2.BasicBiome(this.seed, 1000);
    this.nextBiome.setUpContent(this.game);

    // Finally, set up the correct state
    this.state = this.RUNNING;
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
    this.cameraman.update(this.cube1, this.cube2, this.cities);
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

/** Called when the two players collide
 * @param {Object} c1 The first entity 
 * @param {Object} c2 The second entity */
SB2.Play.prototype.deathTouch = function (c1, c2) {
    // Animation for the death
    var deathTween1 = this.game.add.tween(this.cube1.sprite.scale);
    var deathTween2 = this.game.add.tween(this.cube2.sprite.scale);
    var to = {x:2*SB2.UNIT, y:2*SB2.UNIT};

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

/** Initialize game controls
*/
SB2.Play.prototype.initControls = function() {
    var kb, control1, control2; // Reference to Keyboard and controls

    kb = this.game.input.keyboard;
    control1 = new SB2.Controls(kb.addKey(Phaser.Keyboard.FIVE),
                null,
                kb.addKey(Phaser.Keyboard.Y),
                kb.addKey(Phaser.Keyboard.R));
    control2 = new SB2.Controls(kb.addKey(Phaser.Keyboard.UP),
                null,
                kb.addKey(Phaser.Keyboard.RIGHT),
                kb.addKey(Phaser.Keyboard.LEFT));

    return [control1, control2];
};

/** Initialize swap and swap indicators 
*/
SB2.Play.prototype.initSwap = function(width, height, unit, indic_thick) {
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