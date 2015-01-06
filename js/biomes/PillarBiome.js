/* global SB2 */
/* global Phaser */
"use strict";

/** @see Biome */
SB2.PillarBiome = function (game, randomizer, endOfLastBiome) {
    // Call the parent constructor
    this.width = 75 * SB2.UNIT;
    SB2.Biome.call(this, game, randomizer, endOfLastBiome, this.width);
};

// Extends Biome
SB2.PillarBiome.prototype = Object.create(SB2.Biome.prototype);
SB2.PillarBiome.prototype.constructor = SB2.PillarBiome;

//Reference ourself inside the Biomes list
SB2.Biome.prototype.register(SB2.PillarBiome);

/** @see SB2.Biome */
SB2.PillarBiome.prototype.setUpContent = function(game) {
    var posX, posY, width, remaining, botLimit;

    remaining = this.width - SB2.Biome.JUNCTION_SIZE + this.endOfLastBiome;
    posX = SB2.Biome.JUNCTION_SIZE + this.endOfLastBiome;
    botLimit = SB2.HEIGHT - SB2.Biome.MEDIUM;
    posY = botLimit;

    while(posX < remaining) {
        posX += Math.floor(this.randomizer.randBetween(0, SB2.UNIT*3))
        posY += Math.floor(this.randomizer.randBetween(SB2.UNIT, SB2.UNIT*3)) * (this.randomizer.randBetween(0, 10) > 7 ? 1 : -1);
        posY = posY > botLimit ? botLimit : (posY < SB2.UNIT*2 ? SB2.UNIT*2 : posY); 
        width = this.randomizer.randBetween(SB2.UNIT*4, SB2.UNIT*10);
        this.addPillar(posX, posY, width);  
        posX += width;
    }
};

/** @see SB2.Biome */
SB2.PillarBiome.prototype.getRarity = function() {
    return 6;
};
