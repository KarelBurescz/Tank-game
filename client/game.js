class Game {
  constructor(bgcanvas, bgctx) {
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.objects = {};
    this.oponents = {};
    this.player = null;
  }

  addObject(object) {
    this.objects[object.model.ssp.id] = object;
  }

  hasObject(id) {
    return this.objects.hasOwnProperty(id);
  }

  getObjectIds(){
    return Object.keys(this.objects);
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
    this.addObject(player);
  }

  addOponent(oponents) {
    this.oponents.push(oponents);
  }
}

export { Game };
