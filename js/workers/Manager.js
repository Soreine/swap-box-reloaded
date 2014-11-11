/* global SB2 */
/* global Phaser */
"use strict";

/** He's here to watch on the cubes situations and handle their behaviors.
* @param {Object} workers The powerful team that does a great job
* @param {Phaser.Game} game The instance of the Game
*/
SB2.Manager = function (workers, game) {
    SB2.Worker.call(this, workers, game);
    this.jumps = 0;
}
/* Inheritance from Worker */
SB2.Manager.prototype = Object.create(SB2.Worker.prototype);
SB2.Manager.prototype.constructor = SB2.Manager;

/** Initialize the controls for player 1 and 2 */
SB2.Manager.prototype.initControls = function () {
    var kb = this.game.input.keyboard;
    this.controls = [];
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
    this.cubes = [];
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

SB2.Manager.prototype.updateCubes = function(){
    var screenLimit;

    /* Update the cubes */
    this.cubes[0].myUpdate();
    this.cubes[1].myUpdate();

    this.jumps += this.cubes.map(function(a){return a.state == SB2.Cube.prototype.AIRBORNE ? 1 : 0;}).reduce(function(s,n){return s+n;});

    /* Checks to see if the both cubes overlap */
    if(this.game.SB2GameState != SB2.Play.prototype.DYING){
        screenLimit = this.workers.supervisor.screenLimit;
        if(this.game.physics.arcade.overlap(this.cubes[0], this.cubes[1])
           || !this.game.physics.arcade.overlap(this.cubes[0], screenLimit)
           || !this.game.physics.arcade.overlap(this.cubes[1], screenLimit)) {
            this.deathTouch();
        }
    }

    if(this.cubes[0].state == SB2.Cube.prototype.DEAD && this.cubes[1].state == SB2.Cube.prototype.DEAD){
        this.game.SB2GameState = SB2.Play.prototype.DEAD;
    }
};

/** Called when the two players collide */
SB2.Manager.prototype.deathTouch = function () {
    if(this.game.SB2GameState != SB2.Play.prototype.DYING){
        this.game.SB2GameState = SB2.Play.prototype.DYING;
        this.cubes[0].die();
        this.cubes[1].die();
        /* Update game state and hold music and swap */
        this.workers.conductor.die();
    }
};

SB2.Manager.prototype.getScore = function(){
    var distance = Math.floor(this.workers.supervisor.getTraveledDistance() / 10);
    var jumps = this.jumps;
    return distance + jumps;
}

SB2.Manager.prototype.reset = function(){
    this.initializes("Cubes");
}