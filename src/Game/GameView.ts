import * as vscode from "vscode";
import { window, Uri, workspace } from "vscode";
import { Instructions } from "../../common/types";

import { Head } from "./html";
import { getNonce } from "./utils";

type ViewEvent = {
  command: string;
  data: Record<string, any>;
};

const { workspaceFolders } = workspace;
const { uri: workspaceUri } = workspaceFolders![0];

function isValidEvent(e: unknown): e is ViewEvent {
  if (!e || typeof e !== "object") {
    return false;
  }
  return "command" in e;
}

export class GameViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "toshi-extension.gameView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public sendInstructions(instruction: Instructions) {
    this._view?.webview.postMessage(instruction);
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    this._view.webview.onDidReceiveMessage(async (e: unknown) => {
      if (!isValidEvent(e)) return;

      if (e.command === "openFile") {
        const lessonFile: Uri = Uri.joinPath(
          workspaceUri,
          `lesson${e.data.lessonNumber}.clar`,
        );
        vscode.commands.executeCommand("workbench.action.closeAllEditors");
        const nextDocument = await workspace.openTextDocument(lessonFile);
        await window.showTextDocument(nextDocument, 1, false);
      }

      if (e.command === "runCode") {
        vscode.commands.executeCommand("toshi-extension.runCode");
      }
    });

    webviewView.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    const { _view: view } = this;
    if (!view) return "";
    const nonce = getNonce();
    const root = view.webview.options.localResourceRoots![0];

    const scriptSrc = vscode.Uri.joinPath(root, "./assets/dist/game.js");
    const syleSrcs = [
      vscode.Uri.joinPath(root, "./assets/styles/animations.css"),
      vscode.Uri.joinPath(root, "./assets/styles/game.css"),
      vscode.Uri.joinPath(root, "./assets/styles/logs.css"),
    ];

    return /* html */ `<!DOCTYPE html>
      <html lang="en">
      ${Head(view.webview, syleSrcs, nonce)}

      <body>
        <div id="welcome-screen">
          <h1>ClearWaters</h1>
          <h3>A Clarity Smart Contract Game</h3>
          <button id="start">Press Start</button>
        </div>
        <div id="game" class="hidden">
          <header>
            <div id="controls">
              <button id="prev" disabled></button>
              <button id="run"></button>
              <button id="next" disabled></button>
            </div>

          </header>
          <main id="grid"></main>
          <div id="entities-grid"></div>
          <footer>
            <div id="log-title"></div>
            <div id="console"></div>
          </footer>
        </div>
        <script nonce=${nonce} src="${scriptSrc}"></script>
      </body>
      </html>`;
  }
}
