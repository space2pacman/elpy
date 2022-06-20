class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
    }
}

module.exports = Point;