import { Lesson } from "../types";

export const mission3: Lesson = {
  grid: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "W"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "S", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "S", "S", "n", "W", "n", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "W", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "W", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  entities: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "B", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  player: {
    coords: { x: 1, y: 5 },
    direction: "E",
  },
  ship: {
    coords: { x: 5, y: 2 },
    direction: "E",
  },
};
