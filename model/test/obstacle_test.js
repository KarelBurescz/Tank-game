import expect from 'expect.js';
import { Obstacle } from '../obstacle.js';
import { RoomRuntime } from '../../server/roomRuntime.js';

describe('model/Obstacle', function () {
    describe('constructor', function () {
        it('should create valid preinitialized instance with ssp', function () {
            const r1 = new RoomRuntime();
            const owner = {};
  
            const b = new Obstacle(r1, 1, 2, 3, 4, 5, 'red');
            
  
            const ssp = {
              id: b.ssp.id,
              hp: b.ssp.hp,
              type: "obstacle",
              x: 1, 
              y: 2, 
              width: 3, 
              height: 4, 
              hp: 5,
            }
  
            expect(b.ssp).to.eql(ssp);
        });

        it('should create non extensible instance', function() {
            const mo = new Obstacle(new RoomRuntime(), 0, 0, 0, 0, 0, 'red');
    
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

});