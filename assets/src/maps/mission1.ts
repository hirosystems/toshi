import { Lesson } from "../types";

export const mission1: Lesson = {
  grid: [
    ["S", "n", "n", "n", "n", "n", "n", "n", "n", "W"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  entities: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  player: {
    coords: { x: 2, y: 3 },
    direction: "E",
  },
  noSuccess: true,
};
