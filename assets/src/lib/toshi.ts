import { Direction, Player } from "../types";
import { createDiv } from "./dom";
import { GRID_SIZE } from "./grid";
import { delay } from "./helpers";

const leftTurns: Record<Direction, Direction> = {
  E: "N",
  N: "W",
  W: "S",
  S: "E",
};
const rightTurns: Record<Direction, Direction> = {
  E: "S",
  S: "W",
  W: "N",
  N: "E",
};

export function createToshi(player: Player) {
  const $toshi = createDiv("toshi");
  const $img = createDiv("toshi-img");
  $toshi.append($img);

  const state = { ...player };

  async function _setPosition() {
    const { x, y } = state.coords;
    $toshi.style.left = `${x * GRID_SIZE}%`;
    $toshi.style.top = `${y * GRID_SIZE}%`;
    await delay(500);
  }

  async function _setDirection() {
    $toshi.classList.remove("dir-N", "dir-S", "dir-E", "dir-W");
    $toshi.classList.add(`dir-${state.direction}`);
    await delay(150);
  }

  _setPosition();
  _setDirection();

  function reveal() {
    $toshi.classList.add("visible");
  }

  function getTurn(to: "left" | "right") {
    const { direction: dir } = state;
    return to === "left" ? leftTurns[dir] : rightTurns[dir];
  }

  async function turnLeft() {
    state.direction = getTurn("left");
    await _setDirection();
  }

  async function turnRight() {
    state.direction = getTurn("right");

    await _setDirection();
  }

  async function moveForward() {
    if (state.direction === "N") state.coords.y -= 1;
    if (state.direction === "S") state.coords.y += 1;
    if (state.direction === "W") state.coords.x -= 1;
    if (state.direction === "E") state.coords.x += 1;

    const { x, y } = state.coords;
    if (x >= GRID_SIZE || x < 0 || y >= GRID_SIZE || y < 0) {
      // TODO: handle illegal moves
      return;
    }
    await _setPosition();
  }

  return {
    $toshi,
    reveal,
    turnLeft,
    turnRight,
    moveForward,
  };
}
