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
    this.eventManager = new SB2.EventManager();
    /* Instanciate all the workers (components) */
    this.workers.manager = new SB2.Manager(this.workers, this.game, this.eventManager);
    this.workers.decorator = new SB2.Decorator(this.workers, this.game);
    this.workers.cameraman = new SB2.Cameraman(this.game);
    this.workers.musician = new SB2.Musician(this.game);
    this.workers.swapper = new SB2.Swapper(this.game, this.eventManager);
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

SB2.Play.prototype.updatePaused = function(){};

SB2.Play.prototype.updateStarting = function () {
    /* Update all biomes */
    this.workers.supervisor.updateBiomes();

    /* Display Starting Chrono and handle starting */
    this.workers.supervisor.updateStartingChrono();
    this.workers.decorator.handleStartingText();

    /* Update cubes behavior */
    this.workers.manager.updateCubes(this);
};

SB2.Play.prototype.updateRunning = function () {
    /* Update all biomes */
    this.workers.supervisor.updateBiomes();

    /* Control swap */
    this.workers.swapper.handleSwap(this.workers.manager);
    
    /* Tell the cameraman to follow players position */
    this.workers.cameraman.update();

    /* Update cubes states */
    this.workers.manager.updateCubes(this);
};

SB2.Play.prototype.updateDying = function () {
    this.workers.manager.updateCubes(this);
};

SB2.Play.prototype.updateDead = function () {
    this.workers.decorator.displayScore();
}

SB2.Play.prototype.render = function () {
    // this.game.debug.cameraInfo(this.game.camera, 25, 32);    
    // this.game.debug.bodyInfo(this.cube1, 500, 32);    
};

/** Behavior when the two players collide */
SB2.Play.prototype.deathTouch = function () {
    if(this.game.SB2GameState != SB2.Play.prototype.DYING){
        /* Update game state and hold music and swap */
        this.game.SB2GameState = SB2.Play.prototype.DYING;
        this.workers.manager.cubes[0].die();
        this.workers.manager.cubes[1].die();
        this.workers.musician.stopMusic();
        this.workers.swapper.stop();
    }
};
