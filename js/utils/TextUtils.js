/* global SB2 */
/* global Phaser */
"use strict";
SB2.TextUtils = { };

SB2.TextUtils.COLORS = {
    GRAY: 0x333333,
    YELLOW: 0xfbab1f,
    BLUE: 0x1989f1,
    WHITE: 0xffffff
};

SB2.TextUtils.STYLES = {
    TITLE: {font: "bold 70px Helvetica", align: "center" },
    NORMAL: {font: "30px Helvetica", align: "center" }
};

SB2.TextUtils.createBorderedPanel = function(gameObjectFactory, width, height, options){
    var options, panel, borderTopY, borderBotY;

    /* Handle options */
    options = options || {};
    options.borderColor         = options.borderColor       || SB2.TextUtils.COLORS.GRAY;
    options.borderOpacity       = options.borderOpacity     || 1;
    options.borderThickness     = options.borderThickness   || 15; 
    options.borderType          = options.borderType        || "inner"; //inner / center / outer

    /* Create a simple pannel */
    panel = SB2.TextUtils.createPanel.apply(null, arguments);

    /* Add a border */
    panel.beginFill(options.borderColor, options.borderOpacity);
    borderTopY = 0; borderBotY = height;
    if ( options.borderType == "inner" ){
        borderTopY += options.borderThickness;
        borderBotY -= options.borderThickness;
    }
    if ( options.borderType == "center" ){
        borderTopY += options.borderThickness / 2;
        borderBotY -= options.borderThickness / 2;
    }
    panel.drawRect(0, borderTopY, width, options.borderThickness); // Border Top
    panel.drawRect(0, borderBotY, width, options.borderThickness); // Border Bot
    panel.endFill();

    return panel;
};

SB2.TextUtils.createPanel = function(gameObjectFactory, width, height, options){
    var options, panel;

    /* Handle options */
    options = options || {};
    options.backgroundColor     = options.backgroundColor   || SB2.TextUtils.COLORS.WHITE;
    options.backgroundOpacity   = options.backgroundOpacity || 1;

    /* Create a panel as a graphic object */
    panel = gameObjectFactory.graphics(0,0);
    panel.beginFill(options.backgroundColor, options.backgroundOpacity);
    panel.drawRect(0, 0, width, height);
    panel.endFill();

    return panel;
};


SB2.TextUtils.createText = function(gameObjectFactory, content, options){
    var options, text;

    /* Handle options */
    options         = options       || {};
    options.x       = options.x     || "center";
    options.y       = options.y     || "center";
    options.style   = options.style || SB2.TextUtils.STYLES.NORMAL;
    options.color   = options.color || SB2.TextUtils.COLORS.GRAY;

    if ( options.x == "center" ) { options.x = SB2.WIDTH / 2; }
    if ( options.y == "center" ) { options.y = SB2.HEIGHT / 2; }
    options.style.fill = "#333333";

    /* Create and return the text object */
    text = gameObjectFactory.text(options.x, options.y, content, options.style);
    text.anchor.set(0.5);

    return text;
}
