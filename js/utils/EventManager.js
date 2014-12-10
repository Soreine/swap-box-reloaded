/* global SB2 */
/* global Phaser */
"use strict";

/** This will handle all event and event's handlers/listeneners
 */
SB2.EventManager = function(){
    this.listeners = {};
    this.ticketNum = 0;
};

SB2.EventManager.prototype = {
    /** Bind a listener to a specific event 
    * @param {Event} event The related event
    * @param {Function} handler The event's listener
    */
    on: function(eventId, handler, caller) {
        /* Stamp the caller, in order to find him again */
        if(!caller.uniqueEventManagerID){
            caller.uniqueEventManagerID = ++this.ticketNum;
        }

        this.listeners[eventId] =  this.listeners[eventId] || [];
        this.listeners[eventId].push({
            handler: handler,
            caller: caller
        });
    },

    /** Trigger the event to all listener
     * @param {Event} event The related event
     */
    trigger: function(event) {
        var listeners = this.listeners[event.id];
        if(listeners) {
            listeners.forEach(function(listener){
                listener.handler.call(listener.caller, event);
            });
        }
    },

    /** Unbind a listener from an event
    * @param {Number} eventId The Id of the related Event
    * @param {Object} caller The caller object that should be unbound
    */
    unbind: function(eventId, caller){
        /* First, find the listener */
        this.listeners[eventId] = this.listeners[eventId].filter(function(listener){
            listener.caller.uniqueEventManagerID != caller.uniqueEventManagerID;
        });
    }
};
