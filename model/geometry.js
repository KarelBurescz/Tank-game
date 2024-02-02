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

    if(Math.abs(det) < epsilon) {
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

    const mt = tests.map( (t) => {
      let [b, ...pts] = t;
      return b?this._testBoundaryPoint(...pts):true;
    })

    if (mt.some(e => e === false)){
      return undefined;
    }
      
    return [x, y];
  }

  /**
   * Tests if an intersection (xi, yi) lays on a half line, 
   * stat starts in (x1, y1) and goes through (x2, y2) to
   * infinity. 
   * The function assumes that (xi,yi) lays on the line going
   * through (x1,y1) and (x2,y2).
   */
  static _testBoundaryPoint(x1,y1, xi, yi, x2, y2){
    let resx = (x1 <= x2) ? (x1 <= xi) : (x1 >= xi);
    let resy = (y1 <= y2) ? (y1 <= yi) : (y1 >= yi);
    return resx && resy;
  }
}

export { Geometry };