import { Uri, Webview } from "vscode";
// import { Grid } from "./types";

export const Head = (webview: Webview, stylePaths: Uri[], nonce: string) => {
  const csp = `default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource};; script-src 'nonce-${nonce}';`;

  return /* html */ `<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <meta charset="UTF-8" />
    <title>Toshi</title>
    ${stylePaths
      .map(
        (path) =>
          /* html */ `<link href="${webview.asWebviewUri(
            path,
          )}" rel="stylesheet" />`,
      )
      .join("")}
  </head>`;
};
