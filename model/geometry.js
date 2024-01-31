class Geometry {
  constructor() {

  }
  static linesIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
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

    return [x, y];
  }
}

export { Geometry };