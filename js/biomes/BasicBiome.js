/* global SB2 */
/* global Phaser */
"use strict";

/** @see Biome */
SB2.BasicBiome = function (randomizer, endOfLastBiome) {
    // Call the parent constructor
    SB2.Biome.call(this, randomizer, endOfLastBiome);
    this.width = 500;
};

// Extends Biome
SB2.BasicBiome.prototype = Object.create(SB2.Biome.prototype);
SB2.BasicBiome.prototype.constructor = SB2.BasicBiome;

//Reference ourself inside the Biomes list
SB2.Biome.prototype.register(SB2.BasicBiome);
SB2.Biome.prototype.register(SB2.BasicBiome);

/** @see SB2.Biome */
SB2.BasicBiome.prototype.setCubesPositions = function(cube1, cube2) {
    cube1.x = 500;
    cube1.y = 400;
    cube2.x = 300;
    cube2.y = 400;
};

/** @see SB2.Biome */
SB2.BasicBiome.prototype.setCameraPosition = function(camera) { };

/** @see SB2.Biome */
SB2.BasicBiome.prototype.setUpContent = function(game) {
    var platform;
    this.platforms = game.add.group(undefined, 'platforms', false, true, Phaser.Physics.ARCADE);
    platform = this.platforms.create(0 + this.endOfLastBiome, SB2.HEIGHT - 2*SB2.UNIT, 'plain');
    platform.scale.setTo(this.width, 2*SB2.UNIT);
    platform.body.immovable = true;
};

/** @see SB2.Biome */
SB2.BasicBiome.prototype.update = function(cube1, cube2, game) {
        game.physics.arcade.collide(cube1, this.platforms);
        game.physics.arcade.collide(cube2, this.platforms);
};

/** @see SB2.Biome */
SB2.BasicBiome.prototype.shift = function(offset) {
    this.platforms.subAll('position.x', offset, true);
};

/** @see SB2.Biome */
SB2.BasicBiome.prototype.getRarity = function() {
    return 9;
};