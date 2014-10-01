/* global SB2 */
/* global Phaser */
"use strict";

/** @see Biome */
SB2.BasicBiome = function (seed, endOfLastBiome) {
    // Call the parent constructor
    SB2.Biome.call(this, seed, endOfLastBiome);
};

// Extends Biome
SB2.BasicBiome.prototype = Object.create(SB2.Biome.prototype);
SB2.BasicBiome.prototype.constructor = SB2.BasicBiome;

SB2.BasicBiome.prototype = {
    /** @see SB2.Biome */
    setCubesPositions: function(cube1, cube2) {
        cube1.body.reset(100 + this.endOfLastBiome, 50);
        cube2.body.reset(200 + this.endOfLastBiome, 50);
    },
    /** @see SB2.Biome */
    setCameraPosition: function(camera) {

    },

    /** @see SB2.Biome */
    setUpContent: function(game) {

    },

}