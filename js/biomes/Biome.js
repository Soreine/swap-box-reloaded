/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a biome, i.e., a context that will manage the level design
* @param {Number} seed Seed needed to generate pseudo-random numbers
* @param {Number} endOfLastBiome The end position of the previous Biome in pixel
*/
SB2.Biome = function(seed, width, endOfLastBiome) {
    this.seed = seed;
    this.endOfLastBiome = endOfLastBiome;
    this.width = width;
}

/** Prototype of each Biome, will be useful to instanciate a specific Biome
*/
SB2.Biome.prototype = {
    /** Set up the position of both cubes when starting the level with that Biome
    * @param {Cube} cube1 First of the two cubes to set up
    * @param {Cube} cube2 Second of the two cubes to set up
    */
    setCubesPositions: function(cube1, cube2) {},

    /** Set up the position of the camera when starting the level with that Biome
    * @param {Phaser.Camera} camera The game camera
    */
    setCameraPosition: function(camera) {},

    /** Instanciate all platforms and entities that will occures in the Biome 
    * @param {Phaser.Game} game Instance of the current game 
    */
    setUpContent: function(game) {},

    /** Update all  component of the Biome that shoud be
    * @param {Phaser.game} game Instance of the current game
    */
    update: function(game) {},

    /** Generate a new seed from a string sentence
    * @param {String} key Key used to build the seed
    */
    genSeed: function(key) {
        var seed, i;

        seed = 0;
        for(i = 0; i < key.length; i++){
            seed += Math.pow(key.charCodeAt(i)*(i+1) % 14, 14) % 14000 ;
        }
        return seed;
    },

    /** Return the length of the cube */
    getWidth: function() {
        return this.width;
    }
}