import Asteroid from './asteroid';
import Bullet from './bullet';
import Ship from './ship';
import Util from './util';

// holds collections of objects in game
// key methods include step() - which calls move() on the collections.
  // checkCollisions() checks colliding objects,
  // and draw() which draws the game.

  class Game {
    constructor() {
      this.asteroids = [];
      this.bullets = [];
      this.ships = [];

      this.addAsteroids();
    }

    add(object) {
      if (object instanceof Asteroid) {
        this.asteroids.push(object);
      } else if (object instanceof Bullet) {
        this.bullets.push(object);
      } else if (object instanceof Ship) {
        this.ships.push(object);
      } else {
        throw "unknown type of object";
      }
    }

    addAsteroids() {
      for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
        this.add(new Asteroid({ game: this }));
      }
    }

    addShip() {
      const ship = new Ship({
        pos: this.randomPosition(),
        game: this
      });

      this.add(ship);

      return ship;
    }

    allObjects() {
      return [].concat(this.ships, this.asteroids, this.bullets);
    }

    checkCollisions() {
      const allObjects = this.allObjects();
      for (let i = 0; i < allObjects.length; i++) {
        for (let j = 0; j < allObjects.length; j++) {
          const obj1 = allObjects[i];
          const obj2 = allObjects[j];

          if (obj1.isCollidedWith(obj2)) {
            const collision = obj1.collideWith(obj2);
            if (collision) return;
          }
        }
      }
    }

    draw(ctx) {
      ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
      ctx.fillStyle = Game.BG_COLOR;
      ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

      this.allObjects().forEach((object) => {
        object.draw(ctx);
      });
    }

    isOutOfBounds(pos) {
      return (pos[0] < 0) || (pos[1] < 0) ||
        (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
    }

    moveObjects(delta) {
      this.allObjects().forEach((object) => {
        object.move(delta);
      });
    }

    randomPosition() {
      return [
        Game.DIM_X * Math.random(),
        Game.DIM_Y * Math.random()
      ];
    }

    remove(object) {
      if (object instanceof Bullet) {
        this.bullets.splice(this.bullets.indexOf(object), 1);
      } else if (object instanceof Asteroid) {
        this.asteroids.splice(this.asteroids.indexOf(object), 1);
      } else if (object instanceof Ship) {
        this.ships.splice(this.ships.indexOf(object), 1);
      } else {
        throw "unknown type of object";
      }
    }

    step(delta) {
      this.moveObjects(delta);
      this.checkCollisions();
    }

    wrap(pos) {
      return [
        Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
      ];
    }
  }

  Game.BG_COLOR = "#DFE6FF";
  Game.DIM_X = 400;
  Game.DIM_Y = 400;
  Game.FPS = 32;
  Game.NUM_ASTEROIDS = 10;


export default Game;
