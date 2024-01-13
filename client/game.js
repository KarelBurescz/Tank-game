class Game {
  constructor(bgcanvas, bgctx) {
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.objects = [];
    this.oponents = {};
    this.player = null;
  }

  setPlayer(player) {
    this.player = player;
    this.objects.push(player);
  }

  addOponent(oponents) {
    this.oponents.push(oponents);
  }

  addObject(object) {
    this.objects.push(object);
  }
}

export { Game };
