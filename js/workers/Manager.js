/* global SB2 */
/* global Phaser */
"use strict";

/** He's here to watch on the cubes situations and handle their behaviors.
*/
SB2.Manager = function(eventManager) {
    this.eventManager = eventManager;
};

/** Initialize the two cubes/players; The cube definitive's position 
* will be set by the according to the sequencer
*/
SB2.Manager.prototype.createCubes = function(game, controls){
    var cubes = [];
    for(var i = 0; i < 2; i++){
        cubes[i] = new SB2.Cube(game, 0, 500, controls["player"+i], i);
        cubes[i].state = SB2.Cube.prototype.STARTING; // Stop cubes initially
    }
    return cubes;
};

SB2.Manager.prototype.updateCubes = function(game, cubes){
    /* Update the cubes */
    cubes.forEach(function(cube){ cube.myUpdate() });
    
    /* Maybe compute score */

    // ...

    // // REFACTOR : event cubes collide
    // if(this.cubes[0].state == SB2.Cube.prototype.DEAD && this.cubes[1].state == SB2.Cube.prototype.DEAD){
    //     this.game.SB2GameState = SB2.Play.prototype.DEAD;
    // }
};


/** TODO!
*/
SB2.Manager.prototype.getScore = function(){
    return 14;
};

/** TODO!
*/
SB2.Manager.prototype.reset = function(){ };
