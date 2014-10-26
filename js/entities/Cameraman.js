/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a cameraman which will manage the camera motion  during the game 
 *   @param {Phaser.Camera} camera The game camera he has to manage
 *   @param {Phaser.Time} time Time of the game
 *   @param {Number} <optionnal> speed Lateral speed of the camera, in
 *   unit per second
 */
SB2.Cameraman = function (camera, time, speed) {
    this.camera = camera; 
    this.time = time;

    // The speed is optionnal and got a specific default value if not precised
    this.speed = speed || this.DEFAULT_SPEED;
};

SB2.Cameraman.prototype = {
    /** Value of the default lateral speed of the camera in unit per frame */
    DEFAULT_SPEED:  100,

    /** Update the camera position since the last update */
    update: function (cube1, cube2, cities) {
        var delay, positionByTime, positionByCubes, previousCamPos;

        // Compute the new camera position depending of the time scrolling or the playez positions
        delay = this.time.elapsedSince(this.previousTime);
        positionByTime = 0;
        positionByTime =  this.camera.x + Math.ceil(delay *  this.speed / 1000);
        //positionByCubes = Math.ceil((cube1.body.x + cube2.body.x) / 2) - this.camera.width / 2;


        // Move the camera
        previousCamPos = this.camera.x;
        this.camera.x = //positionByCubes > positionByTime ? 
            //Math.floor((positionByTime + positionByCubes) / 2): 
            positionByTime;
        this.previousTime = this.time.now;


        // Handle the parallax effect on the background
        function cityOffset(factor, camPos, prevCamPos) {
            return factor*Math.max(0, camPos - prevCamPos);
        }

        cities[0].tilePosition.x = (cities[0].tilePosition.x - cityOffset(0.15, this.camera.x, previousCamPos)) % cities[0].width;
        cities[1].tilePosition.x = (cities[1].tilePosition.x - cityOffset(0.30, this.camera.x, previousCamPos)) % cities[1].width;
    },

    /** Start the cameraman */
    start: function(){
        this.previousTime = this.time.now;
    }
};

