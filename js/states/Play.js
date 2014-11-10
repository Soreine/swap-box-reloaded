/* global SB2 */
/* global Phaser */
"use strict";

/** Game state for the game's core */
SB2.Play = function (game) {
    /* Call State constructor on this instance and add this state to game engine, without starting it */
    Phaser.State.call(this, game);
    game.state.add("Play", this, false);

    /* This object will handle the different workers that strive around the game */
    this.workers = {};

};
/* Extends Phaser.State */
SB2.Play.prototype = Object.create(Phaser.State.prototype);
SB2.Play.prototype.constructor = SB2.Play;

//------------------------------------------------------------------------------
// Game state
//------------------------------------------------------------------------------
SB2.Play.prototype.PAUSED   = 0;
SB2.Play.prototype.RUNNING  = 1;
SB2.Play.prototype.STARTING = 2;
SB2.Play.prototype.DYING    = 3;

//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Play.prototype.preload = function () {};
SB2.Play.prototype.create = function () {    
    /* Firstly the manager to handle cubes and controls. */
    this.workers.manager = new SB2.Manager(this.workers, this.game);

    /* Now instanciate the decorator and the cameraman */
    this.workers.decorator = new SB2.Decorator(this.workers, this.game);
    this.workers.cameraman = new SB2.Cameraman(this.workers, this.game);

    /* Finally, the last member of the team, the conductor. */
    this.workers.conductor = new SB2.Conductor(this.workers, this.game)
    
    /* Then, hire the supervisor that will first prepare the game world */
    this.workers.supervisor = new SB2.Supervisor(this.workers, this.game);

    /* Finally, set up the correct state */
    this.state = this.STARTING;
};

SB2.Play.prototype.update = function () {
    switch(this.state){
        case this.PAUSED: this.updatePaused(); break;
        case this.RUNNING: this.updateRunning(); break;
        case this.STARTING: this.updateStarting(); break;
        case this.DYING: this.updateDying(); break;
    };
};

SB2.Play.prototype.updatePaused = function(){}
SB2.Play.prototype.updateStarting = function () {
    /* Update all biomes */
    this.workers.supervisor.updateBiomes();

    /* Display Starting Chrono and handle starting */
    this.state = this.workers.supervisor.updateStartingChrono();
    this.workers.decorator.handleStartingText(this.state);

    /* Update cubes behavior */
    this.workers.manager.updateCubes();
};
SB2.Play.prototype.updateRunning = function () {
    // /* Update all biomes */
    // this.workers.supervisor.updateBiomes();

    // /* Control swap */
    // this.workers.conductor.handleSwap();
    
    // /* Tell the cameraman to follow players position */
    // this.workers.cameraman.update();

    // /* Update cubes states */
    // this.workers.manager.updateCubes();
};
SB2.Play.prototype.updateDying = function () {
    // if(this.cube1.state == SB2.Cube.prototype.DEAD ||
    //    this.cube2.state == SB2.Cube.prototype.DEAD) {

    //    this.cube1.myRevive();
    //    this.cube2.myRevive();
    //    this.sequencer.currentBiome().setPositions(this.cube1, this.cube2, this.game.camera, this.screenLimit);
    //    this.game.time.reset();
    //    this.state = this.STARTING;
    //    this.tweenStart = false;
    //    this.startChrono = this.game.time.now;

    //    //Temporaire parce pas l'time
    //    this.revived = true;

    //     //this.game.state.start('Play');
    // } else {
    //     this.cube1.myUpdate();
    //     this.cube2.myUpdate();
    // }
};

SB2.Play.prototype.render = function () {
    // this.game.debug.cameraInfo(this.game.camera, 25, 32);    
    // this.game.debug.bodyInfo(this.cube1, 500, 32);    
};

