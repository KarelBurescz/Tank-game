class Game {
  constructor(bgcanvas, bgctx) {
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.objects = [];
  }
  static players = [];

  static addPlayer(player) {
    Game.players.push(player);
  }

  addObject(object) {
    this.objects.push(object);
  }
}

export { Game };
