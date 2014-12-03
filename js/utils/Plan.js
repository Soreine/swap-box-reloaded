/* global SB2 */
/* global Phaser */
"use strict";

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
// Methods
//-----------------------------------------------------------------------

/** Return a copy of this Plan */
SB2.Plan.prototype.copy = function () {
    var copy = new SB2.Plan(this.width, this.height);
    copy.map = this.map.map(function (value) {return value;});
    return copy;
};

/** Use fill rather than setMap */
SB2.Plan.prototype.set = function (x, y, value) {
    this.map[x + this.width*y] = value;
};

SB2.Plan.prototype.get = function (x, y) {
    return this.map[x + this.width*y];
};

/** Fill the given rectangle with a type of element. If the width and height
 * (optional) are not supplied, it defaults to a rectangle
 * of size 1.
 * @param {Number} value The type of the element to add
 * @param {Number} x Top-left corner x-coordinate 
 * @param {Number} y Top-left corner y-coordinate 
 * @param {Number} width (default = 1) Width of the rectangle  
 * @param {Number} height (default = 1) Height of the rectangle  */
SB2.Plan.prototype.fill = function (value, x, y, width, height) {
    width = width || 1;
    height = height || 1;

    for (var j = y, endY = y + height; j < endY; j++) {
        for (var i = x, endX = x + width; i < endX; i++) {
            this.set(i, j, value);
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
            result += repr.charAt(this.get(x, y));
        }
        result += "\n";
    }
    return result;
};



/** Return a collection of rectangle that need to be filled with a
 * given value in order to reproduce the original Plan. A rectangle is
 * an object {x, y, width, height, value}. */
SB2.Plan.prototype.optimise = function () {
    var val,
        rect,
        result = [],
        // Create a copy of this plan
        copy = this.copy();
    
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            val = copy.get(x, y);
            if(val != 0) {
                // Create a 1x1 rectangle
                rect = {x: x, y:y, width:1, height:1, value:val};
                // Extend it to the maximum
                // Vertically
                rect = copy.extendVertically(rect);
                // Horizontally
                rect = copy.extendHorizontally(rect);
                // Remove all the block that are covered by the
                // rectangle
                copy.clear(rect.x, rect.y, rect.width, rect.height);
                // Add the rectangle to the list
                result.push(rect);
            }
        }
    }
    return result;
};


/** Return true if the given rectangle contains only the given value */
SB2.Plan.prototype.onlyContains = function (x, y, width, height,
                                            value) {
    var isInside = function (number, min, max) {
        return (number < max && number > min);
    };
    var endX = x + width;
    var endY = y + height;

    var inside = (isInside(x, 0, this.width) &&
                  isInside(y, 0, this.height) &&
                  isInside(endX - 1, 0, this.width) &&
                  isInside(endY - 1, 0, this.height));
    if(!inside) {
        return false;
    }
    
    for (var j = y; j < endY; j++) {
        for (var i = x; i < endX; i++) {
            if(value != this.get(i, j))
                return false;
        }
    }
    
    return true;
};


/** Extend the rectangle vertically while it cover only the same
 * values */
SB2.Plan.prototype.extendVertically = function (rectangle) {
    var rect = rectangle;
    while (this.onlyContains(rect.x,
                             rect.y + rect.height,
                             rect.width,
                             1, 
                             rect.value)) {
        rect.height += 1;
    }
    return rect;
};

/** Extend the rectangle horizontally while it cover only the same
 * values */
SB2.Plan.prototype.extendHorizontally = function (rectangle) {
    var rect = rectangle;
    while (this.onlyContains(rect.x + rect.width,
                             rect.y,
                             1,
                             rect.height, 
                             rect.value)) {
        rect.width += 1;
    }
    return rect;
};
