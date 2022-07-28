import * as missions from "./maps/";

import type { Instructions } from "../../common/types";
import { buildGrid } from "./lib/grid";
import { Lesson } from "./types";
import { createToshi } from "./lib/toshi";
import { delay, toCamelCase } from "./lib/helpers";
import { displayFailMessage } from "./lib/dom";

// @ts-ignore
const vscode = acquireVsCodeApi();

type Status = `mission${number}`;
const status: Status = "mission1";
let isGameInProgress = false;

async function afterInit(toshi: ReturnType<typeof createToshi>) {
  await delay(500);
  toshi.reveal();
}

function initLevel(lesson: Lesson) {
  const $container = buildGrid(lesson);
  const toshi = createToshi(Object.freeze(lesson));
  $container.appendChild(toshi.$toshi);

  afterInit(toshi);
  return toshi;
}

function main() {
  const $runButton = document.getElementById("run")!;

  const toshi = initLevel(missions.mission1);

  function gameIsRunning() {
    isGameInProgress = true;
    $runButton.setAttribute("disabled", "true");
    toshi.reset();
  }

  function gameIsDone() {
    isGameInProgress = false;
    $runButton.removeAttribute("disabled");
  }

  function win() {}

  function fail(reason: string) {
    console.log("fail", reason);
    displayFailMessage(`Mission failed (reason: ${reason})`);
  }

  window.addEventListener("message", async (event) => {
    await delay(200); // small delay for the game to reset
    const instructions = event.data as Instructions;

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
    const actions = instructions.filter(({ target }) => target === "game");
    for await (const action of actions) {
      if (action.target === "game" && action.type === "action") {
        const [func, ...args] = action.args;
        const method = toCamelCase(func);
        console.log("method", method);
        if (Object.keys(toshi).includes(method)) {
          try {
            // TODO: type safety
            // @ts-ignore
            await toshi[method](...args);
          } catch (err) {
            if (err && err instanceof Error) {
              fail(err.message);
            }
            break;
          }
        }
      }
    }

    gameIsDone();
  });

  $runButton.addEventListener("click", function runCode() {
    if (isGameInProgress) return;
    vscode.postMessage({ command: "runCode" });
    gameIsRunning();
  });
}

document.addEventListener("DOMContentLoaded", main);
