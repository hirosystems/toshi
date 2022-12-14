import { Lesson } from "../types";

export const mission2: Lesson = {
  grid: [
    ["S", "S", "S", "n", "n", "n", "n", "n", "n", "n"],
    ["S", "S", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["S", "S", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["S", "S", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "S", "S", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "S", "S", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "S", "S", "S", "S", "S", "S", "n", "n"],
    ["n", "n", "S", "S", "S", "S", "S", "S", "n", "n"],
    ["n", "n", "S", "S", "S", "S", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  entities: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["P", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "P", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "P", "n", "n"],
    ["n", "n", "n", "n", "n", "X", "n", "P", "n", "n"],
    ["n", "n", "P", "P", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  player: {
    coords: { x: 2, y: 4 },
    direction: "S",
  },
};
