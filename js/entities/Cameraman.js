/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a cameraman which will manage the camera motion  during the game 
*   @param {Phaser.Camera} Camera the game camera he has to manage
*   @param {Phaser.Time} Time of the game
*   @param {Number} <optionnal> Speed Lateral speed of the camera, in unit per second
*/
SB2.Cameraman = function (camera, time, speed) {
    this.camera = camera; this.time = time;

    // The speed is optionnal and got a specific default value if not precised
    this.speed = speed || this.DEFAULT_SPEED;
    this.previousTime = time.now;
};

SB2.Cameraman.prototype = {
    /** Value of the default lateral speed of the camera in unit per frame */
    DEFAULT_SPEED:  0,

    /** Update the camera position since the last update */
    update: function (cube1, cube2, cities) {
        var delay, positionByTime, positionByCubes, previousCamPos;

        // Compute the new camera position depending of the time scrolling or the playez positions
        delay = this.time.elapsedSince(this.previousTime);
        positionByTime =  this.camera.x + Math.ceil(delay *  this.speed / 1000);
        positionByCubes = Math.ceil((cube1.body.x + cube2.body.x) / 2) - this.camera.width / 2;

        // Move the camera
        previousCamPos = this.camera.x;
        this.camera.x = positionByCubes > positionByTime ? (positionByTime + positionByCubes) / 2 : positionByTime;
        this.previousTime = this.time.now;

        // Handle the parallax effect on the background
        cities[0].tilePosition.x = -0.15*this.camera.x;
        cities[1].tilePosition.x = -0.3*this.camera.x;
    }
};

