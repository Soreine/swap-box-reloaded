/* global SB2 */
/* global Phaser */
"use strict";

/* An invisible rectangle that cover almost the entire screen */
SB2.ScreenLimit = function(game){
    this.triggerZone = game.add.sprite(SB2.UNIT, SB2.UNIT, null, 0);
    game.physics.arcade.enable(this.triggerZone);
    this.triggerZone.body.setSize(SB2.WIDTH - 2*SB2.UNIT, SB2.HEIGHT - 2*SB2.UNIT);
    this.triggerZone.fixedToCamera = true;
}
