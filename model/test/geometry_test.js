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

    it('should not find intersection if the lines are limited by their bounding points', () => {
      let result = Geometry.linesIntersection(
        0, 0,
        2, 1,
        0, 2,
        6, 2,
        false,
        true,
        false,
        false
      );

      expect(result).to.be(undefined);

    });
    it('should find intersection if the lines are not limited by their bounding points', () => {
      let result = Geometry.linesIntersection(
        0, 0,
        2, 1,
        0, 2,
        6, 2,
        false,
        false,
        false,
        false
      );

      expect(result).to.eql([4,2]);
    });
    it('should not find intersection of limited semi lines parallel to x or y axes', () => {
      let result = Geometry.linesIntersection(
        0, 0,
        2, 0,
        3, -1,
        3, 3,
        false,
        true,
        false,
        false
      );

      expect(result).to.be(undefined);
    });

    it('should find intersection of limited semi lines if they share a single point', () => {
      let result = Geometry.linesIntersection(
        0, 0,
        4, 4,
        1, 1,
        3, 0,
        false,
        false,
        true,
        false
      );

      expect(result).to.eql([1,1]);
    });

    it('should find intersection of limited semi lines if they both start from the same point', () => {
      let result = Geometry.linesIntersection(
        3, 2,
        4, 4,
        3, 2,
        1, -4,
        true,
        true,
        true,
        true
      );

      expect(result).to.eql([3,2]);
    });
  });
});