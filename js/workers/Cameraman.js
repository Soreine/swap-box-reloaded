/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a cameraman which will manage the camera motion during the game 
 *   @param {Phaser.Camera} camera The game camera he has to manage
 *   @param {Phaser.Time} time Time of the game
 *   @param {Number} <optionnal> speed Lateral speed of the camera, in
 *   unit per second
 */
SB2.Cameraman = function (camera, time, speed) {
    this.camera = camera;  this.time = time;

    // The speed is optionnal and got a specific default value if not precised
    this.speed = speed || this.DEFAULT_SPEED;
};

SB2.Cameraman.prototype = {
    /** Value of the default lateral speed of the camera in unit per second */
    DEFAULT_SPEED:  100,

    /** Update the camera position since the last update */
    update: function (cube1, cube2, cities) {
        var delay, positionByTime, previousCamPos;

        /* Compute the new camera position depending of the time scrolling */
        delay = this.time.elapsedSince(this.previousTime);
        previousCamPos = this.camera.x;
        this.camera.x += Math.ceil(delay *  this.speed / 1000);
        this.previousTime = this.time.now;
    },

    /** start the cameraman */
    start: function(){
        this.previousTime = this.time.now;
    }
};

