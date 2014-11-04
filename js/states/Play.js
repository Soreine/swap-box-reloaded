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
/** References to the cubes objects */
SB2.Play.cube1;
SB2.Play.cube2;
/** This group contains all the solid and fixed platforms */
SB2.Play.platforms;
SB2.Play.screenLimit; /** Used to check when cubes hit the screen borders */
SB2.Play.swap; /** Timer for controls swap */
SB2.Play.swapIndicators; /** The group of HUD indicators for swap */
SB2.Play.swapTween; /** Tween used to make the indicators flash */

/** This object will handle the different workers that strive around the game */
SB2.Play.workers = {
    cameraman: undefined,
    conductor: undefined,
    decorator: undefined,
    manager: undefined,
    supervisor: undefined
};


//------------------------------------------------------------------------------
// Game state
//------------------------------------------------------------------------------
SB2.Play.prototype.PAUSED = 0;
SB2.Play.prototype.RUNNING = 1;
SB2.Play.prototype.STARTING = 2;


//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Play.prototype.preload = function () {};

SB2.Play.prototype.create = function () {    
    /* Firstly, hire the supervisor that will first prepare the game world */
    this.workers.supervisor = new SB2.Supervisor(this.game);

    /* Now instanciate the decorator and the cameraman */
    this.workers.decorator = new SB2.Decorator(this.game);
    this.workers.cameraman = new SB2.Cameraman(this.game.camera, this.game.time);

    /* Prepare the manager to handle cubes and controls. */
    this.workers.manager = new SB2.Manager(this.game);

    // Stop cubes initially
    this.cube1.state = SB2.Cube.prototype.DEAD;
    this.cube2.state = SB2.Cube.prototype.DEAD;

    // Start the biome Sequencer
    this.sequencer = new SB2.BiomesSequencer(
        new SB2.Randomizer(this.randomizer.genSeed()), 
        this.cube1, this.cube2, 
        this.screenLimit, this.game);

    // Finally, set up the correct state
    this.state = this.STARTING;
    this.startChrono = this.game.time.now;
    this.startTween = false;

    // Init music and timer
    this.initMusic();
    this.initSwap();

    //Temporaire parce pas l'time
    this.revived = false;
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
    case this.STARTING:
        this.updateStarting();
        break;
    }
};

/** Update function that pause the game */
SB2.Play.prototype.updateDying = function () {
    if(this.cube1.state == SB2.Cube.prototype.DEAD ||
       this.cube2.state == SB2.Cube.prototype.DEAD) {

       this.cube1.myRevive();
       this.cube2.myRevive();
       this.sequencer.currentBiome().setPositions(this.cube1, this.cube2, this.game.camera, this.screenLimit);
       this.game.time.reset();
       this.state = this.STARTING;
       this.tweenStart = false;
       this.startChrono = this.game.time.now;

       //Temporaire parce pas l'time
       this.revived = true;

        //this.game.state.start('Play');
    } else {
        this.cube1.myUpdate();
        this.cube2.myUpdate();
    }
};

SB2.Play.prototype.updateStarting = function () {
    //Update all biomes
    this.sequencer.updateBiomes();

    if(!this.tweenStart){
        this.startText = this.game.add.text(400, 200, "Ready ?",
                                            {font: "bold 70px Helvetica",
                                             fill: "#333333",
                                             align: "center" });
        this.startText.anchor.set(0.5);
        this.tweenStart = true;
    }else if(this.game.time.elapsedSince(this.startChrono) > 1250 && this.tweenStart) {
        this.startText.text = "Go !";
        this.game.add.tween(this.startText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);

        this.game.onPause.add(this.onPaused, this);
        this.game.onResume.add(this.onResumed, this);
        this.cube1.state = SB2.Cube.prototype.STANDING;
        this.cube2.state = SB2.Cube.prototype.STANDING;
        this.state = this.RUNNING;

        // Add events when paused
        this.startSwap();

        this.cameraman.start();
    }

    // Update cubes states
    this.cube1.myUpdate();
    this.cube2.myUpdate();
};

