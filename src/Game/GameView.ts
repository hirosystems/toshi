import * as vscode from "vscode";

import { Head } from "./html";
import { getNonce } from "./utils";

const { window } = vscode;

type ViewEvent = {
  command: string;
  data: Record<string, any>;
};

function isValidEvent(e: unknown): e is ViewEvent {
  if (!e || typeof e !== "object") {
    return false;
  }
  return "command" in e && "data" in e;
}

export class GameViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "toshi-extension.gameView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    this._view.webview.onDidReceiveMessage((e: unknown) => {
      if (!isValidEvent(e) || !window.activeTextEditor) return;

      if (e.command === "blbl") {
        // window.activeTextEditor.revealRange(r);
        // window.activeTextEditor.setDecorations(selectedDecoration, [r]);
      }
    });

    webviewView.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    const { _view: view } = this;
    if (!view) return "";
    const nonce = getNonce();

    const scriptSrc = vscode.Uri.joinPath(
      view.webview.options.localResourceRoots![0],
      "./assets/dist/game.js"
    );
    const syleSrc = vscode.Uri.joinPath(
      view.webview.options.localResourceRoots![0],
      "./assets/styles/game.css"
    );

    const clickHandler = () => {
      console.log("hello");
    };

    return /* html */ `<!DOCTYPE html>
      <html lang="en">
      ${Head(view.webview, syleSrc, nonce)}

      <body>
        <div id="game">
          <header id="controls">
            <button id="run" onclick="${clickHandler}">> Run</button>
          </header>
          <main id="grid"></main>
          <footer></footer>
        </div>
        <script nonce=${nonce} src="${scriptSrc}"></script>
      </body>
      </html>`;
  }
}
