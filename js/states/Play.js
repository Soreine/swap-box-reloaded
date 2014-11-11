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
SB2.Play.prototype.DEAD     = 4;

//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Play.prototype.preload = function () {};
SB2.Play.prototype.create = function () {    
    this.game.SB2GameState = this.STARTING;

    /* Firstly the manager to handle cubes and controls. */
    this.workers.manager = new SB2.Manager(this.workers, this.game);

    /* Now instanciate the decorator and the cameraman */
    this.workers.decorator = new SB2.Decorator(this.workers, this.game);
    this.workers.cameraman = new SB2.Cameraman(this.workers, this.game);

    /* Finally, the last member of the team, the conductor. */
    this.workers.conductor = new SB2.Conductor(this.workers, this.game)
    
    /* Then, hire the supervisor that will first prepare the game world */
    this.workers.supervisor = new SB2.Supervisor(this.workers, this.game);
    this.workers.supervisor.initializeAll();
};

SB2.Play.prototype.update = function () {
    switch(this.game.SB2GameState){
        case this.PAUSED: this.updatePaused(); break;
        case this.RUNNING: this.updateRunning(); break;
        case this.STARTING: this.updateStarting(); break;
        case this.DYING: this.updateDying(); break;
        case this.DEAD: this.updateDead(); break;
    };
};

SB2.Play.prototype.updatePaused = function(){}
SB2.Play.prototype.updateStarting = function () {
    /* Update all biomes */
    this.workers.supervisor.updateBiomes();

    /* Display Starting Chrono and handle starting */
    this.workers.supervisor.updateStartingChrono();
    this.workers.decorator.handleStartingText();

    /* Update cubes behavior */
    this.workers.manager.updateCubes();
};

SB2.Play.prototype.updateRunning = function () {
    /* Update all biomes */
    this.workers.supervisor.updateBiomes();

    /* Control swap */
    this.workers.conductor.handleSwap();
    
    /* Tell the cameraman to follow players position */
    this.workers.cameraman.update();

    /* Update cubes states */
    this.workers.manager.updateCubes();
};

SB2.Play.prototype.updateDying = function () {
    this.workers.manager.updateCubes();
};

SB2.Play.prototype.updateDead = function () {
    this.workers.decorator.displayScore();
}

SB2.Play.prototype.render = function () {
    // this.game.debug.cameraInfo(this.game.camera, 25, 32);    
    // this.game.debug.bodyInfo(this.cube1, 500, 32);    
};