SB2.Play.prototype.updateRunning = function () {
    var i, endOfLastBiome;

    // Control swap
    this.handleSwap();
    
    //Update all biomes
    this.sequencer.updateBiomes();
    
    // Tell the cameraman to follow players positions
    this.cameraman.update(this.cube1, this.cube2, this.cities);

    // Update cubes states
    this.cube1.myUpdate();
    this.cube2.myUpdate();
    
    //  Checks to see if the both cubes overlap
    if(this.game.physics.arcade.overlap(this.cube1, this.cube2)
       || !this.game.physics.arcade.overlap(this.cube1, this.screenLimit)
       || !this.game.physics.arcade.overlap(this.cube2, this.screenLimit)) {
          this.deathTouch();
      }
};

SB2.Play.prototype.render = function () {
    // this.game.debug.cameraInfo(this.game.camera, 25, 32);    
    // this.game.debug.bodyInfo(this.cube1, 500, 32);    
};

//------------------------------------------------------------------------------
// Other functions
//------------------------------------------------------------------------------
/** Measure time and swap controls if needed. Also in charge of
 * displaying timing indicators */
SB2.Play.prototype.handleSwap = function () {
    // Check the timer 
    if(this.swap.timer.elapsed() > SB2.INDIC_PERIOD*this.swap.count) {
        // If it's the last indicator
        if(this.swap.count%SB2.NUM_INDIC == 2) {
            // Make a swap
            SB2.Cube.swap(this.cube1, this.cube2);
            // Make a primary flash
            this.swapIndicators.alpha = 1.0;
            this.swapTween.primary.start();
        } else {
            if(SB2.SECONDARY_INDICATOR) {
                // Make a secondary flash
                this.swapIndicators.alpha = 0.1;
                this.swapTween.secondary.start();
            }
        }

        // update the swap
        this.swap.count++;
    }
};

/** Called when the two players collide */
SB2.Play.prototype.deathTouch = function () {
    this.cube1.die();
    this.cube2.die();
    // Update game state
    this.state = this.DYING;
    this.music.stop();
    this.swap.timer.pause();
    this.swap.timer.reset();
    this.swap.count = 0;
};


SB2.Play.prototype.onPaused = function () {
    this.swap.timer.pause();
    this.music.pause();
};

SB2.Play.prototype.onResumed = function () {
    this.swap.timer.resume();
    this.music.resume();
};

//------------------------------------------------------------------------------
// Initialization functions
//------------------------------------------------------------------------------

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

    // Init the indicator tweener
    this.swapTween = {primary: this.game.add.tween(this.swapIndicators),
                      secondary: this.game.add.tween(this.swapIndicators)};
    this.swapTween.primary.from({alpha:0}, P/2);
    this.swapTween.secondary.from({alpha:0}, P/4);

    // Init swap timer
    this.swap = {timer: new SB2.Timer(this.game),
                 count:0};
};

/** Effectively start the timer (and music) */
SB2.Play.prototype.startSwap = function () {
    // Start timer and music
    this.swap.timer.start();
    this.music.play("", 0, 1, true);
    this.music.loop = true;
};

SB2.Play.prototype.initMusic = function () {
    function muteFunction () {
        if(this.game.sound.mute) {
            // Demute
            // Update button icon
            this.muteButton.frame = 0;
            this.game.sound.mute = false;
            SB2.muted = false;
        } else {
            // Mute
            this.muteButton.frame = 1;        
            this.game.sound.mute = true;
            SB2.muted = true;
        }
    }

    // Init music
    this.music = this.game.add.audio('music');

    // Init mute button
    this.muteButton = this.game.add.button(0, 0, 'mute', muteFunction, this);
    this.muteButton.frame = SB2.muted ? 1 : 0;
    this.muteButton.alpha = 0.5;
    this.muteButton.fixedToCamera = true;
};
