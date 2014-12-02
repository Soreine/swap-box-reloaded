/* global SB2 */
/* global Phaser */
"use strict";

/** The MuteButton create a button for muting sounds
 * @param {Phaser.Game} game The game instance
 */
SB2.MuteButton = function (game) {
    this.game = game;

    // Init mute button
    this.muteButton = this.game.add.button(0, 0, 'mute', this.mute, this);
    this.muteButton.frame = SB2.muted ? 1 : 0;
    this.muteButton.alpha = 0.5;
    this.muteButton.fixedToCamera = true;
};

SB2.MuteButton.prototype.mute = function () {
    if(this.game.sound.mute) {
        // Demute && Update button icon
        this.muteButton.frame = 0;
        this.game.sound.mute = false;
        SB2.muted = false;
    } else {
        // Mute
        this.muteButton.frame = 1;        
        this.game.sound.mute = true;
        SB2.muted = true;
    }
};

SB2.MuteButton.prototype.destroy = function () {
    this.muteButton.destroy();
};
