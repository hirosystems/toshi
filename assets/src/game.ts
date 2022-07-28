import * as missions from "./maps/";

import type { Instructions } from "../../common/types";
import { buildGrid, deleteGrid } from "./lib/grid";
import { Lesson } from "./types";
import { createToshi } from "./lib/toshi";
import { delay, SPEED, toCamelCase } from "./lib/helpers";
import {
  appendCaptainLog,
  deleteCaptainLogs,
  disableNextButton,
  enableNextButton,
} from "./lib/dom";

// @ts-ignore
const vscode = acquireVsCodeApi();

let currentLesson = 1;
const lastLesson = 3;
let isGameInProgress = false;

async function afterInit(toshi: ReturnType<typeof createToshi>) {
  await delay(300);
  toshi.reveal();
}

function initLevel(lesson: Lesson) {
  const $container = buildGrid(lesson);
  const toshi = createToshi(Object.freeze(lesson));
  $container.appendChild(toshi.$toshi);
  if (toshi.$ship) {
    $container.appendChild(toshi.$ship);
  }

  afterInit(toshi);
  return toshi;
}

function main() {
  const $runButton = document.getElementById("run")!;

  let toshi: ReturnType<typeof initLevel>;

  function gameIsRunning() {
    isGameInProgress = true;
    $runButton.setAttribute("disabled", "true");
    toshi.reset();
  }

  function gameIsDone() {
    isGameInProgress = false;
    $runButton.removeAttribute("disabled");
    if (toshi.noSuccess) {
      enableNextButton();
    }
  }

  function win() {
    appendCaptainLog("Success");
    enableNextButton();
  }

  function fail(reason: string) {
    appendCaptainLog(`Mission failed (reason: ${reason})`);
  }

  window.addEventListener("message", async (event) => {
    await delay(100); // small delay for the game to reset
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
          // toshi.collectCoin() should be the last function called
          // it's the only one that return true
          if (finished === true) {
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
    disableNextButton();
    if (currentLesson === lastLesson) {
      // TODO: handle end state
      return;
    }
    currentLesson += 1;
    deleteCaptainLogs();
    deleteGrid();
    // @ts-ignore
    toshi = initLevel(missions[`mission${currentLesson}`]);
    vscode.postMessage({
      command: "openFile",
      data: { lessonNumber: currentLesson },
    });
  });

  // start is pretty much the same as next
  const $start = document.querySelector("#start")!;
  $start.addEventListener("click", function () {
    deleteCaptainLogs();
    deleteGrid();
    document.querySelector("#game")?.classList.remove("hidden");
    document.querySelector("#welcome-screen")?.classList.add("hidden");
    // @ts-ignore
    toshi = initLevel(missions[`mission${currentLesson}`]);

    vscode.postMessage({
      command: "openFile",
      data: { lessonNumber: currentLesson },
    });
  });
  if (SPEED > 1) $start.dispatchEvent(new Event("click"));
}

document.addEventListener("DOMContentLoaded", main);
