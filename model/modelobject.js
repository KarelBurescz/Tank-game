/**
 * Represents a basic model for all objects modeled on the server side.
 * @typedef {Object} ModelObject
 */

class ModelObject {
  static lastId = 0; // Static variable to keep track of the last assigned ID, across all ModelObjects.

  /**
   * Creates a new ModelObject instance.
   * @param {Object} game - The game instance this object belongs to.
   * @param {number} x - The x-coordinate of the object in the game world.
   * @param {number} y - The y-coordinate of the object in the game world.
   * @param {number} width - The width of the object.
   * @param {number} height - The height of the object.
   * @param {number} hp - The health points of the object.
   */
  
  constructor(game, x, y, width, height, hp) {
    this.id = ModelObject.lastId++; // Unique identifier for the object
    
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.width = width; // Object width
    this.height = height; // Object height
    this.game = game; // Game instance reference
    this.hp = hp; // Health points
    this.type = "none"; // Type of the object

    this.serializableProperties = ["x", "y", "width", "height", "hp", "type"];
  }

  /**
   * Updates the state of the object in time. Typically called each game tick.
   */
  update() {
    if (this.hp <= 0) {
      this.explode();
    }
  }

  /**
   * Handles the destruction of the object. Placeholder for removal logic.
   */
  explode() {
    //TODO: remove the object from a global registry.
  }

  /**
   * Computes and returns the collision box of the object.
   * @return {{x: number, y: number, w: number, h: number}} The collision box of the object.
   */
  collisionBox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
    };
  }

  /**
   * Checks if this object collides with another object.
   * @param {ModelObject} uiobject - Another object to check collision with.
   * @return {boolean} True if there is a collision, false otherwise.
   */
  collides(uiobject) {
    const cbx = this.collisionBox();
    const element = uiobject.collisionBox();

    if (cbx.x + cbx.w < element.x) return false;
    if (cbx.x > element.x + element.w) return false;
    if (cbx.y + cbx.h < element.y) return false;
    if (cbx.y > element.y + element.h) return false;

    return true;
  }

  getSerializable(){
    let out = {};
    let k = Object.keys(this);
    for (let ks of this.serializableProperties) {
      if (ks in this) out[ks] = this[ks];
    }
    return out;
  }
}

export { ModelObject };
