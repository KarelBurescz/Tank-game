import { RoomRuntime } from "./roomRuntime.js";
import { Player } from "./player.js";

/**
 * Represents a room (one world where a fight of players happens)
 * @property {String} id - An ID of a room, can be any string.
 * @property {Array<Player>} players - A list of Players that joined the room.
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

    this.stateUpdater = null;
    this.running = false;
  }

  /**
   * Adds a player to the room if does not exist yet.
   * @param {Player} player to join the room.
   * @returns {boolean} true if player was added, false if the player already is added.
   */
  playerJoinRoom(player) {
    if (!this.getPlayer(player.socket)) {
      player.activeRoom = this;
      this.players.push(player);
    }

    const s = this.roomRuntime.createSoliderIfNotExists(player);
    player.modelObjectId = s.id;
    player.modelObject = s;
    player.activeRoom = this;

    if(this.roomRuntime.playerSoliders.size > 0) {
      this.start();
    }
  }

  start() {
    if (this.running) return;
    this.stateUpdater = setInterval(this.updatePlayers.bind(this), 1000/60);
    this.running = true;
    this.roomRuntime.start();
  }

  stop() {
    if (!this.running) return;
    clearInterval(this.stateUpdater);
    this.roomRuntime.stop();
    this.running = false;
  }

  /** 
   * Updates players state over socket
   */
  updatePlayers(){
    this.players.forEach((p) => {
      let st = this.roomRuntime.getPlayerState(p.modelObject.ssp.id);
      let json = JSON.stringify(st, null, " ");
      // console.log(`Sending to socket: ${p.socket.id} update:\n${json}`)
      p.socket.emit("state-upate", json);
    })
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

    if(this.roomRuntime.playerSoliders.size == 0) {
      this.stop();
    }
  }
}

export { Room };
