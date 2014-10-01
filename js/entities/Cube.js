/* global SB2 */
/* global Phaser */
"use strict";

/** An object representing a player controlled cube. Manage its
 * state, and reference its game object
 * @extends {Phaser.Sprite}
 * @param {Number} x 
 * @param {Number} y
 * @param {Controls} controls The controls object for this cube
 * @return A newly created cube at the position x,y */
SB2.Cube = function (game, x, y, controls) {
    // Call super constructor
    Phaser.Sprite.call(this, game, x, y, 'plain');

    // Set its size
    this.scale.setTo(SB2.UNIT,SB2.UNIT);
    this.anchor = {x:0.5, y:0.5};

    /** State of the cube */
    this.state = SB2.Cube.STANDING;

    //  Enable physics on the cube
    game.physics.arcade.enable(this);

    //  Cube physics properties.
    this.body.gravity.y = SB2.GRAVITY;
    this.body.collideWorldBounds = true;

    /** The controls */
    this.controls = controls;
};

SB2.Cube.prototype = Object.create(Phaser.Sprite.prototype);
SB2.Cube.prototype.constructor = SB2.Cube;

/** Update the state of the cube, then handle inputs */
SB2.Cube.prototype.update = function () {
    // Update state
    if(this.body.touching.down) {
	this.state = this.STANDING;
	this.rotation = 0;
    } else {
	this.state = this.AIRBORNE;
	this.rotation += 0.2;
    }

    // Reset speed
    this.body.velocity.x = 0;
    // Handle inputs
    this.handleInputs();
},

/** Reads inputs and act consequently */
SB2.Cube.prototype.handleInputs = function () {

    // Reset speed
    if (this.controls.left.isDown) {
	//  Move to the left
	this.body.velocity.x = -SB2.LATERAL_SPEED;
    } else if (this.controls.right.isDown) {
	//  Move to the right
	this.body.velocity.x = SB2.LATERAL_SPEED;
    }	
    
    //  Allow the player to jump if they are touching the ground.
    if (this.state != this.AIRBORNE && this.controls.up.isDown) {
	this.body.velocity.y = -SB2.JUMP_SPEED;
    }
};

/** Possible states for a cube */
/** When idle or walking */
SB2.Cube.prototype.STANDING = 0;
/** When in the air, like jumping */
SB2.Cube.prototype.AIRBORNE = 1;
/** When dead */
SB2.Cube.prototype.DEAD = 2;

