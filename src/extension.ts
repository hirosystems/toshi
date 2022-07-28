import * as vscode from "vscode";
import { window, workspace, Uri } from "vscode";

import { GameViewProvider } from "./Game/GameView";
import type { Instructions } from "../common/types";
import lesson1 from "./lessons/lesson1.clar";
import mission1 from "./missions/mission1.clar";

// // eslint-disable-next-line camelcase
import init, { interpret } from "../../clarinet/components/clarity-repl/pkg";

const initWasm = init();

const { workspaceFolders, fs } = workspace;
const { uri: workspaceUri } = workspaceFolders![0];

export async function activate(context: vscode.ExtensionContext) {
  console.log('"toshi-extension" is now active');
  vscode.commands.executeCommand("toshi-extension.gameView.focus");
  vscode.commands.executeCommand("workbench.action.positionPanelRight");
  // vscode.commands.executeCommand("workbench.action.maximizeEditor");

  const gameFile: vscode.Uri = Uri.joinPath(workspaceUri, "game.clar");
  vscode.workspace.openTextDocument(gameFile);

  const gameViewProvider = new GameViewProvider(context.extensionUri);
  context.subscriptions.push(
    window.registerWebviewViewProvider(
      GameViewProvider.viewType,
      gameViewProvider,
    ),
  );

  const testInstructions = vscode.commands.registerCommand(
    "toshi-extension.testInstructions",
    () => {
      const fake: Instructions = [
        {
          target: "console",
          type: "error",
          text: "error: unexpected '^'",
        },
        {
          target: "console",
          type: "print",
          text: "some string the user printed",
        },
        {
          target: "console",
          type: "result",
          text: "42",
        },
        {
          target: "game",
          type: "action",
          args: ["move-forward", 2],
        },
        {
          target: "game",
          type: "action",
          args: ["turn", "left"],
        },
        {
          target: "game",
          type: "action",
          args: ["move-forward", 1],
        },
        {
          target: "game",
          type: "action",
          args: ["fight"],
        },
      ];
      gameViewProvider.sendInstructions(fake);
    },
  );
  context.subscriptions.push(testInstructions);

  const ACTION_PREFIX = '"@ACTION@: ';

  const runCode = vscode.commands.registerCommand(
    "toshi-extension.runCode",
    async () => {
      // Read the user's input file
      const userCode = fileArrayToString(await fs.readFile(gameFile));

      const result = interpret(`${mission1}\n${userCode}`);
      const instructions: Instructions = [];

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
    },
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
