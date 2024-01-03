class ServerGame {
  constructor() {
    this.rooms = [];
    this.players = [];
  }
  hasPlayer(socketId) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].socket.id === socketId) {
        return true;
      }
    }
    return false;
  }
  removePlayer(socketId) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].socket.id === socketId) {
        this.players.splice(i, 1);
      }
    }
  }
}

export { ServerGame };
