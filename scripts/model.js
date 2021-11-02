class Joint {
    constructor() {
        this.position = [-1, -1];
    }
}
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class StraightConnect {
    constructor(firstPosition, secondPosition) {
        this.first = firstPosition;
        this.second = secondPosition;
    }
}
class TwoStraightConnect {
    constructor(firstConenct, secondConnect) {
        this.first = firstConenct;
        this.second = secondConnect;
    }
}
class ThreeStraightConnect {
    constructor(firstConenct, secondConnect, thirdConnect) {
        this.first = firstConenct;
        this.second = secondConnect;
        this.third = thirdConnect;
    }
}
function isAllStraightConnect(...args) {
    for (let arg of args) {
        if (!(arg instanceof StraightConnect))
            return false;
    }
    return true;
}
export { Joint, Position, StraightConnect, TwoStraightConnect, ThreeStraightConnect, isAllStraightConnect };
