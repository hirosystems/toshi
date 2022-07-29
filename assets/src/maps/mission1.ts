import { Lesson } from "../types";

export const mission1: Lesson = {
  grid: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "S", "S", "S", "S", "n", "n", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "S", "n", "n"],
    ["n", "S", "S", "S", "S", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "S", "n", "S", "S", "n", "n", "n"],
    ["n", "S", "S", "n", "n", "S", "S", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "S", "S", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "S", "S", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "S", "S", "S"],
  ],
  entities: [
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "P", "P", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
    ["n", "n", "n", "n", "n", "n", "n", "n", "n", "n"],
  ],
  player: {
    coords: { x: 5, y: 5 },
    direction: "S",
  },
  noSuccess: true,
};
