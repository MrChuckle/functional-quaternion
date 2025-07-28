import {
  I,
  J,
  K,
  ONE,
  QFormat,
  Quaternion,
  ZERO,
  add,
  conjugate,
  divide,
  im,
  inverse,
  multiply,
  negate,
  norm,
  normalise,
  re,
  scale,
  squaredNorm,
  toString,
  subtract,
} from './quaternion.js';
import { test, expect, describe } from 'vitest';

expect.extend({
  toBeQuatCloseTo(
    received: Quaternion,
    expected: Quaternion,
    numDigits?: number,
  ) {
    const { isNot } = this;
    this.equals = (received, expected) => {
      let receivedQuat = received as Quaternion;
      let expectedQuat = expected as Quaternion;
      try {
        expect(receivedQuat.w).toBeCloseTo(expectedQuat.w, numDigits);
        expect(receivedQuat.x).toBeCloseTo(expectedQuat.x, numDigits);
        expect(receivedQuat.y).toBeCloseTo(expectedQuat.y, numDigits);
        expect(receivedQuat.z).toBeCloseTo(expectedQuat.z, numDigits);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    };
    return {
      pass: this.equals(received, expected),
      message: () =>
        `expected ${toString(received, QFormat.JSON)} to${isNot ? ' not' : ''} be close to ${toString(expected, QFormat.JSON)}`,
    };
  },
});

const q: Quaternion = { w: 0, x: 1, y: 2, z: 3 };
const p: Quaternion = { w: 4, x: 5, y: 6, z: 7 };
const qp: Quaternion = { w: -38, x: 0, y: 16, z: 8 };

test('quaternion value access', () => {
  expect(q.w).toBe(0);
  expect(q.x).toBe(1);
  expect(q.y).toBe(2);
  expect(q.z).toBe(3);
});

describe('quaternion addition tests', () => {
  test('should add two quaternions', () => {
    expect(add(q, p)).toEqual({ w: 4, x: 6, y: 8, z: 10 });
  });

  test('should return q from q + 0', () => {
    expect(add(q, ZERO)).toEqual(q);
    expect(add(ZERO, q)).toEqual(q);
  });
});

describe('quaternion negation tests', () => {
  test('should negate quaternion', () => {
    expect(negate(q).w).toBe(-q.w);
    expect(negate(q).x).toBe(-q.x);
    expect(negate(q).y).toBe(-q.y);
    expect(negate(q).z).toBe(-q.z);
  });
});

describe('quaternion subtraction tests', () => {
  test('should subtract two quaternions', () => {
    expect(subtract(q, p)).toStrictEqual({ w: -4, x: -4, y: -4, z: -4 });
    expect(subtract(p, q)).toStrictEqual({ w: 4, x: 4, y: 4, z: 4 });
  });

  test('should return q from q - 0', () => {
    expect(subtract(q, ZERO)).toStrictEqual(q);
  });
});

describe('quaternion norm tests', () => {
  test('should norm the quaternion', () => {
    expect(norm(q)).toBe(3.7416573867739413);
    expect(norm(p)).toBe(11.224972160321824);
  });

  test('should norm the zero quaternion to zero', () => {
    expect(norm(ZERO)).toBe(0);
  });
});

describe('quaternion squared norm tests', () => {
  test('should squared norm the quaternion', () => {
    expect(squaredNorm(q)).toBe(14);
    expect(squaredNorm(p)).toBe(126);
  });

  test('should squared norm the zero quaternion to zero', () => {
    expect(squaredNorm(ZERO)).toBe(0);
  });

  test('should squared norm the 1 to 1', () => {
    expect(squaredNorm(ONE)).toBe(1);
  });
});

describe('quaternion scale tests', () => {
  test('should scale by a positive number', () => {
    expect(scale(2, q)).toEqual({
      w: 2 * q.w,
      x: 2 * q.x,
      y: 2 * q.y,
      z: 2 * q.z,
    });
  });

  test('should scale by a negative number', () => {
    expect(scale(-1, q)).toEqual({
      w: -q.w,
      x: -q.x,
      y: -q.y,
      z: -q.z,
    });
  });

  test('should scale by 1 to original value', () => {
    expect(scale(1, q)).toEqual(q);
  });

  test('should scale by 0 to zero quaternion', () => {
    expect(scale(0, q)).toEqual(ZERO);
  });
});

describe('quaternion multiplication tests', () => {
  test('should multiple two quaternions', () => {
    expect(multiply(q, p)).toStrictEqual(qp);
  });
});

describe('quaternion inverse tests', () => {
  test('should error on zero', () => {
    expect(() => inverse(ZERO)).toThrowError(
      'Cannot invert 0, division by 0 error',
    );
  });

  test('should inverse ONE to ONE', () => {
    expect(inverse(ONE)).toBeQuatCloseTo(ONE);
  });

  test('should return self when inversing twice', () => {
    expect(inverse(inverse(q))).toBeQuatCloseTo(q);
  });

  test('should multiple with self inverse to return ONE', () => {
    expect(multiply(q, inverse(q))).toBeQuatCloseTo(ONE);
  });
});

describe('quaternion division tests', () => {
  test('should error on zero', () => {
    expect(() => divide(q, ZERO)).toThrowError(
      'Cannot invert 0, division by 0 error',
    );
  });

  test('should divide q by ONE to q', () => {
    expect(divide(q, ONE)).toBeQuatCloseTo(q);
  });

  test('should divide by self to to return ONE', () => {
    expect(divide(q, q)).toBeQuatCloseTo(ONE);
  });

  test('should divide two quaternions', () => {
    expect(divide(qp, p)).toBeQuatCloseTo(q);
  });
});

describe('quaternion conjugation tests', () => {
  test('conjugate of 0 is 0', () => {
    expect(conjugate(ZERO)).toBeQuatCloseTo(ZERO);
  });

  test('conjugate of 1 is 1', () => {
    expect(conjugate(ONE)).toBeQuatCloseTo(ONE);
  });

  test('conjugate of w+xi+yj+zk is q-xi-yj-zk', () => {
    expect(conjugate(q)).toBeQuatCloseTo({ w: 0, x: -1, y: -2, z: -3 });
    expect(conjugate(p)).toBeQuatCloseTo({ w: 4, x: -5, y: -6, z: -7 });
  });
});

describe('quaternion normalise tests', () => {
  test('should error when normalise on ZERO', () => {
    expect(() => normalise(ZERO)).toThrowError(
      'Cannot invert 0, division by 0 error',
    );
  });

  test('should normalise units to themselves', () => {
    expect(normalise(ONE)).toBeQuatCloseTo(ONE);
    expect(normalise(I)).toBeQuatCloseTo(I);
    expect(normalise(J)).toBeQuatCloseTo(J);
    expect(normalise(K)).toBeQuatCloseTo(K);
  });
});

describe('quaternion real and imaginary parts tests', () => {
  test('should return w as real part of w+xi+yj+zk', () => {
    expect(re(q)).toBe(0);
    expect(re(p)).toBe(4);
  });

  test('should return x, y, z as imaginary part of w+xi+yj+zk', () => {
    expect(im(q)).toStrictEqual({ x: 1, y: 2, z: 3 });
    expect(im(p)).toStrictEqual({ x: 5, y: 6, z: 7 });
  });
});

describe('quaternion stringify tests', () => {
  test('should return w+xi+yj+zk format', () => {
    expect(toString(q, QFormat.IJK)).toBe('0+1i+2j+3k');
  });

  test('should return vector row format', () => {
    expect(toString(q, QFormat.ROW)).toBe('(0, 1, 2, 3)');
  });

  test('should return vector column format', () => {
    expect(toString(q, QFormat.COL)).toBe('[0]\n[1]\n[2]\n[3]');
  });

  test('should return JSON format', () => {
    expect(toString(q, QFormat.JSON)).toBe('{ w: 0, x: 1, y: 2, z: 3 }');
  });
});
