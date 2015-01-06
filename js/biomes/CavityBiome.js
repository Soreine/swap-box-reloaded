/* global SB2 */
/* global Phaser */
"use strict";

/** @see Biome */
SB2.CavityBiome = function (game, randomizer, endOfLastBiome) {
    // Call the parent constructor
    this.width = 200*SB2.UNIT;
    SB2.Biome.call(this, game, randomizer, endOfLastBiome, this.width);
};

// Extends Biome
SB2.CavityBiome.prototype = Object.create(SB2.Biome.prototype);
SB2.CavityBiome.prototype.constructor = SB2.CavityBiome;

//Reference ourself inside the Biomes list
SB2.Biome.prototype.register(SB2.CavityBiome);

/** @see SB2.Biome */
SB2.CavityBiome.prototype.setUpContent = function(game) {
    var currentOffset, floorY, ceilY, width, nextPlatform, platformY, platformWidth, platformX;
    currentOffset = this.endOfLastBiome + SB2.Biome.JUNCTION_SIZE;
    floorY = SB2.HEIGHT;
    ceilY = 0;
    nextPlatform = 0;
    platformY = 0;
    platformWidth = 0;

    while(currentOffset < this.endOfLastBiome + this.width - 3*SB2.UNIT){

        /* Create The Tunnel !*/
        width = this.chooseWidth(currentOffset);
        ceilY = this.nextCeil(ceilY);
        floorY = this.nextFloor(floorY);
        this.addStalagtite(currentOffset, ceilY, width);
        this.addPillar(currentOffset, floorY, width);
        currentOffset += width;

        /* Add Some Platforms... sometimes */
        if(platformY - ceilY >= 1 * SB2.UNIT && floorY - platformY < 4 * SB2.UNIT) { 
            platformWidth += width;
            if(platformWidth >= 3 * SB2.UNIT && nextPlatform < currentOffset){
                if(this.randomizer.randBetween(1,10) > 5) {
                    this.addPlatform(platformX, platformY, platformWidth, SB2.Biome.MEDIUM);
                    nextPlatform = currentOffset + platformWidth;
                    platformWidth = 0;
                }else{
                    platformY = floorY - Math.floor(this.randomizer.randBetween(2,4)) * SB2.UNIT;
                    platformX = currentOffset - width;
                    platformWidth = 0;
                }
            }
        }else{
            platformY = floorY - Math.floor(this.randomizer.randBetween(2,4)) * SB2.UNIT;
            platformX = currentOffset - width;
            platformWidth = 0;
        }
    }
};

SB2.CavityBiome.prototype.chooseWidth = function(currentOffset){
    return SB2.UNIT * Math.floor(this.randomizer.randBetween(1, 3));
};

SB2.CavityBiome.prototype.nextFloor = function(floor){
    var factor = this.randomizer.randBetween(1,10) > 5 ? 1 : -1;
    floor -= factor * SB2.UNIT * Math.floor(this.randomizer.randBetween(0, 3));
    return Math.min(SB2.HEIGHT - SB2.UNIT, Math.max(floor, SB2.HEIGHT / 2 + SB2.UNIT));
};

SB2.CavityBiome.prototype.nextCeil = function(ceil){
    var factor = this.randomizer.randBetween(1,10) > 5 ? 1 : -1;
    ceil -= factor * SB2.UNIT * Math.floor(this.randomizer.randBetween(0, 4));
    return Math.min(SB2.HEIGHT/2, Math.max(ceil, SB2.UNIT));
};


/** @see SB2.Biome */
SB2.CavityBiome.prototype.getRarity = function() {
    return 4;
};