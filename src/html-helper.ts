import { TILE_IMAGE_SIZE, TILE_SIZE, TILE_SPACE } from "./constants.js";

function newTableElement(): HTMLTableElement {
    let table = document.createElement("table");
    table.style.borderSpacing = `${TILE_SPACE}px`;
    return table;
}

function newTableCellElement(): HTMLTableCellElement {
    let td = document.createElement("td");
    td.style.width = `${TILE_SIZE}px`
    td.style.height = `${TILE_SIZE}px`
    return td;
}

function createDisplayElement(num: number | null): HTMLImageElement {
    let img = document.createElement("img");
    if (num == null) return img;
    img.style.width = `${TILE_IMAGE_SIZE}px`
    img.style.height = `${TILE_IMAGE_SIZE}px`
    img.src = `images/${num}.png`;
    img.className = "tile-image"
    img.draggable = false
    return img;
}

export { newTableElement, newTableCellElement, createDisplayElement }