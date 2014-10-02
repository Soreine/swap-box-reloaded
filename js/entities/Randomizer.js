/* global SB2 */
/* global Phaser */
"use strict";

/* Instanciate a new pseudo-random generator
* @param {seed} seed Seed of the pseudo-random generator
*/
SB2.Randomizer = function (seed) {
    this._seed = seed;
    this.activeSeed = seed;
};

SB2.Randomizer.prototype = {
    /** Generate a random number between 0 and 1 
    */
    rand: function() {
        var M;

        function fibo(xpp, xp, n) {
            if (n > 0) {
                return fibo(xp, (xp+xpp) % M, n - 1);
            } else {
                return xp;
            }
        }

        M = 14141414;
        
        this.activeSeed = fibo(this.activeSeed, this.activeSeed, 25);
        return this.activeSeed / M;
    }
};
