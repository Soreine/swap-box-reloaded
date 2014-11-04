/* global SB2 */
/* global Phaser */
"use strict";

/** The supervisor's role is to handle the succession of biome on a given level.
    He also keep an eye on the screen limit when he has to. 
    @param {Phaser.Game} game The instance of the current game
 */
SB2.Supervisor = function (game) {
    var phrase, initializes, i;
    this.game = game;

    /* Initalize all needed components */
    initializes = [this.initGameWorld, this.initRandomizer, this.initScreenLimit];
    for(i = 0; i < initializes.length(); i++) { initializes[i](); }
}


SB2.Supervisor.prototype = {
    /** We're going to be using physics, so enable the Arcade Physics system
        And adjust the size of the world. This will implicitly impacts the maximum 
        size of each biome */
    initGameWorld: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, SB2.WIDTH*10, SB2.HEIGHT);   
    },

    /** Preparing the biome generation by creating a level's seed and
        instanciating a pseudo-random generator using a specific string
        that could be for example, the name of the level. */
    initRandomizer: function(){
        phrase = SB2.seed || "God's Final Message to His Creation: We apologize for the inconvenience.";
        this.seed = SB2.Randomizer.prototype.genSeedFromPhrase(phrase);
        this.randomizer = new SB2.Randomizer(this.seed);
    },

    /** Initialize the screen limit used to check when cube exit the screen */
    initScreenLimit = function () {
        // An invisible rectangle that cover almost the entire screen,
        this.screenLimit = this.game.add.sprite(SB2.UNIT, SB2.UNIT, null, 0);
        this.game.physics.arcade.enable(this.screenLimit);
        this.screenLimit.body.setSize(SB2.WIDTH - 2*SB2.UNIT, SB2.HEIGHT - 2*SB2.UNIT);
        this.screenLimit.fixedToCamera = true;
    },
}