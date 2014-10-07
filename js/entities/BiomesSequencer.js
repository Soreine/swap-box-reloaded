/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a sequencer that will handle the succession
*   of biome on a given level  
*   @param {Randomizer} randomizer 
*/
SB2.BiomesSequencer = function(randomizer, stackSize){
    this.biomes = [];
    this.stackSize = stackSize || SB2.BiomesSequencer.DEFAULT_STACK_SIZE;
    this.randomizer = randomizer;
    this.endOfLastBiome = 0;

    for(var i = 0; i < this.stackSize; i++) {
        biome = new this.pickUpNewOne(new SB2.Randomizer(this.randomizer.genSeed(), this.endOfLastBiome));
        this.endOfLastBiome += biome.getWidth();
        this.biomes.push();
    }
};

/** Represent the number of biome we should constantly have in Stack. 
* It will impact the minimum width of a biome. */
SB2.BiomesSequencer.DEFAULT_STACK_SIZE = 2;

SB2.BiomesSequencer.prototype = {
    /** Select and add a new biome to the stack */
    pickUpNewOne: function() {
        var selection, biome, rarity, i, length;

        // Build the allocation table if not already built
        if (!this.allocationTable) {
            this.allocationTable = [];
            this.tableRange = 0;

            for(length = SB2.Biome.list.length, i = 0; i < length; i++) {
                biome = SB2.Biome.list[i]; 
                rarity = biome.prototype.getRarity();
                this.allocationTable.push([rarity, biome]);
                this.tableRange += rarity;
            }
        }

        //Pick one
        selection = this.randomizer.randBetween(0, this.tableRange);
        for(i = 0; i < this.allocationTable.length; i++) {
            if(selection <= this.allocationTable[i][0]){
                return this.allocationTable[i][1];
            }
        }
    },

    /** */



};