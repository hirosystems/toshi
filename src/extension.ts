import * as vscode from "vscode";
import { window, workspace, Uri } from "vscode";

import { GameViewProvider } from "./Game/GameView";
import type { Instructions } from "../common/types";
// @ts-ignore
// import lesson1 from "./clarity/lesson1.clar";

import init, { interpret } from "../../clarinet/components/clarity-repl/pkg";

const initWasm = init();

const { workspaceFolders, fs } = workspace;
const { uri: workspaceUri } = workspaceFolders![0];

const states = ["lesson1", "mission1"];
let currentState = 0;

export async function activate(context: vscode.ExtensionContext) {
  console.log('"toshi-extension" is now active');
  vscode.commands.executeCommand("toshi-extension.gameView.focus");
  vscode.commands.executeCommand("workbench.action.positionPanelRight");
  // vscode.commands.executeCommand("workbench.action.maximizeEditor");

  const gameFile: vscode.Uri = Uri.joinPath(workspaceUri, `${states[0]}.clar`);
  vscode.workspace.openTextDocument(gameFile);

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

  const nextLesson = vscode.commands.registerCommand(
    "toshi-extension.nextLesson",
    () => {
      if (currentState === states.length - 1) {
        window.showErrorMessage("No more lessons.");
        return;
      }

      currentState += 1;
      const current = states[currentState];

      const gameFile: vscode.Uri = Uri.joinPath(
        workspaceUri,
        `${current}.clar`,
      );
      window.showInformationMessage(`opening: ${gameFile}`);
      vscode.workspace.openTextDocument(gameFile);
    },
  );
  context.subscriptions.push(nextLesson);

  const prevLesson = vscode.commands.registerCommand(
    "toshi-extension.prevLesson",
    () => {
      if (currentState === 0) {
        window.showErrorMessage("No more lessons.");
        return;
      }

      currentState -= 1;
      const current = states[currentState];

      const gameFile: vscode.Uri = Uri.joinPath(
        workspaceUri,
        `${current}.clar`,
      );
      vscode.workspace.openTextDocument(gameFile);
    },
  );
  context.subscriptions.push(prevLesson);

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
