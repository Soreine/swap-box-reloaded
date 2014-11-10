/* global SB2 */
/* global Phaser */
"use strict";

/** The conductor will handle the music and the swap during the game. 
    @param {Object} workers The powerful team that does a great job
 * @param {Phaser.Game} game The game instance
 */
SB2.Conductor = function (workers, game) {
    SB2.Worker.call(this, workers, game);
}
/* Inheritance from Worker */
SB2.Conductor.prototype = Object.create(SB2.Worker.prototype);
SB2.Conductor.prototype.constructor = SB2.Conductor;

SB2.Conductor.prototype.initSwap = function(){
    var indic,  // Temporary variable to create swap indicators
    // constants shorthands
    H = SB2.HEIGHT, W = SB2.WIDTH,
    ITH = SB2.INDIC_THICK, U = SB2.UNIT,
    P = SB2.INDIC_PERIOD;


    this.swapIndicators = this.game.add.group(undefined, 'indicators', true,  false); // No body
    this.swapIndicators.alpha = 0;

    // Create 4 bars assembling into a frame
    indic = this.swapIndicators.create(0, 0, 'plain'); // TOP
    indic.scale.setTo(W, ITH);
    indic = this.swapIndicators.create(0, H - ITH, 'plain'); // BOTTOM
    indic.scale.setTo(W, ITH);
    indic = this.swapIndicators.create(W - ITH, ITH, 'plain'); // LEFT
    indic.scale.setTo(ITH, H - 2*ITH);
    indic = this.swapIndicators.create(0, ITH, 'plain'); // RIGHT 
    indic.scale.setTo(ITH, H - 2*ITH);

    // Init the indicator tweener
    this.swapTween = {primary: this.game.add.tween(this.swapIndicators),
                      secondary: this.game.add.tween(this.swapIndicators)};
    this.swapTween.primary.from({alpha:0}, P/2);
    this.swapTween.secondary.from({alpha:0}, P/4);

    // Init swap timer
    this.swap = {timer: new SB2.Timer(this.game), count:0};
};

SB2.Conductor.prototype.initMusic = function(){
    function muteFunction () {
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
    }

    // Init music
    this.music = this.game.add.audio('music');

    // Init mute button
    this.muteButton = this.game.add.button(0, 0, 'mute', muteFunction, this);
    this.muteButton.frame = SB2.muted ? 1 : 0;
    this.muteButton.alpha = 0.5;
    this.muteButton.fixedToCamera = true;

    // Add the pause and resume handling
    this.game.onPause.add(this.onPaused, this);
    this.game.onResume.add(this.onResumed, this);
};

/** Effectively start the timer (and music) */
SB2.Conductor.prototype.startSwap = function(){
    // Start timer and music
    this.swap.timer.start();
    this.music.play("", 0, 1, true);
    this.music.loop = true;
};

/** Measure time and swap controls if needed. Also in charge of
 * displaying timing indicators */
SB2.Conductor.prototype.handleSwap = function(){
    // Check the timer 
    if(this.swap.timer.elapsed() > SB2.INDIC_PERIOD*this.swap.count) {
        // If it's the last indicator
        if(this.swap.count % SB2.NUM_INDIC == 2) {
            // Make a swap
            SB2.Cube.swap(this.workers.manager.cubes[0], this.workers.manager.cubes[1]);
            // Make a primary flash
            this.swapIndicators.alpha = 1.0;
            this.swapTween.primary.start();
        } else {
            if(SB2.SECONDARY_INDICATOR) {
                // Make a secondary flash
                this.swapIndicators.alpha = 0.1;
                this.swapTween.secondary.start();
            }
        }

        // update the swap
        this.swap.count++;
    }
};

SB2.Conductor.prototype.onPaused = function () {
    this.swap.timer.pause();
    this.music.pause();
};

SB2.Conductor.prototype.onResumed = function () {
    this.swap.timer.resume();
    this.music.resume();
};

SB2.Conductor.prototype.die = function(){
    this.music.stop();
    this.swap.timer.pause();
    this.swap.timer.reset();
    this.swap.count = 0; 
}