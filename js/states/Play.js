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
SB2.Play.prototype.preload = function () { };

SB2.Play.prototype.create = function () {    
    /* Set the current state of the game */
    this.SB2GameState = this.STARTING;
    this.game.time.advancedTiming = true;

    /* Initiate specific entities or utils, except cubes which 
    should be rendred later */
    this.eventManager = new SB2.EventManager();
    this.randomizer = new SB2.Randomizer(SB2.Randomizer.prototype.genSeedFromPhrase(SB2.seed || "Time To Refactor"));
    this.screenLimit = new SB2.ScreenLimit(this.game);
    this.controls = SB2.Controls.prototype.createControls(this.game.input.keyboard);
    this.muteButton = new SB2.MuteButton(this.game);

    /* Instanciate all the workers (components) 
    * The order matter, especially for rendering */
    this.workers.physicist  = new SB2.Physicist(this.game, this.eventManager);
    this.workers.decorator  = new SB2.Decorator(this.game, this.eventManager);
    this.workers.manager    = new SB2.Manager(this.eventManager);
    this.workers.musician   = new SB2.Musician(this.game);
    this.workers.swapper    = new SB2.Swapper(this.game, this.eventManager);
    this.workers.cameraman  = new SB2.Cameraman(this.eventManager);
    this.workers.animator   = new SB2.Animator(this.eventManager);

    /* Finally, instanciate and render cubes and platforms */
    this.cubes = SB2.Manager.prototype.createCubes(this.game, this.controls);
    this.workers.sequencer  = new SB2.Sequencer(this.game, this.eventManager,
        new SB2.Randomizer(this.randomizer.genSeed()), 
        this.cubes, this.screenLimit);

    /* Handle some events triggering */
    this.eventManager.on(SB2.EVENTS.CUBE_COLLISION, this.deathTouch, this);
};

SB2.Play.prototype.update = function () {
    switch(this.SB2GameState){
        case this.PAUSED: this.updatePaused(); break;
        case this.RUNNING: this.updateRunning(); break;
        case this.STARTING: this.updateStarting(); break;
        case this.DYING: this.updateDying(); break;
        case this.DEAD: this.updateDead(); break;
    };
};

SB2.Play.prototype.updatePaused = function(){};

SB2.Play.prototype.updateStarting = function () {
    /* Update all biomes & cubes behavior */
    this.workers.sequencer.updateBiomes(this.game, this.cubes, this.screenLimit);
    this.workers.manager.updateCubes(this.game, this.cubes);

    /* Handle the starting animation */
    this.handleStartAnimation();
};

SB2.Play.prototype.updateRunning = function () {
    /* Update all biomes */
    this.workers.sequencer.updateBiomes(this.game, this.cubes, this.screenLimit);
    this.workers.manager.updateCubes(this.game, this.cubes);

    /* Control swap */
    this.workers.swapper.handleSwap(this.cubes);
    
    /* Tell the cameraman to follow players position */
    this.workers.cameraman.update(this.game.camera, this.game.time);

    /* Update cubes states and check for collision */
    this.workers.manager.updateCubes(this.game, this.cubes);
    //this.workers.physicist.checkCubesCollision(this.cubes, this.game.physics.arcade, this.screenLimit);
};

SB2.Play.prototype.updateDying = function () {
    this.workers.manager.updateCubes(this.game, this.cubes);
};

SB2.Play.prototype.updateDead = function () { }

SB2.Play.prototype.render = function () {
    // this.game.debug.cameraInfo(this.game.camera, 25, 32);    
    // this.game.debug.bodyInfo(this.cube1, 500, 32);    
};

/** Behavior when the two players collide */
SB2.Play.prototype.deathTouch = function () {
    if(this.SB2GameState != SB2.Play.prototype.DYING){
        /* Update game state and hold music and swap */
        this.SB2GameState = SB2.Play.prototype.DYING;
        this.workers.manager.killCubes(this.cubes);
        //this.workers.musician.stopMusic();
        this.workers.swapper.stop();
    }
};

SB2.Play.prototype.handleStartAnimation = function() {
    if(!this.animationDisplayed){
        this.animationDisplayed = this.workers.animator.displayStartAnimation(this.game.add, function(){
            this.SB2GameState = this.RUNNING;
            this.workers.swapper.start();
            this.workers.manager.setCubesState(this.cubes, SB2.Cube.prototype.AIRBORNE);
        }, this);
    }
}