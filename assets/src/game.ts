import * as lesson1 from "./maps/lesson1";

import type { Coord, Entity, Tile } from "./types";
import type { Instructions } from "../../common/types";

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });

// @ts-ignore
const vscode = acquireVsCodeApi();

function createLine() {
  const $line = document.createElement("div");
  $line.classList.add("line");
  return $line;
}

function createTile(type: Tile, coord: Coord) {
  const $info = document.createElement("span");
  $info.classList.add("info");
  $info.textContent = `${coord.x}x${coord.y}`;

  const $tile = document.createElement("div");
  $tile.classList.add("tile");
  $tile.classList.add(type);
  $tile.appendChild($info);

  return $tile;
}

function createEntity(type: Entity) {
  const $entity = document.createElement("div");
  $entity.classList.add("entity");
  $entity.classList.add(type);

  const $entityContainer = document.createElement("div");
  $entityContainer.classList.add("entity-container");
  $entityContainer.appendChild($entity);

  return $entityContainer;
}

function main() {
  const $container = document.querySelector("#grid")!;
  const { grid, entities } = lesson1;
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

  window.addEventListener("message", async (event) => {
    console.log(event.data);
    const instructions = event.data as Instructions;
    const actions = instructions.filter(({ target }) => target === "game");

    // Handle console events
    const consoleEvents = instructions.filter(
      ({ target }) => target === "console",
    );
    const $console = <HTMLTextAreaElement>document.getElementById("console");
    if ($console != null) {
      $console.value = "";
      for (const event of consoleEvents) {
        if (event.type === "error") {
          $console.value += event.text;
        } else if (event.type === "print" || event.type === "result") {
          $console.value += `${event.type}: ${event.text}\n`;
        }
      }
    }

    // Handle game actions
    for await (const action of actions) {
      if (action.target === "game" && action.type === "action") {
        const [func, ...args] = action.args;
        console.log(func, args);
      }
      await delay(1000);
    }
  });

  document.getElementById("run")?.addEventListener("click", function runCode() {
    vscode.postMessage({ command: "runCode" });
  });
}

document.addEventListener("DOMContentLoaded", main);
