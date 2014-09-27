var Phaser;
// Encapsulate all the game in a function scope
(function () {
    "use strict";


    // -----------------------------------------------------------------------------
    // Prototypes (or classes)
    // -----------------------------------------------------------------------------

    /** A set of controls binding for a player
     * @param {Phaser.Key} up 
     * @param {Phaser.Key} down 
     * @param {Phaser.Key} right
     * @param {Phaser.Key} left
     */
    function Controls(up, down, right, left) {
	this.up = up;
	this.down = down;
	this.right = right;
	this.left = left;
    }

    
    /** An object representing a player controlled cube. Manage its
     * state, and reference its game object
     * @param {Number} x 
     * @param {Number} y
     * @param {Controls} controls The controls object for this cube
     * @return A newly created cube at the position x,y */
    function Cube(x, y, controls) {
	/** State of the cube */
	this.state = Cube.STATES.STANDING;

	/** Reference to its sprite */
	this.sprite = game.add.sprite(x, y, 'plain');
	// Set its size
	this.sprite.scale.setTo(UNIT,UNIT);
	//  Enable physics on the cube
	game.physics.arcade.enable(this.sprite);

	this.body = this.sprite.body;
	//  Cube physics properties.
	this.body.gravity.y = GRAVITY;
	this.body.collideWorldBounds = true;

	/** The controls */
	this.controls = controls;
    }

    /** Possible states for a cube */
    Cube.STATES = {
	/* When idle or walking */
	STANDING:0,
	/* When in the air, like jumping */
	AIRBORNE:1,
	/* When dead */
	DEAD:2
    };

    Cube.prototype = {
	/** Update the state of the cube, then handle inputs */
	update: function () {
	    // Update state
	    if(this.body.touching.down) {
		this.state = Cube.STATES.STANDING;
	    } else {
		this.state = Cube.STATES.AIRBORNE;
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
		this.body.velocity.x = -LATERAL_SPEED;
	    } else if (this.controls.right.isDown) {
		//  Move to the right
		this.body.velocity.x = LATERAL_SPEED;
	    }	
	    
	    //  Allow the player to jump if they are touching the ground.
	    if (this.state != Cube.STATES.AIRBORNE && this.controls.up.isDown) {
		this.body.velocity.y = -JUMP_SPEED;
	    }
	}
    };

    // -----------------------------------------------------------------------------
    // Constants, parameters
    // -----------------------------------------------------------------------------

    /** The assets folder */
    var ASSETS = "/js/assets/";

    /** The base distance unit for the game. Equivalent to the size of
     * the player's cubes */
    var UNIT = 30;

    /** The resolution of the game window */
    var WIDTH = 800;
    var HEIGHT = 600;

    /** The colors used in the game */
    var COLOR = {
	/** The background color */
	BACKGROUND:0xeeeeee
    };

    /** The gravity acceleration */
    var GRAVITY = 3000;
    /** Lateral movement speed for the cubes */
    var LATERAL_SPEED = 300;
    /** Jumping speed */
    var JUMP_SPEED = 1000;

    /** Swap period in millis */
    var SWAP_PERIOD = 2000;
	// -----------------------------------------------------------------------------
	// Global Variables
    // -----------------------------------------------------------------------------

    /** The game instance */
    var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '',
			       {preload: preload, create: create, update: update});
    
    /** This group contains all the solid and fixed platforms */
    var platforms;

    /** References to the cubes objects */
    var cube1;
    var cube2;

    /** The arrow keys */
    var cursors;

    /** Timer for controls swap */
    var swapTimer;
    
    // -----------------------------------------------------------------------------
    // Game Logic
    // -----------------------------------------------------------------------------

    function preload() {
	// This is a plain color texture
	game.load.image('plain', ASSETS + '1.png');
    }

    function create() {
	//  We're going to be using physics, so enable the Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Set the background color
	game.stage.backgroundColor = COLOR.BACKGROUND;
	
	//  Initialize the platforms group
	platforms = game.add.group(undefined, // No parent group
				   'platforms', // Name for debug
				   true, // Add directly to the stage
				   true, // Enable body
				   Phaser.Physics.ARCADE);

	// Here we create the ground.
	var ground = platforms.create(0, HEIGHT - 2*UNIT, 'plain');
	//  Scale it to fit the width of the game
	ground.scale.setTo(WIDTH, 2*UNIT);
	//  This stops it from falling away when you jump on it
	ground.body.immovable = true;
	


	// Initialize controls
	var kb = game.input.keyboard;
	var control1 = new Controls(kb.addKey(Phaser.Keyboard.FIVE),
				    null,
				    kb.addKey(Phaser.Keyboard.Y),
				    kb.addKey(Phaser.Keyboard.R));
	var control2 = new Controls(kb.addKey(Phaser.Keyboard.UP),
				    null,
				    kb.addKey(Phaser.Keyboard.RIGHT),
				    kb.addKey(Phaser.Keyboard.LEFT));


	// Initialize this player entity
	cube1 = new Cube(WIDTH/4, HEIGHT/2, control1);
	cube2 = new Cube(3*WIDTH/4, HEIGHT/2, control2);

	// Init timer
	swapTimer = game.time.now;
    }

    function update() {
	// Check the timer
	if(game.time.elapsedSince(swapTimer) > SWAP_PERIOD) {
	    // Swap controls
	    var controls = cube1.controls;
	    cube1.controls = cube2.controls;
	    cube2.controls = controls;
	    // Reset timer
	    swapTimer = game.time.now;
	}

	//  Collide the cubes with the platforms
	game.physics.arcade.collide(cube1.sprite, platforms);
	game.physics.arcade.collide(cube2.sprite, platforms);
	
	//  Checks to see if the both cubes overlap
	game.physics.arcade.overlap(cube1.sprite, cube2.sprite, 
				    function () {console.log('Death');},
				    null, this);	
	
	// Update cubes states
	cube1.update();
	cube2.update();
    }
    
})();
