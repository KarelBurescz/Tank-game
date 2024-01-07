import { Player } from "./player.js";
import { Room } from "./room.js";

/**
 * @typedef { Object } ServerGame
 * @property {Array<Room>} rooms - A list of rooms where the games happen.
 * @property {Array<Player>} players - A list of players that are connected to the server.
 */

class ServerGame {
  constructor() {
    this.rooms = [];
    this.players = [];
  }

  /**
   * Adds a new player to the game if does not exist yet.
   *
   * @param {socket.io.socket} socket - An instance of a socket of socket.io, result of a connection of a client.
   * @returns {boolean} - True if a new player was created. False otherwise.
   */
  acceptOrUpdateConnection(socket) {
    let p = this.getOrCreatePlayer(socket);
    this.players.push(p);
  }

  /**
   *
   * @param {socket.io} socket - A socket of a player that intends to connect.
   * @param {String} roomId - An ID (name) of a room.
   */
  playerJoinRoom(player, roomId) {
    let r = this.getOrCreateRoomById(roomId);
    if (!r) {
      r = new Room(roomId);
      this.rooms.push(r);
    }

    r.playerJoinRoom(player);
  }

  /**
   *
   * @param {String} roomId - an ID of the searched room.
   * @returns {Room} - an existing or newly created instance of the room.
   */
  getOrCreateRoomById(roomId) {
    const r = this.rooms.filter((r) => r.id == roomId);
    if (r.length === 0) {
      let r1 = new Room(roomId);
      this.rooms.push(r1);
      return r1;
    }

    return r[0];
  }

  /**
   * Searches for the Player based on his socket ID.
   *
   * @param {socket.io.socket} socket - an identifier of the Player. It is his socket.id value.
   * @returns {Player} The instance a player searched, or null if none found.
   */
  getOrCreatePlayer(socket) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].socket.id === socket.id) {
        return this.players[i];
      }
    }
    return new Player(socket);
  }

  /**
   * Removes the connected player from the game.
   *
   * @param {socket.io.socket} socket - a socket of the player which disconnects.
   */
  removePlayer(socket) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].socket.id === socket.id) {
        this.players.splice(i, 1);
      }
    }
    this.rooms.forEach((r) => r.removePlayer(socket));
  }
}

export { ServerGame };
