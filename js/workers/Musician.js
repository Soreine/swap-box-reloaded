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

SB2.Musician.FADE_OUT = 1000;

SB2.Musician.prototype.initMusic = function(){
    // Init music
    this.music = this.game.add.audio('music');

    // On fade complete, should restore the volume and stop the music
    // this.music.onFadeComplete.add(SB2.Musician.onFadeComplete);


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
    // this.music.fadeOut(SB2.Musician.FADE_OUT);
    this.music.stop();
};

SB2.Musician.onFadeComplete = function (music, volume)  {
    if(volume == 0) {
        // Stop the music
        music.stop();
        // Reset volume
        music.volume = 1;
    }
};
