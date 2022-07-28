export function createDiv(classes: string[] | string, text?: string) {
  const $el = document.createElement("div");
  const classesArray = ([] as string[]).concat(classes);
  $el.classList.add(...classesArray);

  if (text) $el.textContent = text;

  return $el;
}
