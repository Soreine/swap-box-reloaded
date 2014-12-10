/* global SB2 */
/* global Phaser */
"use strict";

/** The decorator is in charge of the background animations. 
* @param {eventManager} eventManager A reference to the event's 
*/
SB2.Decorator = function(game, eventManager){
    this.eventManager = eventManager;
    this.initCities(game);
    eventManager.on(SB2.EVENTS.CAMERA_MOVED, this.update, this);
};

// Define the parralax factors for the background scrolling
SB2.Decorator.prototype.FACTORS = [0.15, 0.30];

/** Initialize the backgrounds of the game area */
SB2.Decorator.prototype.initCities = function(game){
    var city, i;

    /* Set the background color */
    game.stage.backgroundColor = SB2.BACKGROUND_COLOR;

    /* Add two cities in the background giving a parallax effect */
    this.cities = (['city1', 'city2']).map(function(name){
        city = game.add.tileSprite(0, 0, 800, 600, name);
        city.fixedToCamera = true;
        return city
    });
};

SB2.Decorator.prototype.update = function(event){
    var i, offset;
    for(i = 0; i < this.FACTORS.length; i++){
        offset = this.FACTORS[i]*event.offset;
        this.cities[i].tilePosition.x = (this.cities[i].tilePosition.x - offset) % this.cities[i].width;
    }
};
