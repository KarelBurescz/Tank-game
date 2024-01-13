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
  
  constructor(game, x, y, width, height, hp) {
    this.id = ModelObject.lastId++; // Unique identifier for the object

    this.game = game; // Game instance reference
    
    this.ssp = {
      id: this.id, //for identification for client side.
      x: x, // x-coordinate
      y: y, // y-coordinate
      width: width, // Object width
      height: height, // Object height
      hp: hp, // Health points
      type: "none", // Type of the object
    };

    this.csp = {};
  }

  /**
   * Updates the state of the object in time. Typically called each game tick.
   */
  update() {
    if (this.ssp.hp <= 0) {
      this.explode();
    }
  }

  updateCsp(csp) {
    console.log(`Updating CSP: ${csp}`);
    try {
      let update = JSON.parse(csp);
      this.csp = {
        ...this.csp, 
        ...update,
      }
    } catch (e) {
      console.log(`Error parsing CSP: ${csp}`);
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
    const cbx = this.collisionBox();
    const element = modelObject.collisionBox();

    if (cbx.x + cbx.w < element.x) return false;
    if (cbx.x > element.x + element.w) return false;
    if (cbx.y + cbx.h < element.y) return false;
    if (cbx.y > element.y + element.h) return false;

    return true;
  }

  getSerializable(){
    return this.ssp;
  }
}

export { ModelObject };
