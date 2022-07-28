import { lesson1 } from "./maps/lesson1";

import type { Instructions } from "../../common/types";
import { buildGrid } from "./lib/grid";
import { Lesson } from "./types";
import { createToshi } from "./lib/toshi";
import { delay, toCamelCase } from "./lib/helpers";

// @ts-ignore
const vscode = acquireVsCodeApi();

async function afterInit(toshi: ReturnType<typeof createToshi>) {
  await delay(500);
  toshi.reveal();
}

function initLevel(lesson: Lesson) {
  const $container = buildGrid(lesson);
  const toshi = createToshi(lesson.player);
  $container.appendChild(toshi.$toshi);

  afterInit(toshi);
  return toshi;
}

function main() {
  const toshi = initLevel(lesson1);

  window.addEventListener("message", async (event) => {
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
        const method = toCamelCase(func);
        if (Object.keys(toshi).includes(method)) {
          // TODO: type safety
          // @ts-ignore
          await toshi[method](...args);
        }
      }
    }
  });

  document.getElementById("run")?.addEventListener("click", function runCode() {
    vscode.postMessage({ command: "runCode" });
  });
}

document.addEventListener("DOMContentLoaded", main);
