import expect from 'expect.js';
import { Bullet } from '../bullet.js';
import { RoomRuntime } from '../../server/roomRuntime.js';
import { Obstacle } from '../obstacle.js';

describe('model/Bullet', function () {

    describe('constructor', function () {
      it('should create valid preinitialized instance with ssp', function () {
          const testGame = {};
          const owner = {};

          const b = new Bullet(testGame, 1, 2, 3, 4, 5, 6, 100, owner);

          const ssp = {
            id: b.ssp.id,
            hp: b.ssp.hp,
            type: "bullet",
            x: 1, 
            y: 2, 
            width: 3, 
            height: 4, 
            speed: 5,
            direction: 6, 
            damage: 100,
            exploding: false,
            numHits: 0,
            movable: false,
            zIndex: 0,
          }

          expect(b.ssp).to.eql(ssp);
      });

      it('should create non extensible instance', function() {
        const mo = new Bullet({}, 0, 0, 0, 0, 0, 0, 100, null);

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
    });

    describe('update, verify movement', () => {
      const angles = [];
      for (let i=0; i < 360; i+=45) {
        angles.push(i * Math.PI / 180);
      }
      const epsilon = 0.000001;
      const speed = 10;

      angles.forEach( a1 => {
        
        it(`should move the bullet in the direction ${a1} angle`, () => {
          const r1 = new RoomRuntime();
          const b1 = new Bullet(r1, 0, 0, 0, 0, speed, a1, 100, null);
          b1.update();

          expect(Math.abs(b1.ssp.x - speed * Math.cos(a1)) < epsilon).to.be(true);
          expect(Math.abs(b1.ssp.y - speed * Math.sin(a1)) < epsilon).to.be(true);
        });
      });
    });

    describe('update, verify collision', () => {
      it('should collide with a wall, cause damage and dissapear', () => {
        const r1 = new RoomRuntime();
        const b1 = new Bullet(r1, 0, 20, 5, 5, 10, 0, 100, null);
        const w1 = new Obstacle(r1, 5, 5, 30, 200, 1000, 'yellow');

        r1.addObject(b1);
        r1.addObject(w1);

        let bb = r1.getObject(b1.ssp.id);
        expect(r1.getObject(b1.ssp.id)).to.be.an('object');

        b1.update();

        expect(w1.ssp.hp).to.below(1000);
        expect(r1.getObject(b1.ssp.id)).to.be(undefined);
      });

      it('should apply tunneling and the bullet won\'t hit a wall', () => {
        const r1 = new RoomRuntime();
        const b2 = new Bullet(r1, 0, 20, 5, 5, 38.5, 0, 100, null);
        const w1 = new Obstacle(r1, 5, 5, 30, 200, 1000, 'yellow');

        r1.addObject(w1);
        r1.addObject(b2);

        expect(r1.getObject(b2.ssp.id)).to.be.an('object');

        b2.update();

        expect(w1.ssp.hp).to.be(1000);
        expect(r1.getObject(b2.ssp.id)).to.be.ok();
      });

      it('should not collide with itself', () => {
        const r1 = new RoomRuntime();
        const b1 = new Bullet(r1, 0, 0, 10, 10, 0, 0, 100, null);
        r1.addObject(b1);

        expect(b1.collides(b1)).to.be(false);
      });

    });

    describe('collision box', () => {
      it('returns the right collision box, surrounding the bullet center', () => {
        const b1 = new Bullet(new RoomRuntime(), 10, 10, 8, 6, 10, 0, 100, null);
        expect(b1.collisionBox()).to.eql(
          {
            x: 10 - 8/2, 
            y: 10 - 6/2,
            w: 8, 
            h: 6
          }
        );
      })
    })
});