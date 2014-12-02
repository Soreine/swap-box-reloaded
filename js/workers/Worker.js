/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a worker
 * @param {Object} workers The powerful team that does a great job
 * @param {Phaser.Game} game The game instance
 */
SB2.Worker = function (workers, game) {
    this.workers = workers;
    this.game = game;
};

/** Call initializations functions 
* @param {String} <Optionnal> args Functions that have to be called
*/
SB2.Worker.prototype.initializes = function(){
    for(var i = 0; i < arguments.length; i++) {
        this["init" + arguments[i]](); 
    }
};
