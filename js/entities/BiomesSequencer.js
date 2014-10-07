/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a sequencer that will handle the succession
*   of biome on a given level  
*   @param {Randomizer} randomizer 
*/
SB2.BiomesSequencer = function(randomizer, cube1, cube2, game, stackSize){
    var i, biome;

    this.biomes = [];
    this.stackSize = stackSize || SB2.BiomesSequencer.DEFAULT_STACK_SIZE;
    this.randomizer = randomizer;
    this.endOfLastBiome = 0;

    // Instanciate the first biome in the sequencer
    for(i = 0; i < this.stackSize; i++) {
        biome = this.pickUpNewOne();
        biome = new biome(new SB2.Randomizer(this.randomizer.genSeed()), this.endOfLastBiome);
        this.endOfLastBiome += biome.getWidth();
        biome.setUpContent(game);

        // Starting in the first biome
        if (i == 0) {
            biome.setCameraPosition(game.camera);
            biome.setCubesPositions(cube1, cube2);
        }
        this.biomes.unshift(biome);
    }
};

/** Represent the number of biome we should constantly have in Stack. 
* It will impact the minimum width of a biome. */
SB2.BiomesSequencer.DEFAULT_STACK_SIZE = 2;

SB2.BiomesSequencer.prototype = {
    /** Select and add a new biome to the stack */
    pickUpNewOne: function() {
        var selection, biome, i, length;

        // Build the allocation table if not already built
        if (!this.allocationTable) {
            this.allocationTable = [];
            this.tableRange = 0;

            for(length = SB2.Biome.list.length, i = 0; i < length; i++) {
                biome = SB2.Biome.list[i]; 
                this.tableRange += biome.prototype.getRarity();
                this.allocationTable.push([this.tableRange, biome]);
            }
        }

        //Pick one
        selection = this.randomizer.randBetween(0, this.tableRange);
        for(length = this.allocationTable.length, i = 0; i < length; i++) {
            if(selection <= this.allocationTable[i][0]){
                return this.allocationTable[i][1];
            }
        }
    },

    /** Update all visible biome, i.e. those present in the stack.
    *   if necessary, remove a non visible-biome, shift the remaning 
    *   and complete a new one 
     */
     updateBiomes: function(cube1, cube2, game){
        var i, biome;
        for(i = this.biomes.length - 1; i >= 0; i--){
            biome = this.biomes[i];
            biome.update(cube1, cube2, game);

            // It supposed implicitly that if a biome isn't visible anymore, 
            // it is the lastbiome of the stack... 
            if(!biome.isVisible(game.camera)){
                this.shiftBiomes(cube1, cube2, game.camera);
            }
        }
     },


    /** Shift all abscissas coordinates of a biome stack in order
    *   to put the first biome at the abscissa 0. Then return the
    *   end abscissa of the last biome 
    */
    shiftBiomes: function(cube1, cube2, camera) {
        console.log("shift");
    },



};