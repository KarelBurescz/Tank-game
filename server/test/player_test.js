import expect from 'expect.js';
import { Player } from '../player.js';
// import { ModelObject } from '../modelobject.js';

describe('server/Player', function () {

  describe('constructor', function () {
    it('should create valid preinitialized instance', function () {
        const socket = {};
        const pl = new Player(socket);

        expect(pl.socket).to.be(socket);
    });

    it('creates non extensible object', () => {
        const pl = new Player({});
        expect(() => { pl.newproperty = 0}).throwException();
    });

  });
});