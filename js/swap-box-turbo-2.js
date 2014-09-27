var Phaser;
// Encapsulate all the game in a function scope
(function () {
    "use strict";


    // -----------------------------------------------------------------------------
    // Prototypes (or classes)
    // -----------------------------------------------------------------------------

    /** A class representing a player entity. Manage its state,
     * controls, and reference its game object
     * @param {Number} x 
     * @param {Number} y
     * @return A newly created player at the position x,y */
    function Player(x, y) {
	/** State of the player */
	this.state = Player.STATES.STANDING;
	
	/** Reference to its sprite */
	this.sprite = game.add.image(x, y, 'plain');
	// Set its size
	this.sprite.scale.setTo(UNIT,UNIT);
	//  Enable physics on the player
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	//  Player physics properties.
	this.sprite.body.gravity.y = GRAVITY;
	this.sprite.body.collideWorldBounds = true;
	
	/** The controls object */
	this.controls = undefined;
    }

    /** Possible states for a player */
    Player.STATES = {
	/* When idle or walking */
	STANDING:0,
	/* When in the air, like jumping */
	AIRBORNE:1,
	/* When dead */
	DEAD:2
    };

    Player.prototype = {
	/** Update the player entity, reading inputs and all... */
	update: function () {
	    // TODO
	}
    };

    // -----------------------------------------------------------------------------
    // Constants, parameters
    // -----------------------------------------------------------------------------

    /** The assets folder */
    var ASSETS = "/js/assets/",

    /** The base distance unit for the game. Equivalent to the size of
     * the player's cubes */
	UNIT = 30,

    /** The resolution of the game window */
	WIDTH = 800,
	HEIGHT = 600,

    /** The colors used in the game */
	COLOR = {
	/** The background color */
	BACKGROUND:0xeeeeee
    },

    /** The gravity acceleration */
	GRAVITY = 500,

    // -----------------------------------------------------------------------------
    // Global Variables
    // -----------------------------------------------------------------------------

    /** The game instance */
	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '',
			       {preload: preload, create: create, update: update}),
	
	/** This group contains all the solid and fixed platforms */
	platforms,

	/** References to the players objects */
	player1,
	player2;
    
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
	

	// Initialize this player entity
	player1 = new Player(WIDTH/2, HEIGHT/2);



	 /*
	 //  Our two animations, walking left and right.
	 player.animations.add('left', [0, 1, 2, 3], 10, true);
	 player.animations.add('right', [5, 6, 7, 8], 10, true);

	 //  Finally some stars to collect
	 stars = game.add.group();

	 //  We will enable physics for any star that is created in this group
	 stars.enableBody = true;

	 //  Here we'll create 12 of them evenly spaced apart
	 for (var i = 0; i < 12; i++)
	 {
         //  Create a star inside of the 'stars' group
         var star = stars.create(i * 70, 0, 'star');

         //  Let gravity do its thing
         star.body.gravity.y = 300;

         //  This just gives each star a slightly random bounce value
         star.body.bounce.y = 0.7 + Math.random() * 0.2;
	 }

	 //  The score
	 scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

	 //  Our controls.
	 cursors = game.input.keyboard.createCursorKeys();
	 
	 */
    }

    function update() {
    }
    
})();
