import { Coords, Entity, Lesson, Tile } from "../types";
import { createDiv } from "./dom";

export const GRID_SIZE = 10;

function createLine() {
  return createDiv("line");
}

function createTile(type: Tile, coord: Coords) {
  const $info = createDiv("info", `${coord.x}x${coord.y}`);

  const variation = Math.floor(Math.random() * 2);
  const rotate =
    type === "S"
      ? Math.floor(Math.random() * 4)
      : Math.floor(Math.random() * 2);

  const $tile = createDiv([
    "tile",
    type,
    variation === 1 ? "one" : "two",
    `rotate${rotate}`,
  ]);
  $tile.appendChild($info);
  $tile.setAttribute("id", `coord-${coord.x}-${coord.y}`);

  return $tile;
}

function createEntity(type: Entity) {
  const $entity = createDiv(["entity", type]);
  if (type === "T") $entity.classList.add("hidden");

  const $entityContainer = createDiv("entity-container");
  $entityContainer.appendChild($entity);

  return $entityContainer;
}

export function buildGrid(lesson: Lesson) {
  const $container = document.querySelector("#grid")!;
  const { grid, entities } = lesson;
  grid.forEach((line, x) => {
    const $line = createLine();
    line.forEach((tile, y) => {
      const $tile = createTile(tile, { x, y });

      const entity = entities[x][y];
      if (entity !== "n") {
        const $entity = createEntity(entity);
        $tile.appendChild($entity);
      }
      $line.appendChild($tile);
    });
    $container.appendChild($line);
  });

  return $container;
}

export function deleteGrid() {
  const $container = document.querySelector("#grid")!;
  $container.replaceChildren();
}
