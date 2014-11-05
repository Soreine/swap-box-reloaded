/* global SB2 */
/* global Phaser */
"use strict";

/** The supervisor's role is to handle his team and the running of the game.
    He also keep an eye on the screen limit when he has to. 
    @param {Object} workers The powerful team that does a great job
    @param {Phaser.Game} game The instance of the current game
 */
SB2.Supervisor = function (workers, game) {
    SB2.Worker.call(this, workers, game);
    this.initializes("GameWorld", "Randomizer", "ScreenLimit", "Sequencer");
}
/* Inheritance from Worker */
SB2.Supervisor.prototype = Object.create(SB2.Worker.prototype);
SB2.Supervisor.prototype.constructor = SB2.Supervisor;

/** We're going to be using physics, so enable the Arcade Physics system
    And adjust the size of the world. This will implicitly impacts the maximum 
    size of each biome */
SB2.Supervisor.prototype.initGameWorld = function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, SB2.WIDTH*10, SB2.HEIGHT);   
};

/** Preparing the biome generation by creating a level's seed and
    instanciating a pseudo-random generator using a specific string
    that could be for example, the name of the level. */
SB2.Supervisor.prototype.initRandomizer = function(){
    phrase = SB2.seed || "God's Final Message to His Creation: We apologize for the inconvenience.";
    this.seed = SB2.Randomizer.prototype.genSeedFromPhrase(phrase);
    this.randomizer = new SB2.Randomizer(this.seed);
};

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
