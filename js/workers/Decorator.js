/* global SB2 */
/* global Phaser */
"use strict";

/** The decorator is in charge of the background animations.
* @param {Object} workers The powerful team that does a great job
* @param {Phaser.Game} game The instance of the Game
*/
SB2.Decorator = function (workers, game) {
    SB2.Worker.call(this, workers, game);
}
/* Inheritance from Worker */
SB2.Decorator.prototype = Object.create(SB2.Worker.prototype);
SB2.Decorator.prototype.constructor = SB2.Decorator;

// Define the parralax factors for the background scrolling
SB2.Decorator.prototype.FACTORS = [0.15, 0.30];
SB2.Decorator.prototype.GRAY = "#333333";
SB2.Decorator.prototype.YELLOW = "#fbab1f";
SB2.Decorator.prototype.BLUE = "#1989f1";
SB2.Decorator.prototype.TEXT_0 = {content: "Ready ?", x: SB2.WIDTH/2 + 200, y: SB2.HEIGHT / 2};
SB2.Decorator.prototype.TEXT_1 = {content: "Go !", x: SB2.WIDTH/2, y: SB2.HEIGHT / 2};
SB2.Decorator.prototype.TEXT_2 = {content: "Score", x: SB2.WIDTH/2, y: SB2.HEIGHT / 2 - 50};
SB2.Decorator.prototype.TEXT_3 = {content: "", x: SB2.WIDTH/2, y: SB2.HEIGHT / 2 + 50};
SB2.Decorator.prototype.TEXT_OPTIONS = {font: "bold 70px Helvetica", fill: SB2.Decorator.prototype.GRAY, align: "center" };
SB2.Decorator.prototype.TEXT_OPTIONS_2 = {font: "bold 70px Helvetica", fill: SB2.Decorator.prototype.YELLOW, align: "center" };
SB2.Decorator.prototype.TEXT_OPTIONS_3 = {font: "bold 70px Helvetica", fill: SB2.Decorator.prototype.BLUE, align: "center" };

SB2.Decorator.prototype.CITY_NAMES = ['city1', 'city2'];

/** Initialize the backgrounds of the game area */
SB2.Decorator.prototype.initCities = function(){
    var city, cityNames, i;

    /* Set the background color */
    this.game.stage.backgroundColor = SB2.BACKGROUND_COLOR;

    /* Add two cities in the background giving a parallax effect */
    this.cities = [];
    for ( i = 0; i < this.CITY_NAMES.length; i++) {
        city = this.game.add.tileSprite(0, 0, 800, 600, this.CITY_NAMES[i]);
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

SB2.Decorator.prototype.handleStartingText = function(){
    switch(this.game.SB2GameState){
        case SB2.Play.prototype.STARTING:
            if(!this.startText){
                this.addPannel();
                this.startText = this.game.add.text(this.TEXT_0.x, this.TEXT_0.y, this.TEXT_0.content, this.TEXT_OPTIONS);
                this.startText.anchor.set(0.5);
                this.game.add.tween(this.startText).to({x: this.TEXT_0.x - 200}, 1000, Phaser.Easing.Quadratic.Out, true);
            }
            break;
        case SB2.Play.prototype.RUNNING:
            if(this.startText){
                this.startText.destroy();
                this.startText = this.game.add.text(this.TEXT_1.x, this.TEXT_1.y, this.TEXT_1.content, this.TEXT_OPTIONS);
                this.startText.anchor.set(0.5);
                this.game.add.tween(this.startText).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true);
                this.game.add.tween(this.startText.scale).to({x: 2, y: 2}, 700, Phaser.Easing.Quadratic.Out, true);
                this.game.add.tween(this.pannel).to({x: -800}, 500, Phaser.Easing.Quadratic.Out, true);
            }
    }
}

SB2.Decorator.prototype.displayScore = function(){
    if(!this.scoreTimer){
        this.addWhiteBackground();
        this.scoreTimer = new SB2.Timer(this.game);
        this.scoreTimer.start();
    } else if(!this.scoreTextMsg && this.scoreTimer.elapsed() > this.workers.supervisor.STARTING_DELAY / 2){
        this.scoreTextMsg = this.game.add.text(this.TEXT_2.x, this.TEXT_2.y, this.TEXT_2.content, this.TEXT_OPTIONS);
        this.scoreText = this.game.add.text(this.TEXT_3.x, this.TEXT_3.y, String(this.workers.manager.getScore()), this.TEXT_OPTIONS);
        this.scoreTextMsg.fixedToCamera = true;
        this.scoreTextMsg.anchor.set(0.5);
        this.scoreText.anchor.set(0.5);
        this.scoreText.fixedToCamera = true;
    } else if(this.scoreTimer.elapsed() > 2 * this.workers.supervisor.STARTING_DELAY){
        this.workers.supervisor.scoreDisplayed();
    }
};

SB2.Decorator.prototype.addPannel = function(){
    /* Add a White Transparent Background For Readibility */
    this.pannel = this.game.add.graphics(0,0);
    this.pannel.beginFill(0xffffff, 1);
    this.pannel.drawRect(0,SB2.HEIGHT / 2 - 90,800,150);
    this.pannel.endFill();
    this.pannel.beginFill(0x333333, 1);
    this.pannel.drawRect(0,SB2.HEIGHT / 2 + 50, 800, 20);
    this.pannel.drawRect(0,SB2.HEIGHT / 2 - 100, 800, 20);
    this.pannel.endFill();
    this.pannel.x = 800;
    this.game.add.tween(this.pannel).to({x: 0}, 250, Phaser.Easing.Quadratic.Out, true);
};

SB2.Decorator.prototype.addWhiteBackground = function(delay){
    /* Add a White Transparent Background For Readibility */
    this.backgroundScore = this.game.add.graphics(0,0);
    this.backgroundScore.beginFill(0xffffff, 1);
    this.backgroundScore.drawRect(0,0,SB2.WIDTH, SB2.HEIGHT);
    this.backgroundScore.endFill();
    this.backgroundScore.endFill();
    this.backgroundScore.alpha = 0;
    this.backgroundScore.fixedToCamera = true;
    this.game.add.tween(this.backgroundScore).to({alpha: 0.4}, this.workers.supervisor.STARTING_DELAY / 2, Phaser.Easing.Linear.None, true);
};

SB2.Decorator.prototype.reset = function(){
    /** Reset Cities */ 
    for (var i = 0; i < this.cities.length; i++) {
        this.cities[i].destroy();
    }
    this.previousCamPos = 0;

    /** Delete StartingText*/
    this.startText.destroy();
    this.startText = undefined;

    /** Delete DisplayScore */
    this.scoreTimer = undefined;
    this.scoreTextMsg.destroy();
    this.scoreTextMsg = undefined;
    this.scoreText.destroy();
    this.scoreText = undefined;
    this.backgroundScore.destroy();
    this.pannel.destroy();
    this.initializes("Cities");
}