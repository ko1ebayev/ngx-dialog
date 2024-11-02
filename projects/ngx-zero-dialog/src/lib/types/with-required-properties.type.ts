export type WithRequiredProperties<T, K extends keyof T = keyof T> = {
  [P in K]-?: T[P];
};