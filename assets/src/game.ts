import { Coord, Grid, Tile } from "./types";
console.log("hello world");

const grid: Grid = [
  ["s", "e", "e", "e", "e", "e", "e", "e", "e", "g"],
  ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
  ["e", "e", "e", "s", "s", "s", "s", "e", "e", "e"],
  ["e", "s", "s", "s", "g", "g", "s", "e", "e", "e"],
  ["e", "s", "g", "g", "g", "g", "s", "e", "e", "e"],
  ["e", "s", "g", "g", "g", "g", "s", "e", "e", "e"],
  ["e", "s", "s", "s", "s", "s", "s", "e", "e", "e"],
  ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
  ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
  ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
];
console.log("grid", grid);

function createLine() {
  const $line = document.createElement("div");
  $line.classList.add("line");
  return $line;
}
function createTile(type: Tile, coord: Coord) {
  const $tile = document.createElement("div");
  $tile.classList.add("tile");
  $tile.classList.add(type);
  $tile.textContent = `${coord.x}x${coord.y}`;
  return $tile;
}

const $container = document.querySelector("#grid")!;

grid.forEach((line, x) => {
  const $line = createLine();
  line.forEach((tile, y) => {
    $line.appendChild(createTile(tile, { x, y }));
  });
  $container?.appendChild($line);
});
