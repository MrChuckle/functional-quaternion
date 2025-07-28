import 'vitest';

interface CustomMatchers<R = unknown> {
  toBeQuatCloseTo: (expected) => R;
}

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
