/* global SB2 */
/* global Phaser */
"use strict";

/** The animator handle different animation that occurs alongside the game.
* @param {EventManager} eventManager The event manager
*/
SB2.Animator = function(eventManager){ 
    this.eventManager = eventManager;
};

SB2.Animator.prototype.displayStartAnimation = function(gameObjectFactory, onComplete, context){
    var startInfoTween, startInfoPanel, startInfoText;

    /* Create the panel, white background, bordered. It starts outside the screen and will be tweened inside */
    startInfoPanel = SB2.TextUtils.createBorderedPanel(gameObjectFactory, SB2.WIDTH, SB2.HEIGHT / 4);
    startInfoPanel.y = SB2.HEIGHT / 8; 

    /* Let's add also some text - User experience ++ :O */
    startInfoText = SB2.TextUtils.createText(gameObjectFactory, 
        "Ready ?", 
        { style: SB2.TextUtils.STYLES.TITLE, 
          y: 2 * SB2.HEIGHT / 8 + 20 }
    );        
    
    /* Now, handle properly animations of panel */
    startInfoTween = gameObjectFactory.tween(startInfoPanel);
    startInfoTween.from({x: SB2.WIDTH}, 500, Phaser.Easing.Quadratic.Out, true);
    startInfoTween.onComplete.add(function(){
        startInfoTween = gameObjectFactory.tween(startInfoPanel);
        startInfoTween.delay(300);
        startInfoTween.to({x: -SB2.WIDTH}, 300, Phaser.Easing.Quadratic.Out, true);
    });

    /* And also animations of the text */
    startInfoTween = gameObjectFactory.tween(startInfoText);
    startInfoTween.from({x: 0}, 800, Phaser.Easing.Exponential.Out, true);
    startInfoTween.onComplete.add(function(){
        startInfoText.text = "Go !";
        gameObjectFactory.tween(startInfoText).to({alpha: 0}, 700, Phaser.Easing.Linear.None, true);
        gameObjectFactory.tween(startInfoText.scale).to({x: 2, y: 2}, 700, Phaser.Easing.Quadratic.Out, true);
        onComplete.call(context);
    }, this);

    return true;
};