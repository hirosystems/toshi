const alphaNum =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function getNonce() {
  let text = "";
  for (let i = 0; i < 32; i++) {
    text += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  }
  return text;
}
