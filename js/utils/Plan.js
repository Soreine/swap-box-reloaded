/* global SB2 */
/* global Phaser */
"use strict";

var SB2 = {};

/** This class represent a plan, or map for a level. This is used for
 * level generation.
 * @param {Number} width The width of the plan in units
 * @param {Number} height The height of the plan in units */
SB2.Plan = function (width, height) {
    this.height = height;
    this.width = width;
    /** A 2D-array of numbers. Each value represent a type of
     * platform. 0 is empty */
    this.map = new Array(height*width);
    for(var i = 0; i < (height*width); i++) {
        this.map[i] = 0;
    };
};


//-----------------------------------------------------------------------
// Private
//-----------------------------------------------------------------------
SB2.Plan.prototype.setMap = function (x, y, value) {
    this.map[x + this.width*y] = value;
};
SB2.Plan.prototype.getMap = function (x, y) {
    return this.map[x + this.width*y];
};

//-----------------------------------------------------------------------
// Methods
//-----------------------------------------------------------------------
/** Fill the given rectangle with a type of element. If the width and height
 * (optional) are not supplied, it defaults to a rectangle
 * of size 1.
 * @param {Number} value The type of the element to add
 * @param {Number} x Top-left corner x-coordinate 
 * @param {Number} y Top-left corner y-coordinate 
 * @param {Number} width (default = 1) Width of the rectangle  
 * @param {Number} height (default = 1) Height of the rectangle  */
SB2.Plan.prototype.fill = function (value, x, y, width, height) {
    // Default x2 and y2 to the value of x and y
    width = width || 1;
    height = height || 1;
    
    for (var j = y, endY = y + height; j < endY; j++) {
        for (var i = x, endX = x + width; i < endX; i++) {
            this.setMap(i, j, value);
        }
    }
};

/** Clear an area */
SB2.Plan.prototype.clear = function (x, y, width, height) {
    this.fill(0, x, y, width, height);
};

/** Return a string representation of a plan made from up to 26
 * different types */
SB2.Plan.prototype.toString = function () {
    var result = "";
    var repr = ".OXABCDEFGHIJKLMNPQRSTUVWYZ";

    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            result += repr.charAt(this.getMap(x, y));
        }
        result += "\n";
    }
    return result;
};


