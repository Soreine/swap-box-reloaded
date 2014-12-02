/* global SB2 */
/* global Phaser */
"use strict";


/** Initialize an event
* @param {number} id Identifier of the event, cf SB2.Events
* @param {object} <optional> data Complementary data to communicate
*/
SB2.Event = function(id, data ={}){
    this.id = id; 
    this.data = data; 
};

/** All events that could be triggered */
SB2.Events = {};
["UPDATE", "RESET", "INIT"].forEach(function(elem, id){
    SB2.Events[a] = id;
});
