/* global SB2 */
/* global Phaser */
"use strict";

/** He's here to watch on the cubes situations and handle their behaviors.
* @param {Object} workers The powerful team that does a great job
* @param {Phaser.Game} game The instance of the Game
*/
SB2.Manager = function (workers, game) {
    SB2.Worker.call(this, workers, game);
    this.initializes("Controls", "Cubes");
}
/* Inheritance from Worker */
SB2.Manager.prototype = Object.create(SB2.Worker.prototype);
SB2.Manager.prototype.constructor = SB2.Manager;

/** Initialize the controls for player 1 and 2 */
SB2.Manager.prototype.initControls = function () {
    var kb = this.game.input.keyboard;
    this.controls[0] = new SB2.Controls(kb.addKey(Phaser.Keyboard.UP),
       null,
       kb.addKey(Phaser.Keyboard.RIGHT),
       kb.addKey(Phaser.Keyboard.LEFT)) ;
    this.controls[1] = new SB2.Controls(kb.addKey(Phaser.Keyboard.Z),
       null,
       kb.addKey(Phaser.Keyboard.D),
       kb.addKey(Phaser.Keyboard.Q));
};

/** Initialize the two cubes/players; The cube definitive's position 
* will be set by the supervisor according to the biome. 
*/
SB2.Manager.prototype.initCubes = function(){
    for(var i = 0; i < 2; i++){
        this.cubes[i] = new SB2.Cube(this.game, 0, 500, this.controls[i], i);
        this.setCubesState([i], SB2.Cube.prototype.DEAD); // Stop cubes initially
    }
};

/** Set the state of one or both cube 
* @param {Array} ids Ids of cube for which state should be changed
* @param {Number} state State that has to be set 
*/
SB2.Manager.prototype.setCubesState = function(ids, state){
    for(var i = 0; i < ids.length; i++){ this.cubes[i].state = state; }
};
