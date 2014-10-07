/* global SB2 */
/* global Phaser */
"use strict";

/** This state is in charge of loading assets */
SB2.Loader = function (game) {
    // Call State constructor on this instance and add this state to
    // game engine, without starting it
    Phaser.State.call(this, game);
    game.state.add("Loader", this, false);
};

// Extends Phaser.State
SB2.Loader.prototype = Object.create(Phaser.State.prototype);
SB2.Loader.prototype.constructor = SB2.Loader;

//------------------------------------------------------------------------------
// Members
//------------------------------------------------------------------------------
/** If loading is ready ? */
SB2.Loader.prototype.ready = false;


//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Loader.prototype.preload = function () {
    this.game.load.image('plain', SB2.ASSETS + '1.png'); // This is a plain color texture
    this.game.load.image('plain2', SB2.ASSETS + '2.png'); // This is a plain color texture
    this.game.load.image('plain3', SB2.ASSETS + '3.png'); // This is a plain color texture
    this.game.load.image('city1', SB2.ASSETS + 'city1.png');
    this.game.load.image('city2', SB2.ASSETS + 'city2.png');
    this.game.load.spritesheet('death', SB2.ASSETS + 'death.png', 10, 10, 9);

    this.ready = true;
};

SB2.Loader.prototype.create = function () {
};

SB2.Loader.prototype.update = function () {
    this.game.state.start("Play");
};
