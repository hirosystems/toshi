import produce from "immer";

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

export function createToshi(player: Readonly<Player>) {
  const $toshi = createDiv("toshi");
  const $img = createDiv("toshi-img");
  $toshi.append($img);

  let state = produce(player, (nextState) => nextState);

  function _setPosition() {
    const { x, y } = state.coords;
    $toshi.style.left = `${x * GRID_SIZE}%`;
    $toshi.style.top = `${y * GRID_SIZE}%`;
  }

  function _setDirection() {
    $toshi.classList.remove("dir-N", "dir-S", "dir-E", "dir-W");
    $toshi.classList.add(`dir-${state.direction}`);
  }

  _setDirection();
  _setPosition();

  function reset() {
    $toshi.classList.add("no-transition");
    state = produce(player, (nextState) => nextState);
    _setDirection();
    _setPosition();
    setTimeout(() => {
      $toshi.classList.remove("no-transition");
    }, 10);
  }

  function reveal() {
    $toshi.classList.add("visible");
  }

  function getTurn(to: "left" | "right") {
    const { direction: dir } = state;
    return to === "left" ? leftTurns[dir] : rightTurns[dir];
  }

  async function turnLeft() {
    state = produce(state, (next) => {
      next.direction = getTurn("left");
    });
    _setDirection();
    await delay(100);
  }

  async function turnRight() {
    state = produce(state, (next) => {
      next.direction = getTurn("right");
    });
    _setDirection();
    await delay(100);
  }

  async function moveForward() {
    state = produce(state, (next) => {
      if (state.direction === "N") next.coords.y -= 1;
      if (state.direction === "S") next.coords.y += 1;
      if (state.direction === "W") next.coords.x -= 1;
      if (state.direction === "E") next.coords.x += 1;
    });

    const { x, y } = state.coords;
    if (x >= GRID_SIZE || x < 0 || y >= GRID_SIZE || y < 0) {
      // TODO: handle illegal moves
      return;
    }
    _setPosition();
    await delay(400);
  }

  return {
    $toshi,
    reset,
    reveal,
    turnLeft,
    turnRight,
    moveForward,
  };
}
