/* global SB2 */
/* global Phaser */
"use strict";

/** A set of controls binding for a player
 * @param {Phaser.Key} up 
 * @param {Phaser.Key} down 
 * @param {Phaser.Key} right
 * @param {Phaser.Key} left
 */
SB2.Controls = function (up, down, right, left) {
    this.up = up;
    this.down = down;
    this.right = right;
    this.left = left;
};
