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

// Init menu object
SB2.Menu.elements = {
    play: document.getElementById("SB2-play"),
    seed: document.getElementById("SB2-seed"),
    title: document.getElementById("SB2-title")
};

//------------------------------------------------------------------------------
// State functions
//------------------------------------------------------------------------------
SB2.Menu.prototype.preload = function () {
};

SB2.Menu.prototype.create = function () {
    var elements, city, state;
    state = this;
    elements = SB2.Menu.elements;
    // Set the background of the game
    this.game.stage.backgroundColor = SB2.BACKGROUND_COLOR;
    city = this.game.add.tileSprite(0, 0, 800, 600, 'city1');
    city.autoScroll(15, 0);
    city = this.game.add.tileSprite(0, 0, 800, 600, 'city2');
    city.autoScroll(30, 0);

    // Add mute button
    this.initMusic();

    // Pause the game because we are handling the menu with HTML
    // elements
    this.game.pause = true;

    SB2.Menu.setVisibility("visible");

    elements.seed.value = SB2.seed || "";
    elements.play.onclick = function () {
        // Get the seed
        if(elements.seed.value != "") {            
            SB2.seed = elements.seed.value;
        }
        // hide menu
        SB2.Menu.setVisibility("hidden");
        // Start the game
        state.game.state.start("Play");
    };
};

SB2.Menu.prototype.update = function () {
};


SB2.Menu.prototype.initMusic = function () {
    function muteFunction () {
        if(this.game.sound.mute) {
            // Demute
            // Update button icon
            this.muteButton.frame = 0;
            this.game.sound.mute = false;
            SB2.muted = false;
        } else {
            // Mute
            this.muteButton.frame = 1;        
            this.game.sound.mute = true;
            SB2.muted = true;
        }
    }

    // Init music
    this.music = this.game.add.audio('music');

    // Init mute button
    this.muteButton = this.game.add.button(0, 0, 'mute', muteFunction, this);
    this.muteButton.frame = SB2.muted ? 1 : 0;
    this.muteButton.alpha = 0.5;
    this.muteButton.fixedToCamera = true;
};

SB2.Menu.setVisibility = function (visibility, menu) {
    menu = menu || SB2.Menu.elements;
    // Change the visibility of the element of the menu
    for(var element in menu) {
        menu[element].style.visibility = visibility;
    }
};
