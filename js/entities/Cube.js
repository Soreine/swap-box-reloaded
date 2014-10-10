/* global SB2 */
/* global Phaser */
"use strict";

/** An object representing a player controlled cube. Manage its
 * state, and reference its game object
 * @extends {Phaser.Sprite}
 * @param {Number} x 
 * @param {Number} y
 * @param {Controls} controls The controls object for this cube
 * @param {Number} kind Defines the appearance of the cube
 * @return A newly created cube at the position x,y */
SB2.Cube = function (game, x, y, controls, kind) {
    var cube = this;
    // Call super constructor
    Phaser.Sprite.call(this, game, x, y, 'plain');
    game.add.existing(this);

    // Set its size
    this.scale.setTo(SB2.UNIT,SB2.UNIT);
    this.anchor = {x:0.5, y:0.5};

    /** State of the cube */
    this.state = this.AIRBORNE;

    //  Enable physics on the cube
    game.physics.arcade.enable(this);

    //  Cube physics properties.
    this.body.gravity.y = SB2.GRAVITY;
    this.body.collideWorldBounds = true;

    /** The controls */
    this.controls = controls;
    
    /** The sprite that represent the spirit of the cube */
    this.spirit = game.add.sprite(x, y, 'spirits', kind);
    this.spirit.anchor = {x:0.5, y:0.5};
};

SB2.Cube.prototype = Object.create(Phaser.Sprite.prototype);
SB2.Cube.prototype.constructor = SB2.Cube;

/** Update the state of the cube, then handle inputs */
SB2.Cube.prototype.myUpdate = function () {
    switch(this.state) {

    case this.DEAD:
        break;

    case this.DYING:
        var anim = this.death.animations;
        // Update the death animation
        this.death.frameCount++;
        if(this.death.frameCount > this.death.framerate) {
            this.death.frameCount = 0;
            if(this.death.reverse) {
                // Go reverse
                if(anim.currentFrame.index == 0) {
                    this.death.destroy();
                    this.state = this.DEAD;
                } else {
                    anim.previous();
                }
            } else {
                // Go forward
                if(anim.currentFrame.index == anim.frameTotal - 1) {
                    // Hide the cube
                    this.kill();
                    this.spirit.kill();
                    this.death.reverse = true;
                } else {
                    anim.next();
                }
            }
        }
        break;


    case this.STANDING:
    case this.AIRBORNE:
        // Update state
        if(this.body.touching.down) {
            this.state = this.STANDING;
            this.rotation = 0;
        } else {
            this.state = this.AIRBORNE;
            this.rotation += this.ROTATION_SPEED;
        }

        // Update spirit
        this.spirit.x = this.body.x + this.body.width/2;
        this.spirit.y = this.body.y + this.body.height/2;
        
        // Handle inputs
        this.handleInputs();
        break;
    }
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
    } else {
        // Reset speed
        this.body.velocity.x = 0;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (this.state != this.AIRBORNE && this.controls.up.isDown) {
        this.body.velocity.y = SB2.JUMP_SPEED;
    }
};

/** Stop the cube and start its death animation
 * @param A reference to the game */
SB2.Cube.prototype.die = function (game) {
    // Oh no i'm dying :(
    this.state = this.DYING;

    // Create death animation
    var death = this.game.add.sprite(this.body.x + this.width/2,
                                     this.body.y + this.height/2,
                                     'death');
    death.anchor = {x:0.5, y:0.5};
    death.scale.setTo(3, 3);
    death.rotation = this.rotation;
    death.frameCount = 0;
    death.framerate = 1;
    death.reverse = false;
    death.animations.add('die');

    this.death = death;
    // Pause the cube
    this.body.velocity = {x:0, y:0};
    this.velocity = {x:0, y:0};
    this.body.allowGravity = false;
};

SB2.Cube.swap = function (cube1, cube2) {
    // For swapping
    var temp;
    // Swap controls
    temp = cube1.controls;
    cube1.controls = cube2.controls;
    cube2.controls = temp;
    // Swap spirit kind
    temp = cube1.spirit.frame;
    cube1.spirit.frame = cube2.spirit.frame;
    cube2.spirit.frame = temp;
};


/** Possible states for a cube */
/** When idle or walking */
SB2.Cube.prototype.STANDING = 0;
/** When in the air, like jumping */
SB2.Cube.prototype.AIRBORNE = 1;
/** When dying */
SB2.Cube.prototype.DYING = 2;
/** When dead */
SB2.Cube.prototype.DEAD = 3;

/** Rotation speed when airborne */
SB2.Cube.prototype.ROTATION_SPEED = Math.PI*0.0167/SB2.JUMP_DURATION 
// Frontflip !
