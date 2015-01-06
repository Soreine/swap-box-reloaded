/* global SB2 */
/* global Phaser */
"use strict";

/** He's here to watch on the cubes situations and handle their behaviors.
* @param {Phaser.Game} game The instance of the Game
* @param {EventManager} em The instance of the event manager
*/
SB2.Manager = function(eventManager) {
    this.eventManager = eventManager;
    eventManager.on(SB2.EVENTS.SWAP, this.onSwap, this);
};

/** Initialize the two cubes/players; The cube definitive's position 
* will be set by the according to the sequencer
*/
SB2.Manager.prototype.createCubes = function(game, controls){
    var cubes = [];
    for(var i = 0; i < 2; i++){
        cubes[i] = new SB2.Cube(game, 0, 500, controls["player"+(i+1)], i);
        cubes[i].state = SB2.Cube.prototype.STARTING; // Stop cubes initially
    }
    return cubes;
};

SB2.Manager.prototype.updateCubes = function(game, cubes){
    /* Update the cubes */
    cubes.forEach(function(cube){ cube.myUpdate() });

    /* Maybe compute score */
};

SB2.Manager.prototype.setCubesState = function(cubes, state){
    cubes.forEach(function(cube){ cube.state = state; });
}

SB2.Manager.prototype.killCubes = function(cubes){
    cubes.forEach(function(cube) { cube.die(); });
}

/** TODO! */
SB2.Manager.prototype.getScore = function(){
    return 14;
};

/** TODO! */
SB2.Manager.prototype.reset = function(){ };

/** Called after SWAP event */
SB2.Manager.prototype.onSwap = function (event) {
    SB2.Cube.swap(event.cubes[0], event.cubes[1]); // Make a swap
};
