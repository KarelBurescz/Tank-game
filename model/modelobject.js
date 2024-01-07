/**
 * @typedef { Object } ModelObject - A basic model for all objects modelled on the server side.
 *
 *
 */

class ModelObject {
  static lastId = 0;

  constructor(game, x, y, width, height, hp) {
    this.id = ModelObject.lastId++;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.game = game;
    this.hp = hp;
    this.type = "none";
  }

  update() {
    if (this.hp <= 0) {
      this.explode();
    }
  }

  explode() {
    //TODO: remove the object from a global registry.
  }

  collisionBox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
    };
  }

  collides(uiobject) {
    const cbx = this.collisionBox();
    const element = uiobject.collisionBox();

    if (cbx.x + cbx.w < element.x) {
      return false;
    }

    if (cbx.x > element.x + element.w) {
      return false;
    }

    if (cbx.y + cbx.h < element.y) {
      return false;
    }

    if (cbx.y > element.y + element.h) {
      return false;
    }

    return true;
  }

  //   localCoords(camera) {
  //     return {
  //       y: this.y - camera.y,
  //       x: this.x - camera.x,
  //       // x : this.x,
  //       // y : this.y
  //     };
  //   }
}

export { ModelObject };
