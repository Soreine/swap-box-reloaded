/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a biome, i.e., a context that will manage the level design
* @param {Randomizer} randomizer Randomizer needed to generate pseudo-random numbers
* @param {Number} endOfLastBiome The end position of the previous Biome in pixel
*/
SB2.Biome = function(randomizer, endOfLastBiome) {
    this.randomizer = randomizer; this.endOfLastBiome = endOfLastBiome;
};

/** Reference to all biomes that could be picked up to build a level */
SB2.Biome.list = [];


/** Prototype of each Biome, will be useful to instanciate a specific Biome
*/
SB2.Biome.prototype = {
    /** Register a biome as a valid biome that can be instanciated and pickep up to build a level 
    * @param {Biome} biome The biome object that can be instanciated
    */
    register: function(biome) {
        SB2.Biome.list.push(biome);
    },

    /** Set up the position of both cubes , camera and other stuff when starting the level with that Biome
    * @param {Cube} cube1 First of the two cubes to set up
    * @param {Cube} cube2 Second of the two cubes to set up
    * @param {Phaser.Camera} camera The game camera
    * @param {Phaser.Sprite} screenLimit Trigger of the screen limit
    */
    setPositions: function(cube1, cube2, camera, screenLimit) {},

    /** Instanciate all platforms and entities that will occures in the Biome 
    * @param {Phaser.Game} game Instance of the current game 
    */
    setUpContent: function(game) {},

    /** Update all  component of the Biome that shoud be
    * @param {Cube} cube1 Instance of the first player
    * @param {Cube} cube2 Instance of the first player
    * @param {Phaser.game} game Instance of the current game
    */
    update: function(cube1, cube2, game) {},

    /** Shift the abscissa coordinates of a biome and all his elements
    *   @param {Number} offset The offset of the shift
    */
    shift: function(offset) {}, 

    /** Remove the biome from the game */
    killYourself: function() {},

    /** Evaluate whether a biome has been displayed or not
    * @param {Object} The entity to evaluate
    */
    hasBeenDisplayed: function(camera) {
        return !(this.endOfLastBiome + this.width < camera.x); 
    },

    /** Return the length of the biome */
    getWidth: function() {
        return this.width;
    },

    /** Return the rarity threshold of a the biome. This threshold is a integer from 0 to 10, 
    * 0 means that the biome should be pick really rarely, 
    * and 10 means that the biome is very common. 
    */ 
    getRarity: function() {}

};
