import { Uri, Webview } from "vscode";
// import { Grid } from "./types";

export const Head = (webview: Webview, stylePath: Uri, nonce: string) => {
  const csp = `default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';`;

  return /* html */ `<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <meta charset="UTF-8" />
    <title>Toshi</title>
    <link href="${webview.asWebviewUri(stylePath)}" rel="stylesheet" />
  </head>`;
};

// export const GridView = (grid: Grid) => {
//   return /* html */ `<div id="grid">
//     ${grid
//       .map(
//         (line) => /* html */ `<div class="line">
//           ${line.map((t) => /* html */ `<div class="tile">${t}</div>`).join("")}
//         </div>`
//       )
//       .join("")}
//     </div>`;
// };
