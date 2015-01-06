/* global SB2 */
/* global Phaser */
"use strict";

/** The Swapper is responsible of the swaps scheduling.
 * @param {Phaser.Game} game The game instance
 */
SB2.Swapper = function (game, eventManager) {
    this.eventManager = eventManager; 
    this.initSwap(game);
};

// CONSTANTS
/** Secondary Indicator period */
SB2.Swapper.INDIC_PERIOD = SB2.SWAP_PERIOD/SB2.NUM_INDIC;
/** Indicator thickness */
SB2.Swapper.INDIC_THICK = 10;

SB2.Swapper.prototype.initSwap = function(game){
    var indic,  // Temporary variable to create swap indicators
    // constants shorthands
    H = SB2.HEIGHT, W = SB2.WIDTH,
    ITH = SB2.Swapper.INDIC_THICK, U = SB2.UNIT,
    P = SB2.Swapper.INDIC_PERIOD;


    this.swapIndicators = game.add.group(undefined, 'indicators', true,  false); // No body
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
    this.swapTween = {primary: game.add.tween(this.swapIndicators),
                      secondary: game.add.tween(this.swapIndicators)};
    this.swapTween.primary.from({alpha:0}, P/2);
    this.swapTween.secondary.from({alpha:0}, P/4);

    // Init swap timer
    this.swap = {timer: new SB2.Timer(game), count:0};

    // Add behavior on events
    game.onPause.add(this.onPaused, this);
    game.onResume.add(this.onResumed, this);
};

/** Effectively start the timer (and music) */
SB2.Swapper.prototype.start = function(){
    // Start timer and music
    this.swap.timer.start();
};


// REFACTOR : handle swap should be an event (swap time) and the
// manager will handle it for cube swap, and another component may
// handle it to create the on screen swap effect.
/** Measure time and swap controls if needed. Also in charge of
 * displaying timing indicators */
SB2.Swapper.prototype.handleSwap = function(cubes){
    // Check the timer 
    if(this.swap.timer.elapsed() > SB2.Swapper.INDIC_PERIOD*this.swap.count) {
        // If it's the last indicator
        if(this.swap.count % SB2.NUM_INDIC == 2) {
            // Raise a SWAP event
            this.eventManager.trigger(new SB2.Event(SB2.EVENTS.SWAP, {cubes: cubes}));
            // Make a primary flash
            this.swapIndicators.alpha = 1.0;
            this.swapTween.primary.start();
        } else {
            if(SB2.SECONDARY_INDICATOR) {
                this.eventManager.trigger(new SB2.Event(SB2.EVENTS.SWAP_TICK));
                // Make a secondary flash
                this.swapIndicators.alpha = 0.1;
                this.swapTween.secondary.start();
            }
        }

        // update the swap
        this.swap.count++;
    }
};

SB2.Swapper.prototype.onPaused = function () {
    this.swap.timer.pause();
};

// TODO : don't resume if it was already paused
SB2.Swapper.prototype.onResumed = function () {
    this.swap.timer.resume();
};

SB2.Swapper.prototype.stop = function(){
    this.swap.timer.pause();
    this.swap.timer.reset();
    this.swap.count = 0; 
};
