import expect from 'expect.js';
import { Tree } from '../tree.js';
import { RoomRuntime } from '../../server/roomRuntime.js';

describe('model/Tree', function () {
    describe('constructor', function () {
        it('should create valid preinitialized instance with ssp', function () {
            const r1 = new RoomRuntime();
            const owner = {};
  
            const b = new Tree(r1, 1, 2, 3, 4, 5, 'green');
            
            const ssp = {
              id: b.ssp.id,
              hp: b.ssp.hp,
              type: "tree",
              x: 1, 
              y: 2, 
              width: 3, 
              height: 4, 
              hp: 5,
              exploding: false,
            }
  
            expect(b.ssp).to.eql(ssp);
        });

        it('should create non extensible instance', function() {
            const mo = new Tree(new RoomRuntime(), 0, 0, 0, 0, 0, 'green');
    
            expect(() => {
                mo.newproperty = 0;
            }).to.throwException();
    
            expect(() => {
                mo.ssp.newproperty = 0;
            }).to.throwException();
    
            expect(() => {
                mo.csp.newproperty = 0;
            }).to.throwException();
        });
    })

    describe('collisionBox', () => {
        it('should return the right collision box', () => {
            //TODO: Finish this!!!!
        });
    });
});