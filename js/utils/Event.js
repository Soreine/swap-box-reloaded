/* global SB2 */
/* global SB2 */
/* global Phaser */
"use strict";


/** Initialize an event
 * @param {number} id Identifier of the event, cf SB2.Events
 * @param {object} <optional> data Complementary data to communicate
 */
SB2.Event = function(id, data){
    data = data || {};
    this.id = id;
    for(var key in data){
        if(key != "id"){
            this[key] = data[key];
        }
    }
};

/** All events that could be triggered */
SB2.EVENTS = {};
["SWAP", "SWAP_TICK"].forEach(function(elem, id){
    SB2.EVENTS[elem] = id;
});
