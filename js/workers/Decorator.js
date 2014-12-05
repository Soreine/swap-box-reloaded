/* global SB2 */
/* global Phaser */
"use strict";

/** The decorator is in charge of the background animations. 
* @param {eventManager} eventManager A reference to the event's 
*/
SB2.Decorator = function(game, eventManager){
    this.eventManager = eventManager;
    this.initCities(game);
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

    /* Keep the instance of the game's camera, and set up it previous pos. */
    this.previousCamPos = game.camera.x;
};

SB2.Decorator.prototype.update = function(camera){
    var i, offset;

    for(i = 0; i < this.FACTORS.length(); i++){
        offset = this.FACTORS[i]*Math.max(0, camera.x - this.previousCamPos); // Little hack, à corriger
        this.cities[i].tilePosition.x = (cities[i].tilePosition.x - offset) % cities[i].width;
    }
    this.previousCamPos = camera.x;
};

// SB2.Decorator.prototype.handleStartingText = function(){
//     switch(this.game.SB2GameState){
//         case SB2.Play.prototype.STARTING:
//             if(!this.startText){
//                 this.addPanel();
//                 this.startText = this.game.add.text(this.TEXT_0.x, this.TEXT_0.y, this.TEXT_0.content, this.TEXT_OPTIONS);
//                 this.startText.anchor.set(0.5);
//                 this.game.add.tween(this.startText).to({x: this.TEXT_0.x - 200}, 1000, Phaser.Easing.Quadratic.Out, true);
//             }
//             break;
//         case SB2.Play.prototype.RUNNING:
//             if(this.startText){
//                 this.startText.destroy();
//                 this.startText = this.game.add.text(this.TEXT_1.x, this.TEXT_1.y, this.TEXT_1.content, this.TEXT_OPTIONS);
//                 this.startText.anchor.set(0.5);
//                 this.game.add.tween(this.startText).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true);
//                 this.game.add.tween(this.startText.scale).to({x: 2, y: 2}, 700, Phaser.Easing.Quadratic.Out, true);
//                 this.game.add.tween(this.panel).to({x: -800}, 500, Phaser.Easing.Quadratic.Out, true);
//             }
//     }
// };

// SB2.Decorator.prototype.displayScore = function(){
//     if(!this.scoreTimer){
//         this.addWhiteBackground();
//         this.scoreTimer = new SB2.Timer(this.game);
//         this.scoreTimer.start();
//     } else if(!this.scoreTextMsg && this.scoreTimer.elapsed() > this.workers.supervisor.STARTING_DELAY / 2){
//         this.scoreTextMsg = this.game.add.text(this.TEXT_2.x, this.TEXT_2.y, this.TEXT_2.content, this.TEXT_OPTIONS);
//         this.scoreText = this.game.add.text(this.TEXT_3.x, this.TEXT_3.y, String(this.workers.manager.getScore()), this.TEXT_OPTIONS);
//         this.scoreTextMsg.fixedToCamera = true;
//         this.scoreTextMsg.anchor.set(0.5);
//         this.scoreText.anchor.set(0.5);
//         this.scoreText.fixedToCamera = true;
//     } else if(this.scoreTimer.elapsed() > 2 * this.workers.supervisor.STARTING_DELAY){
//         this.workers.supervisor.scoreDisplayed();
//     }
// };

// SB2.Decorator.prototype.addPanel = function(){
//     /* Add a White Transparent Background For Readibility */
//     this.panel = this.game.add.graphics(0,0);
//     this.panel.beginFill(0xffffff, 1);
//     this.panel.drawRect(0,SB2.HEIGHT / 2 - 90,800,150);
//     this.panel.endFill();
//     this.panel.beginFill(0x333333, 1);
//     this.panel.drawRect(0,SB2.HEIGHT / 2 + 50, 800, 20);
//     this.panel.drawRect(0,SB2.HEIGHT / 2 - 100, 800, 20);
//     this.panel.endFill();
//     this.panel.x = 800;
//     this.game.add.tween(this.panel).to({x: 0}, 250, Phaser.Easing.Quadratic.Out, true);
// };

// SB2.Decorator.prototype.addWhiteBackground = function(delay){
//     /* Add a White Transparent Background For Readibility */
//     this.backgroundScore = this.game.add.graphics(0,0);
//     this.backgroundScore.beginFill(0xffffff, 1);
//     this.backgroundScore.drawRect(0,0,SB2.WIDTH, SB2.HEIGHT);
//     this.backgroundScore.endFill();
//     this.backgroundScore.endFill();
//     this.backgroundScore.alpha = 0;
//     this.backgroundScore.fixedToCamera = true;
//     this.game.add.tween(this.backgroundScore).to({alpha: 0.4}, this.workers.supervisor.STARTING_DELAY / 2, Phaser.Easing.Linear.None, true);
// };

// SB2.Decorator.prototype.reset = function(){
//     /** Reset Cities */ 
//     for (var i = 0; i < this.cities.length; i++) {
//         this.cities[i].destroy();
//     }
//     this.previousCamPos = 0;

//     /** Delete StartingText*/
//     this.startText.destroy();
//     this.startText = undefined;

//     /** Delete DisplayScore */
//     this.scoreTimer = undefined;
//     this.scoreTextMsg.destroy();
//     this.scoreTextMsg = undefined;
//     this.scoreText.destroy();
//     this.scoreText = undefined;
//     this.backgroundScore.destroy();
//     this.panel.destroy();
//     this.initializes("Cities");
// };
