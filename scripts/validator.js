import { HORIZON_AMOUNT, VERTICAL_AMOUNT } from "./constants.js";
import { isAllStraightConnect, Position, StraightConnect, ThreeStraightConnect, TwoStraightConnect, } from "./model.js";
import { getElement } from "./tile-helper.js";
function isValidMatched(first, second) {
    if (!isPresent(first.position[0], first.position[1]) ||
        !isPresent(second.position[0], second.position[1]))
        return false;
    if (!isSameTileValue(first, second))
        return false;
    let adjacent = isAdjacent(first, second);
    if (adjacent instanceof StraightConnect)
        return adjacent;
    let oneLineConnecting = isOneLineConnecting(first, second);
    if (oneLineConnecting instanceof StraightConnect)
        return oneLineConnecting;
    let twoLineConnecting = isTwoLineConnecting(first, second);
    if (twoLineConnecting instanceof TwoStraightConnect)
        return twoLineConnecting;
    let threeLineConnecting = isThreeLineConnecting(first, second);
    if (threeLineConnecting instanceof ThreeStraightConnect)
        return threeLineConnecting;
    return false;
}
function isSameTileValue(first, second) {
    return first.tileValue == second.tileValue;
}
function isAdjacent(first, second) {
    if (first.position[0] == second.position[0] &&
        Math.abs(first.position[1] - second.position[1]) == 1)
        return new StraightConnect(new Position(first.position[0], first.position[1]), new Position(second.position[0], second.position[1]));
    if (first.position[1] == second.position[1] &&
        Math.abs(first.position[0] - second.position[0]) == 1)
        return new StraightConnect(new Position(first.position[0], first.position[1]), new Position(second.position[0], second.position[1]));
    return false;
}
function isOneLineConnecting(first, second, firstIsIncluded = false, secondIsIncluded = false) {
    if (first.position[0] == second.position[0]) {
        if (first.position[1] > second.position[1]) {
            for (let i = second.position[1] + (secondIsIncluded ? 0 : 1); i < first.position[1] + (firstIsIncluded ? 1 : 0); i++)
                if (isPresent(first.position[0], i))
                    return false;
            return new StraightConnect(new Position(first.position[0], first.position[1]), new Position(second.position[0], second.position[1]));
        }
        if (first.position[1] < second.position[1]) {
            for (let i = first.position[1] + (firstIsIncluded ? 0 : 1); i < second.position[1] + (secondIsIncluded ? 1 : 0); i++)
                if (isPresent(first.position[0], i))
                    return false;
            return new StraightConnect(new Position(first.position[0], first.position[1]), new Position(second.position[0], second.position[1]));
        }
    }
    if (first.position[1] == second.position[1]) {
        if (first.position[0] > second.position[0]) {
            for (let i = second.position[0] + (secondIsIncluded ? 0 : 1); i < first.position[0] + (firstIsIncluded ? 1 : 0); i++)
                if (isPresent(i, first.position[1]))
                    return false;
            return new StraightConnect(new Position(first.position[0], first.position[1]), new Position(second.position[0], second.position[1]));
        }
        if (first.position[0] < second.position[0]) {
            for (let i = first.position[0] + (firstIsIncluded ? 0 : 1); i < second.position[0] + (secondIsIncluded ? 1 : 0); i++)
                if (isPresent(i, first.position[1]))
                    return false;
            return new StraightConnect(new Position(first.position[0], first.position[1]), new Position(second.position[0], second.position[1]));
        }
    }
    return false;
}
function isTwoLineConnecting(first, second) {
    let firstJoint = {
        position: [first.position[0], second.position[1]],
    };
    let secondJoint = {
        position: [second.position[0], first.position[1]],
    };
    let firstJointToFirst = isOneLineConnecting(firstJoint, first, true, false);
    let firstJointToSecond = isOneLineConnecting(firstJoint, second, true, false);
    if (isAllStraightConnect(firstJointToFirst, firstJointToSecond))
        return new TwoStraightConnect(firstJointToFirst, firstJointToSecond);
    let secondJointToFirst = isOneLineConnecting(secondJoint, first, true, false);
    let secondJointToSecond = isOneLineConnecting(secondJoint, second, true, false);
    if (isAllStraightConnect(secondJointToFirst, secondJointToSecond))
        return new TwoStraightConnect(secondJointToFirst, secondJointToSecond);
    return false;
}
function isThreeLineConnecting(first, second) {
    // Horizon 2 points
    for (let i = -1; i <= VERTICAL_AMOUNT; i++) {
        let firstJoint = { position: [first.position[0], i] };
        let secondJoint = { position: [second.position[0], i] };
        let connecting = isFourPositionConnecting(first, firstJoint, secondJoint, second);
        if (connecting instanceof ThreeStraightConnect)
            return connecting;
    }
    // Vertical 2 points
    for (let i = -1; i <= HORIZON_AMOUNT; i++) {
        let firstJoint = { position: [i, first.position[1]] };
        let secondJoint = { position: [i, second.position[1]] };
        let connecting = isFourPositionConnecting(first, firstJoint, secondJoint, second);
        if (connecting instanceof ThreeStraightConnect)
            return connecting;
    }
    return false;
}
function isFourPositionConnecting(first, firstJoint, secondJoint, second) {
    // first -> firstJoint -> secondJoint -> second
    let firstToFirstJoint = isOneLineConnecting(first, firstJoint, false, true);
    let firstJointToSecondJoint = isOneLineConnecting(firstJoint, secondJoint, true, true);
    let secondJointToSecond = isOneLineConnecting(secondJoint, second, true, false);
    if (isAllStraightConnect(firstToFirstJoint, firstJointToSecondJoint, secondJointToSecond))
        return new ThreeStraightConnect(firstToFirstJoint, firstJointToSecondJoint, secondJointToSecond);
    return false;
}
function isPresent(x, y) {
    return getElement(x, y) != null && getElement(x, y).tileValue != null;
}
export { isValidMatched, isSameTileValue, isOneLineConnecting, isTwoLineConnecting, isThreeLineConnecting, isPresent, };
