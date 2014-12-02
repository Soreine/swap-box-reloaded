/* global SB2 */
/* global Phaser */
"use strict";

/** Instanciate a biome, i.e., a context that will manage the level design
* @param {Randomizer} randomizer Randomizer needed to generate pseudo-random numbers
* @param {Number} endOfLastBiome The end position of the previous Biome in pixel
*/
SB2.Biome = function(randomizer, endOfLastBiome, width, game) {
    var xs, i;

    this.randomizer = randomizer; this.endOfLastBiome = endOfLastBiome;
    this.content = {
        platforms: game.add.group(undefined, 'platforms'+randomizer._seed, false, true, Phaser.Physics.ARCADE),
        pillars: game.add.group(undefined, 'pillars'+randomizer._seed, false, true, Phaser.Physics.ARCADE),
        tunnels: game.add.group(undefined, 'tunnels'+randomizer._seed, false, true, Phaser.Physics.ARCADE),
        lavas: game.add.group(undefined, 'lavas'+randomizer._seed, false, true, Phaser.Physics.ARCADE),
        stalagtites: game.add.group(undefined, 'stalagtites'+randomizer._seed, false, true, Phaser.Physics.ARCADE)
    }

    // Instanciate junctions of each side of the biome
    xs = [endOfLastBiome, endOfLastBiome + width - SB2.Biome.JUNCTION_SIZE]
    for(i in xs) {
        this.addPlatform(xs[i], 
            SB2.HEIGHT-SB2.Biome.MEDIUM, 
            SB2.Biome.JUNCTION_SIZE, 
            SB2.Biome.MEDIUM)
    }
};

/** Reference to all biomes that could be picked up to build a level */
SB2.Biome.list = [];

/** Constants for building contents */
SB2.Biome.JUNCTION_SIZE = 6*SB2.UNIT
SB2.Biome.THIN = SB2.UNIT/2;
SB2.Biome.MEDIUM = SB2.UNIT;
SB2.Biome.FAT = SB2.UNIT*2;


/** Prototype of each Biome, will be useful to instanciate a specific Biome
*/
SB2.Biome.prototype = {
    /** Register a biome as a valid biome that can be instanciated and pickep up to build a level 
    * @param {Biome} biome The biome object that can be instanciated
    */
    register: function(biome) {
        SB2.Biome.list.push(biome);
    },

    /** Set up the position of both cubes , camera and other stuff when starting the level with that Biome
    * @param {Cube} cube1 First of the two cubes to set up
    * @param {Cube} cube2 Second of the two cubes to set up
    * @param {Phaser.Camera} camera The game camera
    * @param {Phaser.Sprite} screenLimit Trigger of the screen limit
    */
    setPositions: function(cube1, cube2, camera, screenLimit) {
        cube1.x = this.endOfLastBiome + SB2.UNIT;
        cube2.x = this.endOfLastBiome + 3*SB2.UNIT;
        cube1.y = SB2.HEIGHT - 8*SB2.UNIT;
        cube2.y = cube1.y;

        camera.setPosition(0, 0);
        screenLimit.x = this.endOfLastBiome + SB2.UNIT;
    },

    /** Instanciate all platforms and entities that will occures in the Biome 
    * @param {Phaser.Game} game Instance of the current game 
    */
    setUpContent: function(game) {},

    /** Update all  component of the Biome that shoud be
    * @param {Cube} cube1 Instance of the first player
    * @param {Cube} cube2 Instance of the first player
    * @param {Phaser.game} game Instance of the current game
    */
    update: function(cube1, cube2, game) {
        game.physics.arcade.collide(cube1, [this.content.platforms, this.content.pillars]);
        game.physics.arcade.collide(cube2, [this.content.platforms, this.content.pillars]);
    },

    /** Shift the abscissa coordinates of a biome and all his elements
    *   @param {Number} offset The offset of the shift
    */
    shift: function(offset) {
        this.endOfLastBiome -= offset;
        this.content.platforms.subAll('x', offset, true);
        this.content.pillars.subAll('x', offset, true);
        this.content.stalagtites.subAll('x', offset, true);
    }, 

    /** Remove the biome from the game */
    killYourself: function() {
        this.content.platforms.destroy();
        this.content.pillars.destroy();
        this.content.stalagtites.destroy();
    },

    /** Evaluate whether a biome has been displayed or not
    * @param {Object} The entity to evaluate
    */
    hasBeenDisplayed: function(camera) {
        return !(this.endOfLastBiome + this.width < camera.x); 
    },

    /** Return the length of the biome */
    getWidth: function() {
        return this.width;
    },

    /** Return the rarity threshold of a the biome. This threshold is a integer from 0 to 10, 
    * 0 means that the biome should be pick really rarely, 
    * and 10 means that the biome is very common. 
    */ 
    getRarity: function() {},

    /** Add a platform to the biome, i.e. a portion of field that has a limited thickness 
    * @param {Number} x The x coordinate of the platform's top-left corner
    * @param {Number} y The y coordinate of the platform's top-left corner
    * @param {Number} width The width of the platform
    * @param {Number} thick The thickness of the platform
    */
    addPlatform: function(x, y, width, thick) {
        var platform = this.content.platforms.create(x, y, 'plain');
        platform.scale.setTo(width, thick);
        platform.body.immovable = true;
    },

    /** Add a pillar to the biome, i.e. a portion of field that reach the screen's bottom 
    * @param {Number} x The x coordinate of the pillar's top-left corner
    * @param {Number} y The y coordinate of the pillar's top-left corner
    * @param {Number} width The width of the pillar
    */
    addPillar: function(x, y, width) {
        var pillar = this.content.pillars.create(x, y, 'plain');
        pillar.scale.setTo(width, SB2.HEIGHT - y);
        pillar.body.immovable = true;
    },

    /** Add a stalagtite to the biome, i.e. a portion of field that reach the screen's top 
    * @param {Number} x The x coordinate of the stalagtite's bottom-left corner
    * @param {Number} y The y coordinate of the stalagtite's bottom-left corner
    * @param {Number} width The width of the stalagtite
    */
    addStalagtite: function(x, y, width) {
        var stalagtite = this.content.pillars.create(x, 0, 'plain');
        stalagtite.scale.setTo(width, y);
        stalagtite.body.immovable = true;
    },

    /** Add lava to the biome, i.e. a portion of field that players can't touch without dying
    * @param {Number} x The x coordinate of the lava-block's top-left corner
    * @param {Number} y The y coordinate of the lava-block's top-left corner
    * @param {Number} width The width of the lava-block
    */
    addLava: function(x, y, width) {

    },


    
};
