const VERTICAL_AMOUNT = 9;
const HORIZON_AMOUNT = 16;
const UNIQUE = 36;

const PAIR_AMOUNT = (HORIZON_AMOUNT * VERTICAL_AMOUNT) / 2;

function getList() {
  let result = [];

  for (let i = 0; i < PAIR_AMOUNT; i++) {
    result.push(i % UNIQUE);
    result.push(i % UNIQUE);
  }

  for (var i = result.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

function listToMatrix(list, elementsPerSubArray) {
  var matrix = [],
    i,
    k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}

function createDisplayElement(number) {
  let p = document.createElement("p");
  p.textContent = number;
  return p;
}

function newTable() {
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

function attachEventListenerAllCell() {
  document.querySelectorAll("td").forEach((td) => {
    td.removeEventListener("click", td.currentEventListener);
    let listener = () => {
      onClick(td.position[0], td.position[1]);
    };
    td.addEventListener("click", listener);
    td.currentEventListener = listener;
  });
}

function displayAllCell() {
  document.querySelectorAll("td").forEach((td) => {
    td.innerHTML = "";
    td.appendChild(createDisplayElement(td.tileValue));
  });
}

function getMatrix() {
  let matrix = [];
  document.querySelectorAll("tr").forEach((value) => {
    let row = [];
    value.childNodes.forEach((td) => {
      if (td.className.includes("hide")) row.push(null);
      else row.push(td.tileValue);
    });
    matrix.push(row);
  });
  return matrix;
}

function getActive() {
  let activePosition = null;
  document.querySelectorAll("td").forEach((value) => {
    if (value.className.includes("active")) activePosition = value;
  });
  return activePosition;
}

function getElement(x, y) {
  return document.querySelector("tbody").children[y].children[x];
}

function onClick(x, y) {
  if (!isPresent(x, y)) return
  if (isFirstClick()) onSecondClick(x, y);
  else onFirstClick(x, y);
}

function onFirstClick(x, y) {
  getElement(x, y).className = "active";
}

function onSecondClick(x, y) {
  let first = getActive();
  let second = getElement(x, y);

  if (first == second) {
    first.className = "";
    return;
  }

  if (isValidMatched(first, second)) {
    onMatch(first, second);
  } else onNotMatch(first, second);
}

// TODO: Implement!!
function onMatch(first, second) {
  removeTile(first);
  removeTile(second);
}

function onNotMatch(first, second) {
  first.className = ""
  second.className = "active"
}

function removeTile(element) {
  element.className = "hide";
  element.tileValue = null;
}

function isValidMatched(first, second) {
  return isSameTileValue(first, second) && (
    isAdjacent(first, second) ||
    isOneLineConnecting(first, second) ||
    isTwoLineConnecting(first, second) ||
    isThreeLineConnecting(first, second)
    );
}

function isSameTileValue(first, second) {
  return first.tileValue == second.tileValue;
}

function isAdjacent(first, second) {
  if (first.position[0] == second.position[0])
    return Math.abs(first.position[1] - second.position[1]) == 1;

  if (first.position[1] == second.position[1])
    return Math.abs(first.position[0] - second.position[0]) == 1;

  return false;
}

function isOneLineConnecting(first, second) {
  if (first.position[0] == second.position[0]) {
    if (first.position[1] > second.position[1]) {
      for (let i = second.position[1] + 1; i < first.position[1]; i++)
        if (isPresent(first.position[0], i)) return false;
      return true;
    }
    if (first.position[1] < second.position[1]) {
      for (let i = first.position[1] + 1; i < second.position[1]; i++)
        if (isPresent(first.position[0], i)) return false;
      return true;
    }
  }

  if (first.position[1] == second.position[1]) {
    if (first.position[0] > second.position[0]) {
      for (let i = second.position[0] + 1; i < first.position[0]; i++)
        if (isPresent(i, first.position[1])) return false;
      return true;
    }
    if (first.position[0] < second.position[0]) {
      for (let i = first.position[0] + 1; i < second.position[0]; i++)
        if (isPresent(i, first.position[1])) return false;
      return true;
    }
  }

  return false;
}

function isTwoLineConnecting(first, second) {
  let firstJoint = {
    position: [first.position[0], second.position[1]]
  }
  let secondJoint = {
    position: [second.position[0], first.position[1]]
  }

  if (isPresent(firstJoint.position[0], firstJoint.position[1])) {
    return isOneLineConnecting(secondJoint, first) && isOneLineConnecting(secondJoint, second)
  }

  if (isPresent(secondJoint.position[0], secondJoint.position[1])) {
    return isOneLineConnecting(firstJoint, first) && isOneLineConnecting(firstJoint, second)
  }

  return (isOneLineConnecting(firstJoint, first) && isOneLineConnecting(firstJoint, second)) ||
  (isOneLineConnecting(secondJoint, first) && isOneLineConnecting(secondJoint, second))
}

// TODO: Implement!!!
function isThreeLineConnecting(first, second) {
  return false;
}

function isFirstClick() {
  let anyActive = false;
  document.querySelectorAll("td").forEach((value) => {
    if (value.className.includes("active")) anyActive = true;
  });
  return anyActive;
}

function isPresent(x, y) {
  return getElement(x, y).tileValue != null
}

function main() {
  document.querySelector("section").appendChild(newTable());
  displayAllCell();
  attachEventListenerAllCell();
}

main();
