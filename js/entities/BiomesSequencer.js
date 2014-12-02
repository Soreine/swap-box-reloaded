/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a sequencer that will handle the succession
*   of biome on a given level  
*   @param {Randomizer} randomizer 
*/
SB2.BiomesSequencer = function(randomizer, cube1, cube2, screenLimit, game, stackSize){
    var i, biome;

    // Save valuables arguments
    this.cube1 = cube1; this.cube2 = cube2; 
    this.screenLimit = screenLimit; this.game = game;
    this.randomizer = randomizer;
    this.stackSize = stackSize || SB2.BiomesSequencer.DEFAULT_STACK_SIZE;

    this.biomes = [];
    this.endOfLastBiome = SB2.WIDTH / 2;
    this.totalOffset = 0;

    // Instanciate the first biome in the sequencer
    for(i = 0; i < this.stackSize; i++) {
        biome = this.addBiome(this.pickUpNewOne());

        // Starting in the first biome
        if (i == 0) {
            biome.setPositions(cube1, cube2, game.camera, screenLimit);
        }
    }
};

/** Represent the number of biome we should constantly have in Stack. 
* It will impact the minimum width of a biome. */
SB2.BiomesSequencer.DEFAULT_STACK_SIZE = 3;

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
     updateBiomes: function(){
        var i, biome;

        // It supposed implicitly that if a biome isn't visible anymore, 
        // it is the lastbiome of the stack... 
        if(!this.currentBiome().hasBeenDisplayed(this.game.camera)){
            this.shiftBiomes();
        }

        for(i = this.biomes.length - 1; i >= 0; i--){
            biome = this.biomes[i];
            biome.update(this.cube1, this.cube2, this.game);
        }
     },


    /** Shift all abscissas coordinates of a biome stack in order
    *   to put the first biome at the abscissa 0. Then return the
    *   end abscissa of the last biome 
    */
    shiftBiomes: function() {
        var i, length, removed, toShift;

        removed = this.biomes.pop()
        this.totalOffset += removed.getWidth();

        toShift = [ this.cube1.body,  this.cube2.body, this.game.camera,  this.screenLimit.body]
        for(length = toShift.length, i = 0; i < length; i++) {
            toShift[i].x -= removed.getWidth();
        }

        for(length = this.biomes.length, i = 0; i < length; i++) {
            this.biomes[i].shift(removed.getWidth());
        };
        removed.killYourself();
        this.endOfLastBiome -= removed.getWidth();
        this.addBiome(this.pickUpNewOne());
    },

    /** Add a new biome to the cattle
    * @param {Biome} biome The constructor of the biome to add
    */
    addBiome: function(biome){
        biome = new biome(new SB2.Randomizer(this.randomizer.genSeed()), this.endOfLastBiome, this.game);
        biome.setUpContent(this.game);
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