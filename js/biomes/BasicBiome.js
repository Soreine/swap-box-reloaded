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
        console.log(cube2.y);
        cube2.y = 500;
        cube2.x = 300;
        console.log(cube2.y);

        // cube1.body.reset(100 + this.endOfLastBiome, 50);
        // cube2.body.reset(200 + this.endOfLastBiome, 50);
    },
    /** @see SB2.Biome */
    setCameraPosition: function(camera) {

    },

    /** @see SB2.Biome */
    setUpContent: function(game) {
        var platform;

        this.platforms = game.add.group(undefined, 'platforms', false, true, Phaser.Physics.ARCADE);
        platform = this.platforms.create(0, SB2.HEIGHT - 2*SB2.UNIT, 'plain');
        platform.scale.setTo(5*SB2.WIDTH, 2*SB2.UNIT);
        platform.body.immovable = true;
    },

    /** @see SB2.Biome */
    update: function(cube1, cube2, game) {
        game.physics.arcade.collide(cube1, this.platforms);
        game.physics.arcade.collide(cube2, this.platforms);
    }
};
