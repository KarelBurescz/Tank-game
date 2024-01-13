"use strict";

/**
 * <p>
 * The class represents the connected user to the server.
 * The player may alreday be in some {@link Room}.
 * </p>
 * <p>
 * The player
 * also may already be playing, represented by
 * the {@link Solider} in the {@link RoomRuntime}.
 * </p>
 * 
 * @property { socket.io } socket - A socket.io socket by which the player is connected to the server.
 * @property { Solider | null } modelObject - A reference to the object representing the player.
 */
class Player {
  /**
   * @constructor
   * @param {String} socket - This is a socket.io.socket.id socket ID of the connected player. It serves as unique identifier for the players.
   */
  constructor(socket) {
    this.socket = socket;
    this.modelObjectId = null;

    this.modelObject = null;
    this.activeRoom = null;
  }

  updateController(csp) {
    if(!this.activeRoom) return;
    if(!this.modelObject) return;

    this.modelObject.updateCsp(csp);
  }
}

export { Player };
