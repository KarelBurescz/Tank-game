import './mocks.js';

import expect from 'expect.js';
import { Game } from '../game.js';
import { UiObject } from '../uiobject.js';
import { UiObstacle } from '../uiobstacle.js';


describe('client/game', () => {
  describe('getColisionBoxes', () => {
    it('should return all colisionBoxes', () => {
      let myGame = new Game(null, null);
      let obj1 = new UiObstacle(myGame, 5, 1, 3, 15, 100, 'blue');
      let obj2 = new UiObstacle(myGame, 10, -7, 3, 7, 100, 'blue');
      myGame.addObject(obj1);
      myGame.addObject(obj2);
      expect(myGame.getColisionBoxes()).to.eql([{x:5, y:1, w:3, h:15}, {x: 10, y:-7, w: 3, h: 7}]);
    });
  });
});