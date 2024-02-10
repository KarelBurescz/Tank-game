class Geometry {
  constructor() {

  }
  static linesIntersection(
    x1, y1, x2, y2, x3, y3, x4, y4,
    p1end = false, p2end = false, p3end = false, p4end = false
  ) {
    const A1 = y1 - y2;
    const A3 = y3 - y4;
    const B1 = x2 - x1;
    const B3 = x4 - x3;
    const C1 = B1 * y1 + A1 * x1;
    const C3 = B3 * y3 + A3 * x3;
    const det = A1 * B3 - A3 * B1;
    const epsilon = 0.000001;

    if (Math.abs(det) < epsilon) {
      return undefined;
    }

    const x = (C1 * B3 - C3 * B1) / det;
    const y = (C3 * A1 - C1 * A3) / det;

    const tests = [
      [p1end, x1, y1, x, y, x2, y2],
      [p2end, x2, y2, x, y, x1, y1],
      [p3end, x3, y3, x, y, x4, y4],
      [p4end, x4, y4, x, y, x3, y3],
    ];

    const mt = tests.map((t) => {
      let [b, ...pts] = t;
      return b ? this._testBoundaryPoint(...pts) : true;
    })

    if (mt.some(e => e === false)) {
      return undefined;
    }

    return [x, y];
  }

  static getEdgesFromBoundingBoxes(bboxes) {
    let res = [];
    let sides = bboxes.reduce((r, bb) => {
      r.push([bb.x, bb.y, bb.x + bb.w, bb.y]);
      r.push([bb.x + bb.w, bb.y, bb.x + bb.w, bb.y + bb.h]);
      r.push([bb.x + bb.w, bb.y + bb.h, bb.x, bb.y + bb.h]);
      r.push([bb.x, bb.y + bb.h, bb.x, bb.y]);
      return r;
    }, res);

    return res;
  }

  static getCornersFromBoundingBoxes(bboxes) {
    let res = [];
    let sides = bboxes.reduce((r, bb) => {
      let corner1 = [bb.x, bb.y];
      let corner2 = [bb.x + bb.w, bb.y];
      let corner3 = [bb.x + bb.w, bb.y + bb.h];
      let corner4 = [bb.x, bb.y + bb.h];
      r.push(corner1, corner2, corner3, corner4);
      return r;
    }, res);

    return res;
  }

  static getSemilineIntersectionsWithBoundingBoxes(semiline, edges) {

    let isecs = edges.reduce((ac, e) => {
      let i = Geometry.linesIntersection(...semiline, ...e, true, false, true, true);
      if (i !== undefined) {
        ac.push(i);
      }
      return ac;
    }, []);

    return isecs.sort((a, b) => {
      let dax = a[0] - semiline[0];
      let day = a[1] - semiline[1];
      let dbx = b[0] - semiline[0];
      let dby = b[1] - semiline[1];

      let la = (dax * dax) + (day * day);
      let lb = (dbx * dbx) + (dby * dby);
      return la - lb;
    })
  }

  static distance2(x1, y1, x2, y2) {
    return ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }

  /**
   * Tests if an intersection (xi, yi) lays on a half line, 
   * stat starts in (x1, y1) and goes through (x2, y2) to
   * infinity. 
   * The function assumes that (xi,yi) lays on the line going
   * through (x1,y1) and (x2,y2).
   */
  static _testBoundaryPoint(x1, y1, xi, yi, x2, y2) {
    let resx = (x1 <= x2) ? (x1 <= xi) : (x1 >= xi);
    let resy = (y1 <= y2) ? (y1 <= yi) : (y1 >= yi);
    return resx && resy;
  }

  static getPerpendicularVector(arrWithXAndY) {
    let x = -arrWithXAndY[1];
    let y = arrWithXAndY[0];
    let ax = Math.abs(x);
    let ay = Math.abs(y);

    if (ax > ay) {
      return [x / ax, y / ax];
    } else {
      return [x / ay, y / ay];
    }


  }

  static sortPoints(px, py, points) {
    console.log(points);
    let sorted = points.sort((c1, c2) => {
      let [dx1, dy1] = [c1[0] - px, c1[1] - py];
      let res1 = Math.atan2(dx1, dy1)

      let [dx2, dy2] = [c2[0] - px, c2[1] - py];
      let res2 = Math.atan2(dx2, dy2)

      return res2 - res1;
    });
    console.log(sorted);
    return sorted;
  }
}

export { Geometry };