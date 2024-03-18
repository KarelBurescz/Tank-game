import expect from 'expect.js';
import { ModelObject } from '../modelobject.js';
import { RoomRuntime } from '../../server/roomRuntime.js';
import { Tree } from '../tree.js';
import { Bullet } from '../bullet.js';
import { Obstacle } from '../obstacle.js';

describe('model/ModelObject', function () {

  describe('constructor', function () {
    it('should create valid preinitialized instance', function () {
        const testGame = {};
        const mo = new ModelObject(testGame, 0, 0, 50, 50, 100);

        let ssp = mo.ssp;
        let id = mo.ssp.id;

        expect(mo.game).to.be(testGame);

        expect(ssp).to.eql({
            id: id, x: 0, y: 0, width: 50, height: 50, hp: 100, type: 'none', exploding: false, numHits: 0,
            movable: false,
        })

        expect(mo.x).to.be(undefined);
    });
  });

  describe('updateCsp', function(){
    it('updates properly csp property based on Json string', function(){
        const mo = new ModelObject({}, 0, 0, 10, 10, 100);

        const csp = {
            property1: 'value1'
        };

        const cspStr = JSON.stringify(csp, null, " ");

        mo.updateCsp(cspStr);
        expect(mo.csp).to.eql(csp);
    });


  });

  describe('collisionBox', function(){
    it('returns correct collision box', ()=>{
        const mo = new ModelObject({}, 0, 1, 10, 20, 100);

        expect(mo.collisionBox()).to.eql({
            x: mo.ssp.x,
            y: mo.ssp.y,
            w: mo.ssp.width,
            h: mo.ssp.height
        })
    });
  });

  describe('timeInterpolation', () => {
    it('returns the same position for non-movable objects', () => {
      const r1 = new RoomRuntime();
      const t1 = new Tree(r1, 1, 2, 3, 4, 5, 'green');
      const t2 = new Tree(r1, 1, 2, 3, 4, 5, 'green');

      t1.interpolateInTime(t2.ssp, 1000000, 200, 1000500);
      expect(t1.ssp).to.eql(
        {
          id: t1.ssp.id,
          hp: t1.ssp.hp,
          type: "tree",

          x: 1, 
          y: 2, 
          width: 3, 
          height: 4, 

          exploding: false,
          numHits: 0,
          movable: false,
      });

    });

    it('throws an error for two objects of different time', () => {
      const r1 = new RoomRuntime();
      const t1 = new Tree(r1, 1, 2, 3, 4, 5, 'green');
      const t2 = new Obstacle(r1, 1, 2, 3, 4, 5, 'green');

      expect(t1.interpolateInTime).withArgs(t2, 1000000, 200, 1000500).to.throwError();
    });

    it('returns the same object if dt is zero', () => {
    
      const owner = {};
      const testGame = {};

      const b1 = new Bullet(testGame, 10  , 100 , 3, 4, 5, 6, 100, owner);
      const b2ssp = Object.assign({}, b1.ssp);

      b2ssp.x = 160;
      b2ssp.y = 50;

      b1.interpolateInTime(b2ssp, 100000, 0, 100100);

      expect(b1.ssp.x).to.be(b1.ssp.x);
      expect(b1.ssp.y).to.be(b1.ssp.y);
    });

    it('returns interpolated position', () => {
    
      const owner = {};
      const testGame = {};

      const b1 = new Bullet(testGame, 10  , 100 , 3, 4, 5, 6, 100, owner);
      const b2ssp = Object.assign({}, b1.ssp);

      b2ssp.x = 160;
      b2ssp.y = 50;

      b1.interpolateInTime(b2ssp, 100000, 20, 100100);

      expect(b1.ssp.x).to.be(40);
      expect(b1.ssp.y).to.be(90);
    });

  describe('collides', ()=>{
    it('returns true for two overlapping objects', () => {
        const mo1 = new ModelObject({}, 10, 11, 100, 101, 10);
        const mo2 = new ModelObject({}, 50, 51, 150, 151, 100);
        const mo3 = new ModelObject({}, 50, 51, 150, 151, 100);

        expect(mo1.collides(mo2)).to.be(true);
        expect(mo1.collides(mo1)).to.be(false);
        expect(mo2.collides(mo3)).to.be(true);
    });
    it('returns false for two non-overlapping objects', () => {
        const mo1 = new ModelObject({},  10, 20, 100, 200,  10);
        const mo2 = new ModelObject({}, 111, 20, 150, 200, 100);
        const mo3 = new ModelObject({}, 110, 20, 150, 200, 100);
        const mo4 = new ModelObject({}, 30,30,25,26,100);

        expect(mo1.collides(mo2)).to.be(false);
        expect(mo1.collides(mo3)).to.be(true);
        expect(mo1.collides(mo4)).to.be(true);
        
    });



  });
  
});