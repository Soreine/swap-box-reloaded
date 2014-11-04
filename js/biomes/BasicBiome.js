/* global SB2 */
/* global Phaser */
"use strict";

/** @see Biome */
SB2.BasicBiome = function (randomizer, endOfLastBiome, game) {
    // Call the parent constructor
    this.width = 1750;
    SB2.Biome.call(this, randomizer, endOfLastBiome, this.width, game);
};

// Extends Biome
SB2.BasicBiome.prototype = Object.create(SB2.Biome.prototype);
SB2.BasicBiome.prototype.constructor = SB2.BasicBiome;

//Reference ourself inside the Biomes list
SB2.Biome.prototype.register(SB2.BasicBiome);

/** @see SB2.Biome */
SB2.BasicBiome.prototype.setUpContent = function(game) {
    var posX, posY, width, remaining, botLimit;


    remaining = this.width - SB2.Biome.JUNCTION_SIZE + this.endOfLastBiome;
    posX = SB2.Biome.JUNCTION_SIZE + this.endOfLastBiome;
    botLimit = SB2.HEIGHT - SB2.Biome.MEDIUM;
    posY = botLimit;

    while(posX < remaining) {
        posX += this.randomizer.randBetween(SB2.UNIT, SB2.UNIT*3)
        posY += this.randomizer.randBetween(SB2.UNIT, SB2.UNIT*3) * (this.randomizer.randBetween(0, 10) > 7 ? 1 : -1);
        posY = posY > botLimit ? botLimit : (posY < 0 ? 0 : posY); 
        width = this.randomizer.randBetween(SB2.UNIT*2, SB2.UNIT*5);
        this.addPlatform(posX, posY, width, SB2.Biome.MEDIUM);  
        posX += width;
    }
};

/** @see SB2.Biome */
SB2.BasicBiome.prototype.getRarity = function() {
    return 6;
};