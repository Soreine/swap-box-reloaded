!/* global Phaser */
"use strict";

/** Swap Box Turbo 2 namespace */
var SB2;
// Initialize if not existing
SB2 = SB2 || {};

// Define the base path for the game
if(!SB2.BASE_PATH) {
    // Get the current path
    var base_path = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
    SB2.BASE_PATH = base_path;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
/** The assets folder */
SB2.GRAPHIC_ASSETS = SB2.BASE_PATH + "js/assets/graphics/";
SB2.SOUND_ASSETS = SB2.BASE_PATH + "js/assets/sounds/";

/** The base distance unit for the game, in pixel. Equals the size of
 * the player's cubes */
SB2.UNIT = 30;

/** The resolution of the game window */
SB2.WIDTH = 800;
SB2.HEIGHT = 600;

/** Background color */
SB2.BACKGROUND_COLOR = 0xffffff;


/** The duration of a jump on flat ground in seconds */
SB2.JUMP_DURATION = 0.5;
/** The height of a jump */
SB2.JUMP_HEIGHT = SB2.UNIT*4.5;
/** The height of a jump */
SB2.JUMP_LENGTH = SB2.JUMP_HEIGHT*1.5;

/** Jumping speed */
SB2.JUMP_SPEED = -4*SB2.JUMP_HEIGHT/SB2.JUMP_DURATION;
/** The gravity acceleration */
SB2.GRAVITY = -2*SB2.JUMP_SPEED/SB2.JUMP_DURATION;
/** Lateral movement speed for the cubes */
SB2.LATERAL_SPEED = SB2.JUMP_LENGTH/SB2.JUMP_DURATION;


/** Swap period in millis */
SB2.SWAP_PERIOD = 1500;
/** Activate secondary flash */
SB2.SECONDARY_INDICATOR = false;
/** Number of flashes between two swap */
SB2.NUM_INDIC = 4;

/** The different game states */
SB2.STATES = {};

/** Is the music muted ? */
SB2.muted = false;

//------------------------------------------------------------------------------
window.onload = function () {
    /* Create a Game instance */
    var game = new Phaser.Game(SB2.WIDTH, SB2.HEIGHT, Phaser.CANVAS, 'SB2', null, false, false);

    /** Reference to the game */
    SB2.game = game;

    // Initialize all the states
    SB2.STATES.loader = new SB2.Loader(game);
    SB2.STATES.menu = new SB2.Menu(game);
    SB2.STATES.play = new SB2.Play(game);
    
    // Start the first state
    game.state.start("Loader");
};
