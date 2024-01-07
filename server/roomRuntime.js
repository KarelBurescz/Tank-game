import { Solider } from "../model/solider.js";

/**
 * Keeps the game mechanics and the game objects for a single room.
 *
 * @typedef { Object } RoomRuntime
 * @property { Map<Number,Solider> } playerSoliders - A KV store for the the game objects representing the players. Tke key is the object's ID.
 *
 *
 */

class RoomRuntime {
  /**
   * @constructor
   *
   */
  constructor() {
    this.playerSoliders = new Map();
  }

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
      solider.playerId = player.socket.id;
      this.playerSoliders.set(solider.id, solider);
    }

    return solider.id;
  }

  removePlayer(socket) {
    for (const [id, sol] of this.playerSoliders) {
      if (sol.playerId === socket.id) {
        this.playerSoliders.delete(id);
      }
    }
  }

  getInfo() {
    let str = "";
    str += `    RoomRuntime, num of players: ${this.playerSoliders.size}\n`;
    for (const [k, v] of this.playerSoliders) {
      str += `      solider: { id: ${v.id}, playerId: ${v.playerId}}\n`;
    }
    return str;
  }
}

export { RoomRuntime };
