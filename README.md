# Swap Box Reloaded 

_Swap Box Reloaded_ is an attempt to extend the unique gameplay of
_Swap Box Turbo_, an original game by _Nifflas_. The game is playable
in browser and requires two players in order to steer two cubes among
platforms and obstacles. The gameplay and controls are quite ordinary,
except that every two seconds, controls are swapped. That is to say
the cube controlled by one player becomes the cube controlled by the
other. Apart from that the game is a platform-game with a horizontal
auto-scrolling that force players to go forward.

The game is still in development. We are two students working on our
free-time, trying to improve and refactor the game in order to keep it
programmatically correct. The game is playable directly
[here](http://soreine.github.io/swap-box-reloaded/) (by the way, it is
really hard to play alone!).

## Characteristics

* The game is playable in the browser (_Chrome_ or _Firefox_
  preferred), with both players sharing one keyboard.
* Sounds and visual hints help players to follow the rhythm.
* All levels are potentially infinite. They are generated
  automatically according to a seed, and can be re-generated
  identically from the seed. The variety of levels is easily
  expandable because of the concept of biomes.
* The game is cooperative, the score is common to both player and
  depends of the travelled distance.
* Colorblind friendly! :D
    
## Technologies

* _Swap Box Reloaded_ uses the [Phaser.js](http://phaser.io/) game
  engine which relies on the WebGL renderer
  [Pixi.js](http://www.pixijs.com/)
* The game is entirely made in JavaScript and needs to be
  executed client-side.
