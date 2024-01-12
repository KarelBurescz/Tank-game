/**
 * @typedef { Object } Player
 * @property { String } socket
 * @property { Number | null } modelOBjectID - It's a foreign key to the list of game model. The value denotes the game model of the player (the tank). Can be null, if the player is not part of any room.
 */

class Player {
  /**
   * The class represents the connected user to the server.
   * The player may alreday be in a room, where his game object is represented by modelObjectID: Number.
   */

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
