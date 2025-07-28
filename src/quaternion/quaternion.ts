export type Quaternion = {
  w: number;
  x: number;
  y: number;
  z: number;
};

export const ZERO: Quaternion = { w: 0, x: 0, y: 0, z: 0 };
export const ONE: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
export const I: Quaternion = { w: 0, x: 1, y: 0, z: 0 };
export const J: Quaternion = { w: 0, x: 0, y: 1, z: 0 };
export const K: Quaternion = { w: 0, x: 0, y: 0, z: 1 };

export const add = (q: Quaternion, p: Quaternion): Quaternion => {
  return {
    w: q.w + p.w,
    x: q.x + p.x,
    y: q.y + p.y,
    z: q.z + p.z,
  };
};

export const negate = (q: Quaternion): Quaternion => {
  return {
    w: -q.w,
    x: -q.x,
    y: -q.y,
    z: -q.z,
  };
};

export const subtract = (q: Quaternion, p: Quaternion): Quaternion => {
  return {
    w: q.w - p.w,
    x: q.x - p.x,
    y: q.y - p.y,
    z: q.z - p.z,
  };
};

export const norm = (q: Quaternion): number => {
  return Math.sqrt(q.w ** 2 + q.x ** 2 + q.y ** 2 + q.z ** 2);
};

export const squaredNorm = (q: Quaternion): number => {
  return q.w ** 2 + q.x ** 2 + q.y ** 2 + q.z ** 2;
};

export const scale = (a: number, q: Quaternion): Quaternion => {
  return {
    w: a * q.w,
    x: a * q.x,
    y: a * q.y,
    z: a * q.z,
  };
};

export const multiply = (q: Quaternion, p: Quaternion): Quaternion => {
  return {
    w: q.w * p.w - q.x * p.x - q.y * p.y - q.z * p.z,
    x: q.w * p.x + q.x * p.w + q.y * p.z - q.z * p.y,
    y: q.w * p.y - q.x * p.z + q.y * p.w + q.z * p.x,
    z: q.w * p.z + q.x * p.y - q.y * p.x + q.z * p.w,
  };
};

export const inverse = (q: Quaternion): Quaternion => {
  if (q === ZERO) {
    throw new Error('Cannot invert 0, division by 0 error');
  }
  return scale(1 / squaredNorm(q), conjugate(q));
};

export const divide = (q: Quaternion, p: Quaternion): Quaternion => {
  return multiply(q, inverse(p));
};

export const conjugate = (q: Quaternion): Quaternion => {
  return {
    w: q.w,
    x: -q.x,
    y: -q.y,
    z: -q.z,
  };
};

export const normalise = (q: Quaternion): Quaternion => {
  if (q === ZERO) {
    throw new Error('Cannot invert 0, division by 0 error');
  }
  return scale(1 / norm(q), q);
};

export const re = (q: Quaternion): number => {
  return q.w;
};

export const im = (q: Quaternion): { x: number; y: number; z: number } => {
  return { x: q.x, y: q.y, z: q.z };
};

export enum QFormat {
  IJK,
  ROW,
  COL,
  JSON,
}

export const toString = (q: Quaternion, format: QFormat): string => {
  switch (format) {
    case QFormat.IJK:
      return `${q.w}+${q.x}i+${q.y}j+${q.z}k`;
    case QFormat.ROW:
      return `(${q.w}, ${q.x}, ${q.y}, ${q.z})`;
    case QFormat.COL:
      return `[${q.w}]\n[${q.x}]\n[${q.y}]\n[${q.z}]`;
    case QFormat.JSON:
      return `{ w: ${q.w}, x: ${q.x}, y: ${q.y}, z: ${q.z} }`;
  }
};
