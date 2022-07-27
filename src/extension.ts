import * as vscode from "vscode";
import { window, workspace, Uri } from "vscode";

import { GameViewProvider } from "./Game/GameView";
import type { Instructions } from "../common/types";
// import init, { repl } from "../../clarinet/components/clarity-repl/pkg"

// const initWasm = init();

const { workspaceFolders } = workspace;
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

  const startCommand = vscode.commands.registerCommand(
    "toshi-extension.launchToshi",
    () => {
      window.showInformationMessage("hello world from toshi-extension");
      vscode.commands.executeCommand("toshi-extension.gameView.focus");
    },
  );
  context.subscriptions.push(startCommand);

  // make sure wasm is loaded before calling the repl
  // await initWasm;
  /*
    > instruction = sendToRepl(custom.clar + game.clar)
    // instructions == [toshi-move-forward, toshi-fight]
    > sendToGameWebView(instructions)
  */
}

export function deactivate() {}
