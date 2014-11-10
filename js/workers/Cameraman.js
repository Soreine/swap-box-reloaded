/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a cameraman which will manage the camera motion during the game 
* @param {Object} workers The powerful team that does a great job
* @param {Phaser.Game} game The instance of the Game
* @param {Number} <optionnal> speed Lateral speed of the camera, in unit per second
*/
SB2.Cameraman = function (workers, game, speed) {
    SB2.Worker.call(this, workers, game);
    // The speed is optionnal and got a specific default value if not precised
    this.speed = speed || this.DEFAULT_SPEED;
};

/* Inheritance from Worker */
SB2.Cameraman.prototype = Object.create(SB2.Worker.prototype);
SB2.Cameraman.prototype.constructor = SB2.Cameraman;

/** Value of the default lateral speed of the camera in unit per second */
SB2.Cameraman.prototype.DEFAULT_SPEED = 100,

/** Update the camera position since the last update */
SB2.Cameraman.prototype.update = function(){
    var delay;

    /* Compute the new camera position depending of the time scrolling */
    delay = this.time.elapsedSince(this.previousTime);
    this.game.camera.x += Math.ceil(delay * this.speed / 1000);
    this.previousTime = this.game.time.now;
};

/** start the cameraman */
SB2.Cameraman.prototype.reset = function(){
    this.previousTime = this.game.time.now;
};

