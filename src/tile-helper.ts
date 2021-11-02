import { HORIZON_AMOUNT, VERTICAL_AMOUNT } from "./constants.js";
import { querySelectorAllAsList } from "./utils.js";

function getElement(x: number, y: number) {
  if (x < 0 || x >= HORIZON_AMOUNT) return null;
  if (y < 0 || y >= VERTICAL_AMOUNT) return null;
  for (let i of querySelectorAllAsList<HTMLTableCellElement>("td")) {
    if (i.position[0] == x && i.position[1] == y) return i;
  }
  return null;
}

export { getElement }