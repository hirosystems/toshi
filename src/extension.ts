import * as vscode from "vscode";
import { window, workspace } from "vscode";

import { GameViewProvider } from "./Game/GameView";
import type { Instructions } from "../common/types";

import init, { interpret } from "../../clarinet/components/clarity-repl/pkg";

const initWasm = init();

const { fs } = workspace;

export async function activate(context: vscode.ExtensionContext) {
  console.log('"toshi-extension" is now active');
  vscode.commands.executeCommand("toshi-extension.gameView.focus");
  vscode.commands.executeCommand("workbench.action.positionPanelRight");
  vscode.commands.executeCommand("workbench.action.maximizeEditor");

  const gameViewProvider = new GameViewProvider(context.extensionUri);
  context.subscriptions.push(
    window.registerWebviewViewProvider(
      GameViewProvider.viewType,
      gameViewProvider,
    ),
  );

  const runCode = vscode.commands.registerCommand(
    "toshi-extension.runCode",
    () => run(gameViewProvider),
  );
  context.subscriptions.push(runCode);

  const startCommand = vscode.commands.registerCommand(
    "toshi-extension.launchToshi",
    () => {
      vscode.commands.executeCommand("toshi-extension.gameView.focus");
    },
  );
  context.subscriptions.push(startCommand);

  // make sure wasm is loaded before calling the repl
  await initWasm;
}

export function deactivate() {}

function fileArrayToString(bufferArray: Uint8Array) {
  return Array.from(bufferArray)
    .map((item) => String.fromCharCode(item))
    .join("");
}

async function run(gameViewProvider: GameViewProvider) {
  const activeFile = vscode.window.activeTextEditor?.document.uri;
  if (!activeFile) {
    window.showErrorMessage("No active file.");
    return;
  }

  // Read the user's code
  const userCode = fileArrayToString(await fs.readFile(activeFile));

  // Read the hidden code
  const hiddenCode = require(`./clarity/${activeFile.fsPath.split("/").pop()}`);
  const result = interpret(`${hiddenCode}\n${userCode}`);
  const instructions: Instructions = [];

  const ACTION_PREFIX = '"@ACTION@: ';

  for (const event of result.events) {
    if (event.type !== "contract_event") continue;
    if (event.contract_event.topic !== "print") continue;
    const printed = event.contract_event.value;
    if (printed.startsWith(ACTION_PREFIX)) {
      const action = printed.substring(
        ACTION_PREFIX.length,
        printed.length - 1,
      );
      const args = action.split(" ");
      instructions.push({
        target: "game",
        type: "action",
        args,
      });
    } else {
      instructions.push({
        target: "console",
        type: "print",
        text: printed,
      });
    }
  }

  for (const diagnostic of result.diagnostics) {
    instructions.push({
      target: "console",
      type: "error",
      text: diagnostic,
    });
  }

  if (result.result) {
    instructions.push({
      target: "console",
      type: "result",
      text: result.result,
    });
  }

  gameViewProvider.sendInstructions(instructions);
}
