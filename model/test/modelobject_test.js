import expect from 'expect.js';
import { ModelObject } from '../modelobject.js';

describe('model/ModelObject', function () {

  describe('constructor', function () {
    it('should create valid preinitialized instance', function () {
        const testGame = {};
        const mo = new ModelObject(testGame, 0, 0, 50, 50, 100);

        let ssp = mo.ssp;
        let id = mo.ssp.id;

        expect(mo.game).to.be(testGame);

        expect(ssp).to.eql({
            id: id, x: 0, y: 0, width: 50, height: 50, hp: 100, type: 'none'
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