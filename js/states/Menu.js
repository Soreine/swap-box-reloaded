/* global SB2 */
/* global Phaser */
"use strict";

/** */
SB2.Menu = function (game) {
    // Call State constructor on this instance and add this state to
    // game engine, without starting it
    Phaser.State.call(this, game);
    game.state.add("Menu", this, false);
};

// Extends Phaser.State
SB2.Menu.prototype = Object.create(Phaser.State.prototype);
SB2.Menu.prototype.constructor = SB2.Menu;

//------------------------------------------------------------------------------
// Members
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Menu.prototype.preload = function () {
};

SB2.Menu.prototype.create = function () {
    var city, menu, state;
    state = this;
    // Set the background of the game
    this.game.stage.backgroundColor = SB2.BACKGROUND_COLOR;
    city = this.game.add.tileSprite(0, 0, 800, 600, 'city1');
    city.autoScroll(15, 0);
    city = this.game.add.tileSprite(0, 0, 800, 600, 'city2');
    city.autoScroll(30, 0);

    // Pause the game because we are handling the menu with HTML
    // elements
    this.game.pause = true;
    // Reveal the menu
    menu = document.getElementById("overlay");
    menu.style.visibility = "visible";

    document.getElementById("play").onclick = function () {
        // Get the seed
        SB2.seed = document.getElementById("seed").value || "SEED";
        // hide menu
        menu.style.visibility = "hidden";
        // Start the game
        state.game.state.start("Play");
    };
};

SB2.Menu.prototype.update = function () {
};
