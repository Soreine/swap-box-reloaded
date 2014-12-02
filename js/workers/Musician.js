/* global SB2 */
/* global Phaser */
"use strict";

/** The Musician handle the music and sounds swap during the game. 
 * @param {Phaser.Game} game The game instance
 */
SB2.Musician = function (game) {
    this.game = game;
    this.initMusic();
};

SB2.Musician.prototype.initMusic = function(){
    // Init music
    this.music = this.game.add.audio('music');

    // Add the pause and resume handling
    this.game.onPause.add(this.onPaused, this);
    this.game.onResume.add(this.onResumed, this);
};

/** Start playing music */
SB2.Musician.prototype.startMusic = function(){
    this.music.play("", 0, 1, true);
    this.music.loop = true;
};

SB2.Musician.prototype.onPaused = function () {
    this.music.pause();
};

SB2.Musician.prototype.onResumed = function () {
    this.music.resume();
};

SB2.Musician.prototype.stopMusic = function(){
    this.music.stop();
}
