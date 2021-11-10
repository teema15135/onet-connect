import { VERTICAL_AMOUNT, HORIZON_AMOUNT, UNIQUE, PAIR_AMOUNT, TILE_SIZE, TILE_SPACE, REMOVE_DELAY_MILLIS, } from "./constants.js";
import { StraightConnect, ThreeStraightConnect, TwoStraightConnect, } from "./model.js";
import { notify, removeNotifyText } from "./notifier.js";
import { clearLine, drawConnect } from "./overlay-controller.js";
import { getElement } from "./tile-helper.js";
import { querySelectorAllAsList } from "./utils.js";
import { isOneLineConnecting, isPresent, isThreeLineConnecting, isTwoLineConnecting, isValidMatched, } from "./validator.js";
function getList() {
    let result = [];
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
function listToMatrix(list, elementsPerSubArray) {
    let matrix = [];
    for (let i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }
        matrix[k].push(list[i]);
    }
    return matrix;
}
function createDisplayElement(num) {
    let img = document.createElement("img");
    if (num == null)
        return img;
    img.src = `images/${num}.png`;
    img.className = "tile-image";
    img.draggable = false;
    return img;
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
function shuffle() {
    let tdList = querySelectorAllAsList("td");
    for (let i = tdList.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = tdList[i];
        tdList[i] = tdList[j];
        tdList[j] = temp;
    }
    document.querySelector("#game-container").innerHTML = "";
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    let displayMatrix = listToMatrix(tdList, HORIZON_AMOUNT);
    for (let i = 0; i < VERTICAL_AMOUNT; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < HORIZON_AMOUNT; j++) {
            let td = document.createElement("td");
            td.position = [j, i];
            td.tileValue = displayMatrix[i][j].tileValue;
            if (displayMatrix[i][j].tileValue == null)
                td.className = "hide";
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    document.querySelector("#game-container").appendChild(table);
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
function getActive() {
    let activePosition = null;
    document.querySelectorAll("td").forEach((value) => {
        if (value.className.includes("active"))
            activePosition = value;
    });
    return activePosition;
}
function onClick(x, y) {
    if (!isPresent(x, y))
        return;
    if (isFirstClick())
        onSecondClick(x, y);
    else
        onFirstClick(x, y);
}
function onFirstClick(x, y) {
    getElement(x, y).className = "active";
}
function onSecondClick(x, y) {
    let first = getActive();
    let second = getElement(x, y);
    if (first == null || second == null)
        return;
    if (first == second) {
        first.className = "";
        return;
    }
    let validMatched = isValidMatched(first, second);
    if (validMatched instanceof StraightConnect ||
        validMatched instanceof TwoStraightConnect ||
        validMatched instanceof ThreeStraightConnect) {
        onMatch(first, second, validMatched);
    }
    else
        onNotMatch(first, second);
}
function onMatch(first, second, connection) {
    drawConnect(connection);
    setTimeout(() => {
        removeTile(first);
        removeTile(second);
        clearLine();
        if (isNoMoreTile()) {
            notify("You win!!", false);
            displayAllCell();
        }
        else {
            shuffleUntilAnyMatch();
        }
    }, REMOVE_DELAY_MILLIS);
}
function onNotMatch(first, second) {
    first.className = "";
    second.className = "active";
}
function removeTile(element) {
    element.className = "hide";
    element.tileValue = null;
    console.log(element);
}
function isNoMoreTile() {
    let tdList = querySelectorAllAsList("td");
    for (let td of tdList) {
        if (td.tileValue != null || !td.className.includes("hide"))
            return false;
    }
    return true;
}
function isFirstClick() {
    let anyActive = false;
    document.querySelectorAll("td").forEach((value) => {
        if (value.className.includes("active"))
            anyActive = true;
    });
    return anyActive;
}
function isAnyMatched() {
    let tdList = querySelectorAllAsList("td");
    for (let i of tdList) {
        for (let j of tdList) {
            if (isValidMatched(i, j))
                return true;
        }
    }
    return false;
}
function shuffleUntilAnyMatch() {
    while (!isAnyMatched())
        shuffle();
    displayAllCell();
    attachEventListenerAllCell();
}
function newGame() {
    let gameContainer = document.querySelector("#game-container");
    gameContainer.innerHTML = "";
    gameContainer.appendChild(newTable());
    gameContainer.style.width = `${HORIZON_AMOUNT * (TILE_SIZE + TILE_SPACE) + TILE_SPACE}px`;
    gameContainer.style.height = `${VERTICAL_AMOUNT * (TILE_SIZE + TILE_SPACE) + TILE_SPACE}px`;
    let gameOverlayCanvas = document.querySelector("#game-overlay-canvas");
    gameOverlayCanvas.style.width = `${(HORIZON_AMOUNT + 2) * (TILE_SIZE + TILE_SPACE)}px`;
    gameOverlayCanvas.style.height = `${(VERTICAL_AMOUNT + 2) * (TILE_SIZE + TILE_SPACE)}px`;
    gameOverlayCanvas.width = (HORIZON_AMOUNT + 2) * (TILE_SIZE + TILE_SPACE);
    gameOverlayCanvas.height = (VERTICAL_AMOUNT + 2) * (TILE_SIZE + TILE_SPACE);
    shuffleUntilAnyMatch();
    removeNotifyText();
}
function main() {
    newGame();
    document.querySelector("#new-game-button").addEventListener("click", () => {
        newGame();
    });
}
function debug() {
    window.getList = getList;
    window.getElement = getElement;
    window.isPresent = isPresent;
    window.isOneLineConnecting = isOneLineConnecting;
    window.isTwoLineConnecting = isTwoLineConnecting;
    window.isThreeLineConnecting = isThreeLineConnecting;
    window.removeTile = removeTile;
    window.isNoMoreTile = isNoMoreTile;
    window.shuffleUntilAnyMatch = shuffleUntilAnyMatch;
    window.shuffle = shuffle;
    window.displayAllCell = displayAllCell;
    window.attachEventListenerAllCell = attachEventListenerAllCell;
    window.drawConnect = drawConnect;
    window.clearLine = clearLine;
}
main();
debug();
