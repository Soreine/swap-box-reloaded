/* global SB2 */
/* global Phaser */
"use strict";

/** An object representing a player controlled cube. Manage its
 * state, and reference its game object
 * @param {Number} x 
 * @param {Number} y
 * @param {Controls} controls The controls object for this cube
 * @return A newly created cube at the position x,y */
SB2.Cube = function (game, x, y, controls) {
    /** State of the cube */
    this.state = SB2.Cube.STANDING;

    /** Reference to its sprite */
    this.sprite = game.add.sprite(x, y, 'plain');
    // Set its size
    this.sprite.scale.setTo(SB2.UNIT,SB2.UNIT);
    this.sprite.anchor = {x:0.5, y:0.5};

    //  Enable physics on the cube
    game.physics.arcade.enable(this.sprite);

    this.body = this.sprite.body;
    //  Cube physics properties.
    this.body.gravity.y = SB2.GRAVITY;
    this.body.collideWorldBounds = true;

    /** The controls */
    this.controls = controls;

    /** The tween that make them turn in the air */
    this.tween = game.add.tween(this.sprite);
}

/** Possible states for a cube */
/** When idle or walking */
SB2.Cube.STANDING = 0;
/** When in the air, like jumping */
SB2.Cube.AIRBORNE = 1;
/** When dead */
SB2.Cube.DEAD = 2;

SB2.Cube.prototype = {
    /** Update the state of the cube, then handle inputs */
    update: function () {
	// Update state
	if(this.body.touching.down) {
	    this.state = SB2.Cube.STANDING;
	    this.sprite.rotation = 0;
	} else {
	    this.state = SB2.Cube.AIRBORNE;
	    this.sprite.rotation += 0.2;
	}

	// Reset speed
	this.body.velocity.x = 0;
	// Handle inputs
	this.handleInputs();
    },
    
    /** Reads inputs and act consequently */
    handleInputs: function () {

	// Reset speed
	if (this.controls.left.isDown) {
	    //  Move to the left
	    this.body.velocity.x = -SB2.LATERAL_SPEED;
	} else if (this.controls.right.isDown) {
	    //  Move to the right
	    this.body.velocity.x = SB2.LATERAL_SPEED;
	}	
	
	//  Allow the player to jump if they are touching the ground.
	if (this.state != SB2.Cube.AIRBORNE && this.controls.up.isDown) {
	    this.body.velocity.y = -SB2.JUMP_SPEED;
	}
    }
};

