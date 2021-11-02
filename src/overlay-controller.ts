import { TILE_SIZE, TILE_SPACE } from "./constants.js";
import {
  Position,
  StraightConnect,
  ThreeStraightConnect,
  TwoStraightConnect,
} from "./model.js";

let canvas = document.querySelector<HTMLCanvasElement>("#game-overlay-canvas");
let context = canvas!.getContext("2d")!;

function drawLine(first: Position, second: Position) {
  context.beginPath();
  context.moveTo(getCenter(first.x), getCenter(first.y));
  context.lineTo(getCenter(second.x), getCenter(second.y));
  context.strokeStyle = "rgb(255, 0, 0)";
  context.lineWidth = 4;
  context.stroke();
  context.closePath();
}

function clearLine() {
  context.clearRect(0, 0, canvas!.width, canvas!.height);
}

function drawConnect(
  connect: StraightConnect | TwoStraightConnect | ThreeStraightConnect
) {
  context.save();
  if (connect instanceof StraightConnect) drawStraightConnect(connect);

  if (connect instanceof TwoStraightConnect) {
    drawStraightConnect(connect.first);
    drawStraightConnect(connect.second);
  }

  if (connect instanceof ThreeStraightConnect) {
    drawStraightConnect(connect.first);
    drawStraightConnect(connect.second);
    drawStraightConnect(connect.third);
  }
}

function drawStraightConnect(connect: StraightConnect) {
  drawLine(connect.first, connect.second);
}

function getCenter(coordinate: number) {
  return (
    (TILE_SIZE + TILE_SPACE) * (coordinate + 1) + TILE_SIZE / 2 + TILE_SPACE / 2
  );
}

export { drawConnect, clearLine };
