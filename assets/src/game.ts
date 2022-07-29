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
  disablePrevButton,
  enableNextButton,
  enablePrevButton,
} from "./lib/dom";

// @ts-ignore
const vscode = acquireVsCodeApi();

let currentLesson = 2;
const lastLesson = 4;
let isGameInProgress = false;
if (currentLesson > 1) enablePrevButton();

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

  function initMap() {
    deleteCaptainLogs();
    deleteGrid();
    // @ts-ignore
    toshi = initLevel(missions[`mission${currentLesson}`]);
  }

  function gameIsRunning() {
    isGameInProgress = true;
    $runButton.setAttribute("disabled", "true");
    disableNextButton();
    disablePrevButton();
    toshi.reset();
  }

  function gameIsDone() {
    isGameInProgress = false;
    $runButton.removeAttribute("disabled");
    if (currentLesson > 1) enablePrevButton();
    if (toshi.noSuccess) enableNextButton();
  }

  function win() {
    appendCaptainLog("success", "Success");
    if (currentLesson !== lastLesson) {
      enableNextButton();
    }
  }

  function reasonToMessage(reason: string) {
    switch (reason) {
      case "moving-out-of-grid":
        return "Toshi tried to escape his square";
      case "toshi-can-not-swim":
        return "Toshi can't swim";
      case "ship-can-not-go-on-land":
        return "The ship's run aground";
      case "path-is-blocked":
        return "Toshi is blocked";
      case "must-be-on-ship":
        return "Toshi can't get off a ship he's not on";
      case "nothing-to-collect":
        return "Nothing to collect here";
      default:
        return reason;
    }
  }

  function fail(reason: string) {
    appendCaptainLog("error", `Mission failed: ${reasonToMessage(reason)}`);
  }

  window.addEventListener("message", async (event) => {
    await delay(100); // small delay for the game to reset
    const instructions = event.data as Instructions;

    for (const instruction of instructions) {
      if (instruction.target === "console") {
        appendCaptainLog(instruction.type, instruction.text);
      } else if (instruction.type === "action") {
        const [func, ...args] = instruction.args;
        const method = toCamelCase(func);
        let finished: boolean | undefined;
        if (method === "fail") {
          fail(args.join(" "));
          return;
        } else if (Object.keys(toshi).includes(method)) {
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

  document.querySelector("#prev")!.addEventListener("click", function () {
    if (currentLesson === 1) return;
    currentLesson -= 1;
    if (currentLesson === 1) disablePrevButton();
    initMap();
    vscode.postMessage({
      command: "openFile",
      data: { lessonNumber: currentLesson },
    });
  });

  document.querySelector("#next")!.addEventListener("click", function () {
    if (currentLesson === lastLesson) {
      // TODO: handle end state
      return;
    }
    disableNextButton();
    enablePrevButton();
    currentLesson += 1;
    initMap();
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
