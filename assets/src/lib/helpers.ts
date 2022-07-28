export const toCamelCase = (s: string) =>
  s.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());

export const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
