/* global SB2 */
/* global Phaser */
"use strict";

/* Instanciate a new pseudo-random generator
* @param {seed} seed Seed of the pseudo-random generator
*/
SB2.Randomizer = function (seed) {
    this._seed = seed;
    this.activeSeed = seed;
}

SB2.Randomizer.prototype = {
    /** Generate a random number between 0 and 1 
    */
    rand: function() {
        var fibo, M;
        M = 14141414;
        fibo = function(xpp, xp, n){
            if (n > 0) {
                return fibo(xp, (xp+xpp) % M, n - 1);
            } else {
                return xp;
            }
        }

        this.activeSeed = fibo(this.activeSeed, this.activeSeed, 25);
        return this.activeSeed / M;
    }
}