/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a sequencer that will handle the succession
*   of biome on a given level  
*   @param {Randomizer} randomizer 
*/
SB2.Sequencer = function(game, eventManager, randomizer, cubes, screenLimit, stackSize){
    var i, biome;

    // Save valuables arguments
    this.randomizer = randomizer; this.eventManager = eventManager;
    this.stackSize = stackSize || SB2.Sequencer.DEFAULT_STACK_SIZE;

    this.biomes = [];
    this.endOfLastBiome = SB2.WIDTH / 2;
    this.totalOffset = 0;

    // Instanciate the first biome in the sequencer
    for(i = 0; i < this.stackSize; i++) {
        biome = this.addBiome(game, this.pickUpNewOne());

        // Starting in the first biome
        if (i == 0) {
            biome.setPositions(cubes, game.camera, screenLimit);
        }
    }
};

/** Represent the number of biome we should constantly have in Stack. 
* It will impact the minimum width of a biome. */
SB2.Sequencer.DEFAULT_STACK_SIZE = 3;

SB2.Sequencer.prototype = {
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
     updateBiomes: function(game, cubes, screenLimit){
        var i, biome;

        // It supposed implicitly that if a biome isn't visible anymore, 
        // it is the lastbiome of the stack... 
        if(!this.currentBiome().hasBeenDisplayed(game.camera)){
            this.shiftBiomes(game, cubes, screenLimit);
        }

        for(i = this.biomes.length - 1; i >= 0; i--){
            biome = this.biomes[i];
            biome.update(game, cubes);
        }
     },


    /** Shift all abscissas coordinates of a biome stack in order
    *   to put the first biome at the abscissa 0. Then return the
    *   end abscissa of the last biome 
    */
    shiftBiomes: function(game, cubes, screenLimit) {
        var i, length, removed, toShift;

        removed = this.biomes.pop()
        this.totalOffset += removed.getWidth();

        // TODO! C'est pas au biome sequencer de shift ces elements là. Plutot lever un event, "BiomeShifted"
        toShift = [ cubes[0].body,  cube[1].body, game.camera, screenLimit.triggerZone]
        for(length = toShift.length, i = 0; i < length; i++) {
            toShift[i].x -= removed.getWidth();
        }

        for(length = this.biomes.length, i = 0; i < length; i++) {
            this.biomes[i].shift(removed.getWidth());
        };
        removed.killYourself();
        this.endOfLastBiome -= removed.getWidth();
        this.addBiome(game, this.pickUpNewOne());
    },

    /** Add a new biome to the cattle
    * @param {Biome} biome The constructor of the biome to add
    */
    addBiome: function(game, biome){
        biome = new biome(game, new SB2.Randomizer(this.randomizer.genSeed()), this.endOfLastBiome);
        console.log(biome);
        biome.setUpContent(game);
        this.endOfLastBiome += biome.getWidth();
        this.biomes.unshift(biome);
        return biome;
    },

    /** Get the current Biome of the biome Sequencer
    */
    currentBiome: function(){
        return this.biomes.slice(-1)[0];
    },

    reset: function(){
        this.biomes.map(function(a){a.killYourself();});
        this.biomes = [];
    }
};