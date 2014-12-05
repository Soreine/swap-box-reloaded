/* global SB2 */
/* global Phaser */
"use strict";

/** The Physicist's role is to handle his team and the running of the game.
* He also keep an eye on the screen limit when he has to. 
* @param {eventManager} eventManager A reference to the event's 
*/
SB2.Physicist = function (eventManager) {
    this.eventManager = eventManager;
};

/** We're going to be using physics, so enable the Arcade Physics system
    And adjust the size of the world. This will implicitly impacts the maximum 
    size of each biome */
SB2.Physicist.prototype.initGameWorld = function(game){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, SB2.WIDTH*10, SB2.HEIGHT);   
};

/** Checks to see if the both cubes overlap 
*/
SB2.Physicist.prototype.checkCubeCollision = function(cubes, gamePhysic, screenLimit, gameState){
    /* We are not going to check for a collision if cubes have already collided */
    if(gameState != SB2.Play.prototype.DYING){
        if(gamePhysic.overlap(cubes[0], cubes[1])
           || !gamePhysic.overlap(cubes[0], screenLimit.triggerZone)
           || !gamePhysic.overlap(cubes[1], screenLimit.triggerZone)) {
            
            // Trigger an event
            state.deathTouch();
        }
    }
}

// SB2.Physicist.prototype.updateStartingChrono = function(){
//     if(!this.chrono){
//         this.chrono = new SB2.Timer(this.game);
//         this.chrono.start();
//     }else if(this.chrono.elapsed() > SB2.Physicist.prototype.STARTING_DELAY) {
//         this.workers.manager.setCubesState([0,1], SB2.Cube.prototype.STANDING);
//         this.workers.cameraman.reset();
//         this.workers.swapper.start();
//         this.workers.musician.startMusic();
//         this.game.SB2GameState = SB2.Play.prototype.RUNNING;
//     }
// };

// /** Called when the game is restarting */
// SB2.Physicist.prototype.scoreDisplayed = function(){
//     this.workers.decorator.reset();
//     this.workers.manager.reset();
//     this.reset();
//     this.game.SB2GameState = SB2.Play.prototype.STARTING;
// };

// SB2.Physicist.prototype.reset = function(){
//     this.chrono = undefined;
//     this.sequencer.reset();
//     this.initializes("Randomizer", "Sequencer");
// };