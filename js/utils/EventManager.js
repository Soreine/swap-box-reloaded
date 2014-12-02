/* global SB2 */
/* global Phaser */
"use strict";

/** This will handle all event and event's handlers/listeneners 
*/
SB2.EventManager = function(){
    this.schedule = {};
};

SB2.EventManager.prototype = {
    /* Bind an listener to a specific event 
    * @param {Event} event The related event
    * @param {Function} handler The event's listener
    */
    on: function(event, handler) {
        // TODO! Check if handler is a function
        this.schedule[event.id] =  this.schedule[event.id] || [];
        this.schedule[event.id].push(handler);
    },

    /* Trigger the event to all listener
    * @param {Event}  event The related event
    * @param {[Object, ...]} <optional> All arguments to be pass with
    */
    askFor: function(event, args = {}) {
        // !TODO test the whole thing and add the data of the event to the args
        this.schedule[event.id].forEach(function(handler){
            handler.apply(
                arguments.callee.caller, 
                Array.prototype.slice.call(arguments, 1)
            );
        });
    },
};

