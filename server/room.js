import { RoomRuntime } from "./roomRuntime.js";
import { Player } from "./player.js";

/**
 * @typedef { Object } Room
 * @property {String} id - An ID of a room, can be any string.
 * @property {Array<Player>} players - A list of Players that joined the room.
 */

/**
 * Represents a room (one world where a fight of players happens)
 *
 */
class Room {
  /**
   * @constructor
   * @param {String} id - An ID of a room, can be any string.
   */
  constructor(id) {
    this.id = id;
    this.players = [];
    this.roomRuntime = new RoomRuntime();
  }

  /**
   * Adds a player to the room if does not exist yet.
   * @param {Player} player to join the room.
   * @returns {boolean} true if player was added, false if the player already is added.
   */
  playerJoinRoom(player) {
    if (!this.getPlayer(player.socket)) {
      this.players.push(player);
    }

    const id = this.roomRuntime.createSoliderIfNotExists(player);
    player.modelObjectId = id;
  }

  /**
   * Returns a player in the room, based on the socket.
   *
   * @param {socket.io.socket} socket
   * @returns {Player | null} - Returns a player if exists in the room, null otherwise.
   */
  getPlayer(socket) {
    const pls = this.players.filter((p) => p.socket.id === socket.id);
    if (pls.length === 0) return null;
    return pls[0];
  }

  /**
   * Removes a player from a room, based on his socket.
   * @param {socket.io.socket} socket of a player to be removed.
   */
  removePlayer(socket) {
    this.players = this.players.filter((p) => p.socket.id !== socket.id);
    this.roomRuntime.removePlayer(socket);
  }
}

export { Room };
