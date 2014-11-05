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
    this.workers.supervisor = new SB2.Supervisor(this.workers, this.game);

    /* Now instanciate the decorator and the cameraman */
    this.workers.decorator = new SB2.Decorator(this.worker, this.game);
    this.workers.cameraman = new SB2.Cameraman(this.worker, this.game);

    /* Prepare the manager to handle cubes and controls. */
    this.workers.manager = new SB2.Manager(this.worker, this.game);

    /* Finally, the last member of the team, the conductor. */
    this.workers.conductor = new SB2.Conductor(this.worker, this.game)

    // Finally, set up the correct state
    this.state = this.STARTING;
    this.startChrono = this.game.time.now;
    this.startTween = false;

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