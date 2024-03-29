/**
 * Represents a basic model for all objects modeled on the server side.
 * @property {RoomRuntime} game - The roomRuntime instance this object belongs to.
 * @property {number} ssp.id - Server side id for client-server identity identification.
 * @property {number} ssp.x - The x-coordinate of the object in the game world.
 * @property {number} ssp.y - The y-coordinate of the object in the game world.
 * @property {number} ssp.width - The width of the object.
 * @property {number} ssp.height - The height of the object.
 * @property {number} ssp.hp - The health points of the object.
 */
class ModelObject {
  static lastId = 0; // Static variable to keep track of the last assigned ID, across all ModelObjects.

  /**
   * Creates a new ModelObject instance.
   * @param {RoomTime} game - The game instance this object belongs to.
   * @param {number} x - The x-coordinate of the object in the game world.
   * @param {number} y - The y-coordinate of the object in the game world.
   * @param {number} width - The width of the object.
   * @param {number} height - The height of the object.
   * @param {number} hp - The health points of the object.
   */

  constructor(game, x, y, width, height, hp, zIndex = 0) {
    this.game = game; // Game instance reference
    this.zIndex = 0;

    this.ssp = {
      id: ModelObject.lastId++, //for identification for client side.
      x: x, // x-coordinate
      y: y, // y-coordinate
      width: width, // Object width
      height: height, // Object height
      hp: hp, // Health points
      exploding: false,
      numHits: 0, //How many times the object was hit
      type: "none", // Type of the object
      movable: false,
      zIndex: 0,
      version: 0,
    };

    this.csp = {};

    Object.seal(this.ssp);
    Object.seal(this.csp);
    // Object.seal(this);
  }

  interpolateInTime(targetModelSSP, thisModelTime, dt, targetModelTime) {

    if (this.ssp.type !== targetModelSSP.type) {
      throw Error('Only two objects with the same type can be interpolated');
    }

    if (Math.abs(thisModelTime - targetModelTime) < 1e-3) {
      return this;
    }

    //Interpolate position in time.
    this.ssp.x = this.ssp.x + (targetModelSSP.x - this.ssp.x) * dt / (targetModelTime - thisModelTime);
    this.ssp.y = this.ssp.y + (targetModelSSP.y - this.ssp.y) * dt / (targetModelTime - thisModelTime);

    return this;
  }

  /**
   * Updates the state of the object in time. Typically called each game tick.
   */
  update() {
    if (this.ssp.hp <= 0) {
      this.explode();
    }
  }

  receiveHit(damage) {
    this.ssp.hp -= damage;
    this.ssp.numHits++;
  }

  updateCsp(csp) {
    try {
      let update = JSON.parse(csp);
      this.csp = {
        ...this.csp,
        ...update,
      };
    } catch (e) {
      console.log(`Error parsing CSP: ${csp}`);
    }
  }

  /**
   * Handles the destruction of the object. Placeholder for removal logic.
   */
  explode() {
    this.game.removeObject(this.ssp.id);
  }

  /**
   * Computes and returns the collision box of the object.
   * @return {{x: number, y: number, w: number, h: number}} The collision box of the object.
   */
  collisionBox() {
    return {
      x: this.ssp.x,
      y: this.ssp.y,
      w: this.ssp.width,
      h: this.ssp.height,
    };
  }

  /**
   * Checks if this object collides with another object.
   * @param {ModelObject} modelObject - Another object to check collision with.
   * @return {boolean} True if there is a collision, false otherwise.
   */
  collides(modelObject) {
    if (modelObject === this) return false;

    const cbx = this.collisionBox();
    const element = modelObject.collisionBox();

    if (cbx.x + cbx.w < element.x) return false;
    if (cbx.x > element.x + element.w) return false;
    if (cbx.y + cbx.h < element.y) return false;
    if (cbx.y > element.y + element.h) return false;

    return true;
  }

  getSerializable() {
    return this.ssp;
  }
}

export { ModelObject };
