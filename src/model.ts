class Joint {
  position: number[] = [-1, -1];
}

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class StraightConnect {
  first: Position;
  second: Position;

  constructor(firstPosition: Position, secondPosition: Position) {
    this.first = firstPosition;
    this.second = secondPosition;
  }
}

class TwoStraightConnect {
  first: StraightConnect;
  second: StraightConnect;

  constructor(firstConenct: StraightConnect, secondConnect: StraightConnect) {
    this.first = firstConenct;
    this.second = secondConnect;
  }
}

class ThreeStraightConnect {
  first: StraightConnect;
  second: StraightConnect;
  third: StraightConnect;

  constructor(
    firstConenct: StraightConnect,
    secondConnect: StraightConnect,
    thirdConnect: StraightConnect
  ) {
    this.first = firstConenct;
    this.second = secondConnect;
    this.third = thirdConnect;
  }
}

function isAllStraightConnect(...args: (false | StraightConnect)[]): boolean {
  for (let arg of args) {
    if (!(arg instanceof StraightConnect))
      return false
  }
  return true
}

export { Joint, Position, StraightConnect, TwoStraightConnect, ThreeStraightConnect, isAllStraightConnect };
