import { Solider } from "../model/solider.js";

/**
 * Keeps the game mechanics and the game objects for a single room.
 *
 * @typedef { Object } RoomRuntime
 * @property { Map<Number, Solider> } playerSoliders - A key-value store for the game objects representing the players. The key is the object's ID.
 *
 */

class RoomRuntime {
  /**
   * Constructs a new instance of RoomRuntime.
   * Initializes an empty Map to store player soldiers.
   */
  constructor() {
    this.playerSoliders = new Map();
  }

  /**
   * Creates a solider for a player if it does not already exist.
   *
   * @param {Object} player - The player for whom a solider is to be created.
   * @returns {Number} The ID of the created or existing solider.
   */
  createSoliderIfNotExists(player) {
    let solider = null;

    for (const [k, v] of this.playerSoliders) {
      if (v.PlayerId === player.socket.id) {
        solider = v;
        break;
      }
    }

    if (solider === null) {
      solider = Solider.CreateOnRandomPosition(this);
      solider.playerSocketId = player.socket.id;
      this.playerSoliders.set(solider.id, solider);
    }

    return solider.id;
  }

  /**
   * Removes a player's solider from the room.
   *
   * @param {Object} socket - The socket object, based on which the removed solider is found.
   */
  removePlayer(socket) {
    for (const [id, sol] of this.playerSoliders) {
      if (sol.playerSocketId === socket.id) {
        this.playerSoliders.delete(id);
      }
    }
  }

  /**
   * Retrieves information about the current state of the room.
   *
   * @returns {String} A string representation of the current state of the room.
   */
  getInfo() {
    let str = "";
    str += `    RoomRuntime, num of players: ${this.playerSoliders.size}\n`;
    for (const [k, v] of this.playerSoliders) {
      str += `      solider: { id: ${v.id}, playerId: ${v.playerSocketId}}\n`;
    }
    return str;
  }
}

export { RoomRuntime };
