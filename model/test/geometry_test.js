import expect from 'expect.js';
import { Geometry } from '../geometry.js';

describe('model/geometry', () => {
  describe('linesIntersection', () => {
    it('should find intersection with two diagonal lines in square', () => {
      let result = Geometry.linesIntersection(
        0,2,
        2,0,
        0,0,
        2,2,
      )
      expect(result).to.eql([1,1]);
    });

    it('should find intersection with two diagonal lines in rect.', () => {
      let result = Geometry.linesIntersection(
        0,2,
        4,0,
        0,0,
        4,2,
      )
      expect(result).to.eql([2,1]);
    });

    it('should find intersection with two axes lines', () => {
      let result = Geometry.linesIntersection(
        0,0,
        6,0,
        3,-2,
        3,2,
      )
      expect(result).to.eql([3,0]);
    });
    it('should find intersection with one diagonal line and one axe', () => {
      let result = Geometry.linesIntersection(
        -3,2,
        3,2,
        -3,4,
        3,0,
      )
      expect(result).to.eql([0,2]);
    });
    it('should return undefined for two parallel lines', () => {
      let result = Geometry.linesIntersection(
        -2,2,
        0,0,
        -1,2,
        1,0,
      )
      expect(result).to.be(undefined);
    });
  });
});