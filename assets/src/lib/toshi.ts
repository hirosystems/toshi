import produce from "immer";

import { Coords, Direction, Lesson } from "../types";
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

const delays = {
  move: 400,
  turn: 100,
};

export function createToshi(lesson: Readonly<Lesson>) {
  const player = Object.freeze(lesson.player);
  const ship = Object.freeze(lesson.ship);
  let state = produce(player, (next) => next);
  let shipState = produce(ship, (next) => next);

  const $toshi = createDiv("toshi");
  const $img = createDiv("toshi-img");
  $toshi.append($img);

  let $ship: undefined | HTMLDivElement;
  if (lesson.ship) {
    $ship = createDiv("ship");
    const $shipImg = createDiv("ship-img");
    $ship.append($shipImg);
    const { x, y } = lesson.ship.coords;
    $ship.style.left = `${x * GRID_SIZE}%`;
    $ship.style.top = `${y * GRID_SIZE}%`;
  }

  function _setShipPosition() {
    if (!shipState || !$ship) {
      console.warn("unexpected - no ship on the map");
      return;
    }
    const { x, y } = shipState.coords;
    $ship.style.left = `${x * GRID_SIZE}%`;
    $ship.style.top = `${y * GRID_SIZE}%`;
  }

  function _setPosition() {
    const { x, y } = state.coords;
    $toshi.style.left = `${x * GRID_SIZE}%`;
    $toshi.style.top = `${y * GRID_SIZE}%`;
  }

  function _setDirection() {
    $toshi.classList.remove("dir-N", "dir-S", "dir-E", "dir-W");
    $toshi.classList.add(`dir-${state.direction}`);
  }

  function _getAheadCoords(n = 1): Coords {
    const dir = state.direction;
    const { x, y } = state.coords;

    if (dir === "N") return { x, y: y - n };
    if (dir === "S") return { x, y: y + n };
    if (dir === "W") return { x: x - n, y };
    return { x: x + n, y };
  }

  function _boardShip() {
    if (!$ship) {
      console.warn("no ship on the map");
      return;
    }
    state = produce(state, (next) => {
      next.onShip = true;
    });
    $toshi.classList.add("on-ship");
    $ship.classList.add("hidden");
  }

  _setDirection();
  _setPosition();

  function reset() {
    $toshi.classList.add("no-transition");
    $toshi.classList.remove("on-ship");
    if ($ship) $ship.classList.remove("hidden");
    state = produce(player, (nextState) => nextState);
    shipState = produce(ship, (next) => next);
    document.querySelectorAll(".entity.X.hidden").forEach(($el) => {
      $el.classList.remove("hidden");
    });
    document.querySelectorAll(".entity.T.hidden").forEach(($el) => {
      $el.classList.add("hidden");
    });

    _setDirection();
    _setPosition();
    if (lesson.ship) _setShipPosition();
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
    await delay(delays.turn);
  }

  async function turnRight() {
    state = produce(state, (next) => {
      next.direction = getTurn("right");
    });
    _setDirection();
    await delay(delays.turn);
  }

  async function moveForward() {
    state = produce(state, (next) => {
      next.coords = _getAheadCoords();
    });

    const { x, y } = state.coords;

    if (x >= GRID_SIZE || x < 0 || y >= GRID_SIZE || y < 0) {
      throw new Error("moving-out-of-grid");
    }

    // toshi is not on ship and tries to go into the water
    if (!state.onShip && lesson.grid[y][x] === "n") {
      throw new Error("toshi-can-not-swim");
    }

    // toshi is on ship and tries to go on the land
    if (state.onShip && lesson.grid[y][x] !== "n") {
      throw new Error("ship-can-not-go-on-land");
    }

    if (lesson.entities[y][x] !== "n") {
      throw new Error("path-is-blocked");
    }

    _setPosition();
    await delay(delays.move);
  }

  async function board() {
    const { x, y } = _getAheadCoords();
    const { ship } = lesson;
    if (
      !ship ||
      !shipState ||
      shipState.coords.x !== x ||
      shipState.coords.y !== y
    ) {
      throw new Error("no-ship-ahead");
    }

    state = produce(state, (next) => {
      next.coords = _getAheadCoords();
    });
    _setPosition();
    await delay(delays.move);
    _boardShip();
  }

  async function getOff() {
    const { x, y } = _getAheadCoords();

    if (!state.onShip) {
      throw new Error("must-be-on-ship");
    }

    if (lesson.grid[y][x] === "n") {
      throw new Error("toshi-can-not-swim");
    }

    shipState = produce(shipState, (next) => {
      if (!next) return;
      next.coords.x = state.coords.x;
      next.coords.y = state.coords.y;
    });
    _setShipPosition();

    state = produce(state, (next) => {
      next.coords = _getAheadCoords();
      next.onShip = false;
    });
    $toshi.classList.remove("on-ship");
    $ship?.classList.remove("hidden");
    _setPosition();

    // *hack for mission 3*
    // the win condition is to reach [9, 0]
    // if done, `return true` will trigger "win()"
    // TODO: improve  win condition
    if (state.coords.x === 9 && state.coords.y === 0) {
      return true;
    }
  }

  async function collectCoin() {
    const { x, y } = _getAheadCoords();
    const entityAhead = lesson.entities[y][x];
    if (!["X", "T"].includes(entityAhead)) {
      throw new Error("nothing-to-collect");
    }

    // if bottle, toshi "takes" it, we it it
    const $bottle = <HTMLDivElement>document.querySelector(".entity.X");
    console.log("-".repeat(20));
    console.log("$bottle", $bottle);
    if ($bottle) {
      $bottle.classList.add("hidden");
    }
    // if treasure, toshi "digs" it, we show it
    const $treasure = <HTMLDivElement>document.querySelector(".entity.T");
    if ($treasure) {
      $treasure.classList.remove("hidden");
    }
    return true;
  }

  return {
    $toshi,
    $ship,
    reset,
    reveal,
    board,
    getOff,
    turnLeft,
    turnRight,
    collectCoin,
    moveForward,
    noSuccess: lesson.noSuccess,
  };
}
