class Game {
  constructor(bgcanvas, bgctx) {
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.objects = {};
    this.oponents = {};
    this.player = null;
  }

  addObject(id, object) {
    this.objects[id] = object;
  }

  hasObject(id) {
    return this.objects.hasOwnProperty(id);
  }

  getObject(id) {
    return this.objects[id];
  }

  removeObject(id) {
    delete(this.objects[id]);
  }

  eachObject(func) {
    Object.keys(this.objects).forEach( o => func(this.objects[o]))
  }

  setPlayer(player) {
    this.player = player;
    this.addObject(player.model.ssp.id, player);
  }

  addOponent(oponents) {
    this.oponents.push(oponents);
  }
}

export { Game };
