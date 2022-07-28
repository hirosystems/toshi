import * as missions from "./maps/";

import type { Instructions } from "../../common/types";
import { buildGrid, deleteGrid } from "./lib/grid";
import { Lesson } from "./types";
import { createToshi } from "./lib/toshi";
import { delay, toCamelCase } from "./lib/helpers";
import {
  appendCaptainLog,
  deleteCaptainLogs,
  enableNextButton,
} from "./lib/dom";

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

  let toshi = initLevel(missions.mission1);

  function gameIsRunning() {
    isGameInProgress = true;
    $runButton.setAttribute("disabled", "true");
    toshi.reset();
  }

  function gameIsDone() {
    isGameInProgress = false;
    $runButton.removeAttribute("disabled");
  }

  function win() {
    appendCaptainLog("Success");
    enableNextButton();
  }

  function fail(reason: string) {
    appendCaptainLog(`Mission failed (reason: ${reason})`);
  }

  window.addEventListener("message", async (event) => {
    await delay(200); // small delay for the game to reset
    const instructions = event.data as Instructions;

    // Handle console events
    const consoleEvents = instructions.filter(
      ({ target }) => target === "console",
    );
    for (const event of consoleEvents) {
      if (event.type === "error") {
        appendCaptainLog(event.text);
      } else if (event.type === "print" || event.type === "result") {
        appendCaptainLog(`${event.type}: ${event.text}`);
      }
    }

    // Handle game actions
    const actions = instructions.filter(({ target }) => target === "game");
    for await (const action of actions) {
      if (action.target === "game" && action.type === "action") {
        const [func, ...args] = action.args;
        const method = toCamelCase(func);
        console.log("method", method);
        let finished: boolean | undefined;
        if (Object.keys(toshi).includes(method)) {
          try {
            // TODO: type safety
            // @ts-ignore
            finished = await toshi[method](...args);
          } catch (err) {
            if (err && err instanceof Error) {
              fail(err.message);
            }
            break;
          }
          // toshi.collectCoin should be the last function called
          // it's the only one that return true
          if (finished === true) {
            console.log("done");
            win();
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

  document.querySelector("#next")!.addEventListener("click", function () {
    console.log("ohoy");
    deleteCaptainLogs();
    deleteGrid();
    toshi = initLevel(missions.mission2);
  });
}

document.addEventListener("DOMContentLoaded", main);
