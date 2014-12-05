/* global SB2 */
/* global Phaser */
"use strict";

/* Instanciate a new pseudo-random generator
* @param {String} phraseSeed Seed of the pseudo-random generator
*/
SB2.Randomizer = function (seed) {
    this._seed = seed;
    this.activeSeed = seed;
};

SB2.Randomizer.prototype = {
    /** Generate a random number between 0 and 1 */
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
    },

    /** Generate a random int between inf and sup included
    * @param {Number} inf Inf bound as int
    * @param {Number} sup Sup bound as int
    */
    randBetween: function(inf, sup) {
        return Math.floor(this.rand()*(sup-inf) + inf) + 1;
    },

    /** Generate a seed */    
    genSeed: function() {
        return this.randBetween(100000, 500000);
    },

    /** Generate a new seed from a string sentence
    * @param {String} key Key used to build the seed
    */
    genSeedFromPhrase: function(key) {
        var seed, i;

        seed = 0;
        for(i = 0; i < key.length; i++){
            seed += Math.pow(key.charCodeAt(i)*(i+1) % 14, 14) % 14000 ;
        }
        return seed;
    },

};
