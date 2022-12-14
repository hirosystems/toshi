export function createDiv(classes: string[] | string, text?: string) {
  const $el = document.createElement("div");
  const classesArray = ([] as string[]).concat(classes);
  $el.classList.add(...classesArray);

  if (text) $el.textContent = text;

  return $el;
}

export function appendCaptainLog(messageType: string, message: string) {
  const $console = <HTMLDivElement>document.querySelector("#console")!;

  const $text = document.createElement("p");
  $text.textContent = message;
  $text.className = `log-${messageType}`;

  $console.prepend($text);
}

export function deleteCaptainLogs() {
  const $console = document.querySelector("#console")!;
  $console.replaceChildren();
}

export function enableNextButton() {
  const $nextButton = document.querySelector("#next")!;
  $nextButton.removeAttribute("disabled");
}

export function disableNextButton() {
  const $nextButton = document.querySelector("#next")!;
  $nextButton.setAttribute("disabled", "true");
}

export function enablePrevButton() {
  const $prevButton = document.querySelector("#prev")!;
  $prevButton.removeAttribute("disabled");
}

export function disablePrevButton() {
  const $prevButton = document.querySelector("#prev")!;
  $prevButton.setAttribute("disabled", "true");
}
