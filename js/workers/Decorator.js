/* global SB2 */
/* global Phaser */
"use strict";

/** The decorator is in charge of the background animations.
* @param {Object} workers The powerful team that does a great job
* @param {Phaser.Game} game The instance of the Game
*/
SB2.Decorator = function (workers, game) {
    SB2.Worker.call(this, workers, game);
    this.initializes("Cities");
}
/* Inheritance from Worker */
SB2.Decorator.prototype = Object.create(SB2.Worker.prototype);
SB2.Decorator.prototype.constructor = SB2.Decorator;

// Define the parralax factors for the background scrolling
SB2.Decorator.prototype.FACTORS = [0.15, 0.30];
SB2.Decorator.prototype.TEXT_0 = {content: "Ready ?", x: 200, y: 400};
SB2.Decorator.prototype.TEXT_1 = {content: "Go !", x: 200, y: 400};
SB2.Decorator.prototype.TEXT_OPTIONS = {font: "bold 70px Helvetica", fill: "#333333", align: "center" };



/** Initialize the backgrounds of the game area */
SB2.Decorator.prototype.initCities = function(){
    var city, cityNames, i;

    /* Set the background color */
    this.game.stage.backgroundColor = SB2.BACKGROUND_COLOR;

    /* Add two cities in the background giving a parallax effect */
    this.cities = [];
    cityNames = ['city1', 'city2'];
    for ( i = 0; i < cityNames.length; i++) {
        city = this.game.add.tileSprite(0, 0, 800, 600, cityNames[i]);
        city.fixedToCamera = true;
        this.cities.push(city);
    }

    /* Keep the instance of the game's camera, and set up it previous pos. */
    this.gameCamera = this.game.camera
    this.previousCamPos = this.game.camera.x;
};

/** Compute the offset to add */
SB2.Decorator.prototype.cityOffset = function(factor){
        return factor*Math.max(0, this.gameCamera.x - this.previousCamPos);
};

SB2.Decorator.prototype.update = function(){
    for(var i = 0; i < factors.length(); i++){
        this.cities[i].tilePosition.x = (cities[i].tilePosition.x - cityOffset(SB2.Decorator.FACTORS[i])) % cities[i].width;
    }
    this.previousCamPos = this.gameCamera.x;
};

SB2.Decorator.prototype.handleStartingText = function(state){
    switch(state){
        case SB2.Play.prototype.STARTING:
            if(!this.startText){
                this.startText = this.game.add.text(this.TEXT_0.x, this.TEXT_0.y, this.TEXT_0.content, this.TEXT_OPTIONS);
                this.startText.anchor.set(0.5);
            }
            break;
        case SB2.Play.prototype.RUNNING:
            if(this.startText){
                this.startText.text = "Go !"
                this.game.add.tween(this.startText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            }
    }
}
