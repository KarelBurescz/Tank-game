class Game {
  constructor(bgcanvas, bgctx, Uiobjects) {
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.Uiobjects = Uiobjects;
  }
  static players = [];
  static addPlayer(player) {
    Game.players.push(player);
  }
}

export { Game };
