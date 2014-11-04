/* global SB2 */
/* global Phaser */
"use strict";

/** He's here to watch on the cubes situations and handle their behaviors.
*   @param {Phaser.Game} game The instance of the Game
 */
SB2.Manager = function (game) {
    this.game = game;

    /* Initalize all needed components */
    initializes = [this.initControls, this.initCubes];
    for(i = 0; i < initializes.length(); i++) { initializes[i](); }
};

SB2.Manager.prototype = {
    /** Initialize the controls for player 1 and 2 */
    initControls: function () {
        var kb = this.game.input.keyboard;
        this.controls1 = new SB2.Controls(kb.addKey(Phaser.Keyboard.UP),
                               null,
                               kb.addKey(Phaser.Keyboard.RIGHT),
                               kb.addKey(Phaser.Keyboard.LEFT)) ;
        this.controls2 = new SB2.Controls(kb.addKey(Phaser.Keyboard.Z),
                               null,
                               kb.addKey(Phaser.Keyboard.D),
                               kb.addKey(Phaser.Keyboard.Q));
    },

    /** Initialize the two cubes/players */
    initCubes: function(){
        // The cube definitive's position will be set by the supervisor according to the biome.
        this.cube1 = new SB2.Cube(this.game, 0, 500, this.controls1, 0);
        this.cube2 = new SB2.Cube(this.game, 0, 500, this.controls2, 1);
    }
}