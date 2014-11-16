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
    this.game.load.image('plain', SB2.GRAPHIC_ASSETS + '1.png'); // This is a plain color texture
    this.game.load.image('plain2', SB2.GRAPHIC_ASSETS + '2.png'); // This is a plain color texture
    this.game.load.image('plain3', SB2.GRAPHIC_ASSETS + '3.png'); // This is a plain color texture
    this.game.load.image('city1', SB2.GRAPHIC_ASSETS + 'city1.png');
    this.game.load.image('city2', SB2.GRAPHIC_ASSETS + 'city2.png');
    this.game.load.spritesheet('mute', SB2.GRAPHIC_ASSETS + 'mute.png', 50, 50, 2);
    this.game.load.spritesheet('death', SB2.GRAPHIC_ASSETS + 'death.png', 10, 10, 9);
    this.game.load.spritesheet('spirits', SB2.GRAPHIC_ASSETS + 'spirits.png', 16, 16, 2);
    this.game.load.audio('music', SB2.SOUND_ASSETS + 'square-run.ogg');

    this.game.sound.mute = SB2.muted;

    this.ready = true;
};

SB2.Loader.prototype.create = function () {
};

SB2.Loader.prototype.update = function () {
    // If assets are loaded AND music are loaded and decoded
    if(this.ready && this.checkDecoded()) {
        this.ready = true;
        this.game.state.start("Menu");
    }
};

SB2.Loader.prototype.checkDecoded = function () {
    return this.cache.isSoundDecoded('music');
};
