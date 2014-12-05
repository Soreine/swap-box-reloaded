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

SB2.Controls.bindings = {
    player1: {
        up:     Phaser.Keyboard.UP,
        down:   null,
        left:   Phaser.Keyboard.LEFT,
        right:  Phaser.Keyboard.RIGHT
    },

    player2: {
        up:     Phaser.Keyboard.FIVE,
        down:   null,
        left:   Phaser.Keyboard.Y,
        right:  Phaser.Keyboard.R
    }
};

/** Initialize phaser controls for the game
* @param {Phaser.Keyboard} keyboard A reference to the Phaser's Keyboard object
* @param {Object} <optional> keybindings Object that specified specific keyBindings
*/
SB2.Controls.prototype.createControls = function(keyboard){
    var controls = {player1: undefined, player2: undefined};
    (["player1", "player2"]).forEach(function(playerKey){
        controls[playerKey] = new SB2.Controls(
            keyboard.addKey(SB2.Controls.bindings[playerKey].up),
            null, // Faut tester si keyboard.addkey(null) pose pas probleme.. sinon faudra trouver une autre façon de l'ecrire
            keyboard.addKey(SB2.Controls.bindings[playerKey].right),
            keyboard.addKey(SB2.Controls.bindings[playerKey].left)) ;
    });

    return controls;
};

/** Will update a complete key binding where
* specified bindings are set from argument, and other are 
* taken from the default global bindings
* @param {Object} keyBindings Players key binding controls
*/
SB2.Controls.updateBindings = function(keyBindings){
    var mergedBindings, bindedKey;
    // Peut etre envisager de creer une methode clone object quelque part, plus général.

    mergedBindings = {player1: {}, player2: {}};
    (["player1", "player2"]).forEach(function(playerKey){
        /* Use default if keyBindings are not defined */
        for(bindedKey in SB2.Controls.bindings[playerKey]){
            mergedBindings[playerKey][bindedKey] = 
                (keyBindings[playerKey] && keyBindings[playerKey][bindedKey]) || 
                SB2.Controls.bindings[playerKey][bindedKey];
        }
    });
    SB2.Controls.bindings = mergedBindings
}