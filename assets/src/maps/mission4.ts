import { Lesson } from "../types";

export const mission4: Lesson = {
  grid: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "S", "n", "n", "W", "n", "n", "n", "n"],
    ["n", "n", "S", "S", "n", "W", "n", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "n", "n", "n", "n", "n"],
    ["n", "W", "S", "S", "S", "S", "S", "S", "S", "n"],
  ],
  entities: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "X"],
    ["n", "n", "n", "n", "n", "B", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["B", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  player: {
    coords: { x: 1, y: 5 },
    direction: "E",
  },
  ship: {
    coords: { x: 0, y: 9 },
    direction: "E",
  },
};
