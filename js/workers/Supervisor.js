/* global SB2 */
/* global Phaser */
"use strict";

// REFACTOR : this class should not exist anymore and be split across
// Play.js for some high level treatemetand other specific components
/** The supervisor's role is to handle his team and the running of the game.
    He also keep an eye on the screen limit when he has to. 
    @param {Object} workers The powerful team that does a great job
    @param {Phaser.Game} game The instance of the current game
 */
SB2.Supervisor = function (workers, game) {
    SB2.Worker.call(this, workers, game);
};

/* Inheritance from Worker */
SB2.Supervisor.prototype = Object.create(SB2.Worker.prototype);
SB2.Supervisor.prototype.constructor = SB2.Supervisor;

SB2.Supervisor.prototype.STARTING_DELAY = 800;

// REFACTOR : all physics to the Physicist
/** We're going to be using physics, so enable the Arcade Physics system
    And adjust the size of the world. This will implicitly impacts the maximum 
    size of each biome */
SB2.Supervisor.prototype.initGameWorld = function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, SB2.WIDTH*10, SB2.HEIGHT);   
};

// REFACTOR : this initialization should be done from the Randomize class
/** Preparing the biome generation by creating a level's seed and
    instanciating a pseudo-random generator using a specific string
    that could be for example, the name of the level. */
SB2.Supervisor.prototype.initRandomizer = function(){
    this.phrase = SB2.seed || "tryrtyfh";
    this.seed = SB2.Randomizer.prototype.genSeedFromPhrase(this.phrase);
    // REFACTOR : here we should pass SB2.seed to Randomizer who will do all of the above
    this.randomizer = new SB2.Randomizer(this.seed); 
};

// REFACTOR : Physicist?
/** Initialize the screen limit used to check when cube exit the screen */
SB2.Supervisor.prototype.initScreenLimit = function (){
    // An invisible rectangle that cover almost the entire screen,
    this.screenLimit = this.game.add.sprite(SB2.UNIT, SB2.UNIT, null, 0);
    this.game.physics.arcade.enable(this.screenLimit);
    this.screenLimit.body.setSize(SB2.WIDTH - 2*SB2.UNIT, SB2.HEIGHT - 2*SB2.UNIT);
    this.screenLimit.fixedToCamera = true;
};

/** Start the biome Sequencer */
SB2.Supervisor.prototype.initSequencer = function(){
    this.sequencer = new SB2.BiomesSequencer(
        new SB2.Randomizer(this.randomizer.genSeed()), 
        this.workers.manager.cubes[0], 
        this.workers.manager.cubes[1], 
        this.screenLimit, this.game
    );
};

// REFACTOR : this should not be
/** Initialize The Game And All Workers Jobs */
SB2.Supervisor.prototype.initializeAll = function(){
    this.initializes("GameWorld", "Randomizer", "ScreenLimit");
    this.workers.decorator.initializes("Cities");
    this.workers.manager.initializes("Controls", "Cubes");
    this.initializes("Sequencer");
};

/** Update all biomes */
SB2.Supervisor.prototype.updateBiomes = function(){
    this.sequencer.updateBiomes();
};

SB2.Supervisor.prototype.updateStartingChrono = function(){
    if(!this.chrono){
        this.chrono = new SB2.Timer(this.game);
        this.chrono.start();
    }else if(this.chrono.elapsed() > SB2.Supervisor.prototype.STARTING_DELAY) {
        this.workers.manager.setCubesState([0,1], SB2.Cube.prototype.STANDING);
        this.workers.cameraman.reset();
        this.workers.swapper.start();
        this.workers.musician.startMusic();
        this.game.SB2GameState = SB2.Play.prototype.RUNNING;
    }
};

/** Called when the game is restarting */
SB2.Supervisor.prototype.scoreDisplayed = function(){
    this.workers.decorator.reset();
    this.workers.manager.reset();
    this.reset();
    this.game.SB2GameState = SB2.Play.prototype.STARTING;
};

SB2.Supervisor.prototype.reset = function(){
    this.chrono = undefined;
    this.sequencer.reset();
    this.initializes("Randomizer", "Sequencer");
};

SB2.Supervisor.prototype.getTraveledDistance = function(){
    return this.game.camera.x + this.sequencer.totalOffset;
};
