import { Entity, Lesson, Tile } from "../types";
import { createDiv } from "./dom";

export const GRID_SIZE = 10;

function createLine() {
  return createDiv("line");
}

function createTile(type: Tile) {
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
      const $tile = createTile(tile);

      const entity = entities[x][y];
      if (entity !== "n") {
        const $entity = createEntity(entity);
        $tile.appendChild($entity);
      }
      $line.appendChild($tile);
    });
    $container.appendChild($line);
  });

  buildEntitiesGrid(lesson);

  return $container;
}

function buildEntitiesGrid(lesson: Lesson) {
  const $container = document.querySelector("#entities-grid")!;
  const { entities } = lesson;
  entities.forEach((line, x) => {
    const $line = createLine();
    line.forEach((entity, y) => {
      const $tile = createDiv(["entity-tile"]);

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
  const $grid = document.querySelector("#grid")!;
  $grid.replaceChildren();
  const $entitiesGrid = document.querySelector("#entities-grid")!;
  $entitiesGrid.replaceChildren();
}
