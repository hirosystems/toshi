export const toCamelCase = (s: string) =>
  s.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());

// a speed > 1 will make animations a bit quicker
// and skip the welcome screen with the "press start" btn
export const SPEED = 1.1;

export const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms / SPEED);
  });
