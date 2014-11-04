/* global SB2 */
/* global Phaser */
"use strict";

/** The decorator is in charge of the background animations.
* @param {Phaser.Game} game The instance of the current game
 */
SB2.Decorator = function (game) {
    /* Initialize the backgrounds of the game area */
    var city, cityNames, i;

    // Set the background color
    game.stage.backgroundColor = SB2.BACKGROUND_COLOR;

    // Add two cities in the background giving a parallax effect
    this.cities = [];
    cityNames = ['city1', 'city2'];
    for ( i = 0; i < cityNames.length; i++) {
        city = game.add.tileSprite(0, 0, 800, 600, cityNames[i]);
        city.fixedToCamera = true;
        this.cities.push(city);
    }

    // Keep the instance of the game's camera, and set up it previous pos.
    this.gameCamera = game.camera
    this.previousCamPos = game.camera.x;
}

// Define the parralax factors for the background scrolling
SB2.Decorator.FACTORS = [0.15, 0.30];

SB2.Decorator.prototype = {
    /** Compute the offset to add */
    cityOffset: function(factor) {
            return factor*Math.max(0, this.gameCamera.x - this.previousCamPos);
    },

    update: function(){
        for(var i = 0; i < factors.length(); i++){
            this.cities[i].tilePosition.x = (cities[i].tilePosition.x - cityOffset(SB2.Decorator.FACTORS[i])) % cities[i].width;
        }
        this.previousCamPos = this.gameCamera.x;
    },
}



