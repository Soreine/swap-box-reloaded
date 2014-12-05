/* global SB2 */
/* global Phaser */
"use strict";

/** This will handle all event and event's handlers/listeneners 
*/
SB2.EventManager = function(){
    this.listeners = {};
};

SB2.EventManager.prototype = {
    /* Bind an listener to a specific event 
    * @param {Event} event The related event
    * @param {Function} handler The event's listener
    */
    on: function(eventId, handler, caller) {
        this.listeners[eventId] =  this.listeners[eventId] || [];
        this.listeners[eventId].push({
            handler: handler,
            caller: caller
        });
    },

    /* Trigger the event to all listener
    * @param {Event} event The related event
    */
    trigger: function(event) {
        this.listeners[event.id].forEach(function(listener){
            listener.handler.call(listener.caller, event);
        });
    },
};

