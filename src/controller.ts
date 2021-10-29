import {
  VERTICAL_AMOUNT,
  HORIZON_AMOUNT,
  UNIQUE,
  PAIR_AMOUNT,
} from "./constants.js";

import { notify, removeNotifyText } from './notifier.js'

declare global {
  interface HTMLTableCellElement {
    position: number[],
    tileValue: number | null,
    currentEventListener: () => void,
  }
}

class Joint {
  position: number[] = [-1, -1]
}

function querySelectorAllAsList<Type extends Element>(selectorName: string): Type[] {
  let result: Type[] = []
  let nodeList = document.querySelectorAll<Type>(selectorName)
  for (let i = 0; i < nodeList.length; i++) {
    result.push(nodeList.item(i))
  }
  return result
}

function getList(): number[] {
  let result: number[] = [];

  for (let i = 0; i < PAIR_AMOUNT; i++) {
    result.push(i % UNIQUE);
    result.push(i % UNIQUE);
  }

  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

function listToMatrix<T>(list: T[], elementsPerSubArray: number): T[][] {
  let matrix: T[][] = [];

  for (let i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}

function createDisplayElement(number: number | null): HTMLParagraphElement {
  let p = document.createElement("p");
  p.textContent = (number != null ? number.toString() : "");
  return p;
}

function newTable(): HTMLTableElement {
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");

  let displayMatrix = listToMatrix(getList(), HORIZON_AMOUNT);

  for (let i = 0; i < VERTICAL_AMOUNT; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < HORIZON_AMOUNT; j++) {
      let td = document.createElement("td");
      td.position = [j, i];
      td.tileValue = displayMatrix[i][j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  return table;
}

function shuffle(): void {
  let tdList: HTMLTableCellElement[] = querySelectorAllAsList<HTMLTableCellElement>("td")
  
  for (let i = tdList.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = tdList[i];
    tdList[i] = tdList[j];
    tdList[j] = temp;
  }

  document.querySelector("#game-container")!.innerHTML = "";
  
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  
  let displayMatrix = listToMatrix(tdList, HORIZON_AMOUNT);

  for (let i = 0; i < VERTICAL_AMOUNT; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < HORIZON_AMOUNT; j++) {
      let td = document.createElement("td");
      td.position = [j, i];
      td.tileValue = displayMatrix[i][j].tileValue;
      if (displayMatrix[i][j].tileValue == null) td.className = "hide"
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  document.querySelector("#game-container")!.appendChild(table);
}

function attachEventListenerAllCell(): void {
  document.querySelectorAll("td").forEach((td) => {
    td.removeEventListener("click", td.currentEventListener);
    let listener = () => {
      onClick(td.position[0], td.position[1]);
    };
    td.addEventListener("click", listener);
    td.currentEventListener = listener;
  });
}

function displayAllCell(): void {
  document.querySelectorAll("td").forEach((td) => {
    td.innerHTML = "";
    td.appendChild(createDisplayElement(td.tileValue));
  });
}

function getActive(): HTMLTableCellElement | null {
  let activePosition: HTMLTableCellElement | null = null;
  document.querySelectorAll("td").forEach((value) => {
    if (value.className.includes("active")) activePosition = value;
  });
  return activePosition;
}

function getElement(x: number, y: number) {
  if (x < 0 || x >= HORIZON_AMOUNT) return null;
  if (y < 0 || y >= VERTICAL_AMOUNT) return null;
  for (let i of querySelectorAllAsList<HTMLTableCellElement>('td')) {
    if (i.position[0] == x && i.position[1] == y)
      return i
  }
  return null;
}

function onClick(x: number, y: number) {
  if (!isPresent(x, y)) return;
  if (isFirstClick()) onSecondClick(x, y);
  else onFirstClick(x, y);
}

function onFirstClick(x: number, y: number) {
  getElement(x, y)!.className = "active";
}

function onSecondClick(x: number, y: number) {
  let first = getActive();
  let second = getElement(x, y);

  if (first == null || second == null) return

  if (first == second) {
    first.className = "";
    return;
  }

  if (isValidMatched(first, second)) {
    onMatch(first, second!);
  } else onNotMatch(first, second);
}

function onMatch(first: HTMLTableCellElement, second: HTMLTableCellElement) {
  removeTile(first);
  removeTile(second);
  if (isNoMoreTile()) {
    notify("You win!!", false)
  } else {
    shuffleUntilAnyMatch();
  }
}

function onNotMatch(first: HTMLTableCellElement, second: HTMLTableCellElement) {
  first.className = "";
  second.className = "active";
}

function removeTile(element: HTMLTableCellElement) {
  element.className = "hide";
  element.tileValue = null;
}

function isNoMoreTile() {
  let tdList = querySelectorAllAsList<HTMLTableCellElement>("td")
  for (let td of tdList) {
    if (td.tileValue != null || !td.className.includes("hide")) return false
  }
  return true;
}

function isValidMatched(first: HTMLTableCellElement, second: HTMLTableCellElement) {
  if (!isPresent(first.position[0], first.position[1]) || !isPresent(second.position[0], second.position[1]))
    return false
  return (
    isSameTileValue(first, second) &&
    (isAdjacent(first, second) ||
      isOneLineConnecting(first, second) ||
      isTwoLineConnecting(first, second) ||
      isThreeLineConnecting(first, second))
  );
}

function isSameTileValue(first: HTMLTableCellElement, second: HTMLTableCellElement) {
  return first.tileValue == second.tileValue;
}

function isAdjacent(first: HTMLTableCellElement, second: HTMLTableCellElement) {
  if (first.position[0] == second.position[0])
    return Math.abs(first.position[1] - second.position[1]) == 1;

  if (first.position[1] == second.position[1])
    return Math.abs(first.position[0] - second.position[0]) == 1;

  return false;
}

function isOneLineConnecting(first: HTMLTableCellElement | Joint, second: HTMLTableCellElement | Joint, firstIsIncluded = false, secondIsIncluded = false) {
  if (first.position[0] == second.position[0]) {
    if (first.position[1] > second.position[1]) {
      for (let i = second.position[1] + (secondIsIncluded ? 0 : 1); i < first.position[1] + (firstIsIncluded ? 1 : 0); i++)
        if (isPresent(first.position[0], i)) return false;
      return true;
    }
    if (first.position[1] < second.position[1]) {
      for (let i = first.position[1] + (firstIsIncluded ? 0 : 1); i < second.position[1] + (secondIsIncluded ? 1 : 0); i++)
        if (isPresent(first.position[0], i)) return false;
      return true;
    }
  }

  if (first.position[1] == second.position[1]) {
    if (first.position[0] > second.position[0]) {
      for (let i = second.position[0] + (secondIsIncluded ? 0 : 1); i < first.position[0] + (firstIsIncluded ? 1 : 0); i++)
        if (isPresent(i, first.position[1])) return false;
      return true;
    }
    if (first.position[0] < second.position[0]) {
      for (let i = first.position[0] + (firstIsIncluded ? 0 : 1); i < second.position[0] + (secondIsIncluded ? 1 : 0); i++)
        if (isPresent(i, first.position[1])) return false;
      return true;
    }
  }

  return false;
}

function isTwoLineConnecting(first: HTMLTableCellElement, second: HTMLTableCellElement) {
  let firstJoint: Joint = {
    position: [first.position[0], second.position[1]],
  };
  let secondJoint: Joint = {
    position: [second.position[0], first.position[1]],
  };

  if (isPresent(firstJoint.position[0], firstJoint.position[1])) {
    return (
      isOneLineConnecting(secondJoint, first, true, false) &&
      isOneLineConnecting(secondJoint, second, true, false)
    );
  }

  if (isPresent(secondJoint.position[0], secondJoint.position[1])) {
    return (
      isOneLineConnecting(firstJoint, first, true, false) &&
      isOneLineConnecting(firstJoint, second, true, false)
    );
  }

  return (
    (isOneLineConnecting(firstJoint, first, true, false) &&
      isOneLineConnecting(firstJoint, second, true, false)) ||
    (isOneLineConnecting(secondJoint, first, true, false) &&
      isOneLineConnecting(secondJoint, second, true, false))
  );
}

function isThreeLineConnecting(first: HTMLTableCellElement, second: HTMLTableCellElement) {
  // Horizon 2 points
  for (let i = -1; i <= VERTICAL_AMOUNT; i++) {
    let firstJoint: Joint = { position: [first.position[0], i] }
    let secondJoint: Joint = { position: [second.position[0], i]}
    // first -> firstJoint -> secondJoint -> second
    if (isOneLineConnecting(first, firstJoint, false, true) &&
    isOneLineConnecting(firstJoint, secondJoint, true, true) &&
    isOneLineConnecting(secondJoint, second, true, false)) return true
  }

  // Vertical 2 points
  for (let i = -1; i <= HORIZON_AMOUNT; i++) {
    let firstJoint: Joint = { position: [i, first.position[1]] }
    let secondJoint: Joint = { position: [i, second.position[1]] }
    // first -> firstJoint -> secondJoint -> second
    if (isOneLineConnecting(first, firstJoint, false, true) &&
    isOneLineConnecting(firstJoint, secondJoint, true, true) &&
    isOneLineConnecting(secondJoint, second, true, false)) return true
  }

  return false;
}

function isFirstClick() {
  let anyActive = false;
  document.querySelectorAll("td").forEach((value) => {
    if (value.className.includes("active")) anyActive = true;
  });
  return anyActive;
}

function isPresent(x: number, y: number): boolean {
  return getElement(x, y) != null && getElement(x, y)!.tileValue != null;
}

function isAnyMatched() {
  let tdList = querySelectorAllAsList<HTMLTableCellElement>("td");
  for (let i of tdList) {
    for (let j of tdList) {
      if (isValidMatched(i, j))
        return true;
    }
  }
  return false;
}

function shuffleUntilAnyMatch() {
  while(!isAnyMatched()) shuffle();
  displayAllCell();
  attachEventListenerAllCell();
}

function newGame() {
  document.querySelector("#game-container")!.innerHTML = "";
  document.querySelector("#game-container")!.appendChild(newTable());
  shuffleUntilAnyMatch();
  removeNotifyText();
}

function main() {
  newGame();
  document.querySelector("#new-game-button")!.addEventListener("click", () => {
    newGame();
  });
}

declare global {
  interface Window {
    getList: any,
    getElement: any,
    isPresent: any,
    isOneLineConnecting: any,
    isTwoLineConnecting: any,
    isThreeLineConnecting: any,
    removeTile: any,
    isNoMoreTile: any,
    shuffleUntilAnyMatch: any,
    shuffle: any,
    displayAllCell: any,
    attachEventListenerAllCell: any,
  }
}

function debug() {
  window.getList = getList;
  window.getElement = getElement
  window.isPresent = isPresent
  window.isOneLineConnecting = isOneLineConnecting
  window.isTwoLineConnecting = isTwoLineConnecting
  window.isThreeLineConnecting = isThreeLineConnecting
  window.removeTile = removeTile
  window.isNoMoreTile = isNoMoreTile
  window.shuffleUntilAnyMatch = shuffleUntilAnyMatch
  window.shuffle = shuffle
  window.displayAllCell = displayAllCell
  window.attachEventListenerAllCell = attachEventListenerAllCell
}

main();
debug();
