/* global SB2 */
/* global Phaser */
"use strict";

/** A timer that can be paused and resumed. Useful for keeping track
 * of the time passing by ingame.
 */
SB2.Timer = function (game) {
    this.game = game;
    this.paused = true;
    this.reset();
};

/** Reset timer */
SB2.Timer.prototype.reset = function () {
    this.memorized = 0;
    this.resumeTime = this.game.time.now;
};

/** Reset and start timer */
SB2.Timer.prototype.start = function () {
    this.reset();
    this.paused = false;
};

/** Get the measured time of this timer */
SB2.Timer.prototype.elapsed = function () {
    if(this.paused) {
        return this.memorized;
    } else {
        return this.game.time.elapsedSince(this.resumeTime) 
            + this.memorized;
    }
};

/** Pause timer */
SB2.Timer.prototype.pause = function () {
    if(this.paused) {
        throw "Was already paused";
    }
    this.memorized = this.elapsed();
    this.paused = true;
};

/** Resume timer */
SB2.Timer.prototype.resume = function () {
    if(!this.paused) {
        throw "Was not paused";
    }
    this.paused = false;
    this.resumeTime = this.game.time.now;
};