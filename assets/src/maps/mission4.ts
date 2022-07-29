import { Lesson } from "../types";

export const mission4: Lesson = {
  grid: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "S", "S", "n", "n"],
    ["n", "n", "S", "n", "n", "S", "S", "S", "S", "n"],
    ["S", "S", "S", "S", "n", "S", "S", "S", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "n", "S", "S", "S", "S", "S", "S", "S", "n"],
    ["n", "n", "S", "S", "S", "S", "S", "S", "n", "n"],
    ["n", "n", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "n", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "W", "W", "S", "S", "S", "S", "S", "S", "n"],
  ],
  entities: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "X", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  player: {
    coords: { x: 1, y: 9 },
    direction: "E",
  },
  ship: {
    coords: { x: 0, y: 9 },
    direction: "E",
  },
};
