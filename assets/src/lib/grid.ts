import { Coord, Entity, Lesson, Tile } from "../types";
import { createDiv } from "./dom";

export const GRID_SIZE = 10;

function createLine() {
  return createDiv("line");
}

function createTile(type: Tile, coord: Coord) {
  const $info = document.createElement("div");
  $info.classList.add("info");
  $info.textContent = `${coord.x}x${coord.y}`;

  const $tile = createDiv(["tile", type]);
  $tile.appendChild($info);

  return $tile;
}

function createEntity(type: Entity) {
  const $entity = createDiv(["entity", type]);

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
