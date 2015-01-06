/* global SB2 */
/* global Phaser */
"use strict";

/** */
SB2.Menu = function (game) {
    // Call State constructor on this instance and add this state to
    // game engine, without starting it
    Phaser.State.call(this, game);
    game.state.add('Menu', this, false);
    // Init menu object
    this.play = document.getElementById('SB2-play');
    this.seed = document.getElementById('SB2-seed');
    this.title = document.getElementById('SB2-title');
    this.overlay = document.getElementsByClassName('overlay');
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
    { // Set the background of the game
        var city;    
        this.game.stage.backgroundColor = SB2.BACKGROUND_COLOR;
        city = this.game.add.tileSprite(0, 0, 800, 600, 'city1');
        city.autoScroll(15, 0);
        city = this.game.add.tileSprite(0, 0, 800, 600, 'city2');
        city.autoScroll(30, 0);
    }

    // Add mute button
    this.muteButton = new SB2.MuteButton(this.game);

    this.swapSound = this.game.add.audio("swap");

    // Add two cubes
    this.cube = [new SB2.Cube(this.game, 320, 480, undefined, 1),
                 new SB2.Cube(this.game, 480, 480, undefined, 0)];
    this.cube.forEach(function (cube) {cube.body.allowGravity = false;});

    
    this.eventManager = new SB2.EventManager();
    this.eventManager.on(SB2.EVENTS.SWAP, this.onSwap, this);
    
    this.swapper = new SB2.Swapper(this.game, this.eventManager);
    this.swapper.start();
    
    // Set the menu overlay visible
    this.setVisibility('visible');

    // Display the seed value if already set
    this.seed.value = SB2.seed || '';

    this.play.onclick = SB2.Menu.onPlay.bind(this);
};

SB2.Menu.prototype.update = function () {
    this.swapper.handleSwap(this.cube);
};

SB2.Menu.onPlay = function () {
    // Get the seed
    if(this.seed.value != '') {            
        SB2.seed = this.seed.value;
    }

    // hide menu
    this.setVisibility('hidden');
    // Start the game
    this.game.state.start('Play');
};

SB2.Menu.prototype.setVisibility = function (visibility) {
    // Change the visibility of the element of the menu
    for(var i = 0, length = this.overlay.length; i < length; i++) {
        this.overlay[i].style.visibility = visibility;
    }
};

SB2.Menu.prototype.onSwap = function (event) {
    SB2.Cube.swap(event.cubes[0], event.cubes[1]);
    //this.swapSound.play("", 0, 0.4, false); // TODO
};
