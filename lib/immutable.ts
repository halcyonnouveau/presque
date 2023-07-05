// deno-lint-ignore-file no-explicit-any
import { Err, Ok, Result } from "./result.ts";

export type AssocPath = (string | number | AssocPath)[];

export const deepFreeze = <
  T extends Readonly<(unknown[] | Record<string, unknown>)>,
>(object: T): T => {
  if (Array.isArray(object)) {
    (object as Readonly<unknown>[]).forEach((value) => {
      if (value && typeof value === "object") {
        deepFreeze(
          value as Readonly<unknown>[] | Record<string, unknown>,
        );
      }
    });
  } else {
    Object.values(object).forEach((value) => {
      if (value && typeof value === "object") {
        deepFreeze(
          value as Readonly<unknown>[] | Record<string, unknown>,
        );
      }
    });
  }
  return Object.freeze(object);
};

const setIn = <T, V>(obj: T, path: AssocPath, value: V): T => {
  const [head, ...tail] = path;
  const cont = tail.length > 0;

  if (typeof head === "number" && Array.isArray(obj)) {
    const copy = [...obj];
    copy[head] = cont ? setIn(copy[head] ?? {}, tail, value) : value;
    return copy as T;
  } else if (typeof head === "string") {
    return {
      ...obj,
      [head]: cont ? setIn(obj[head as keyof T] ?? {}, tail, value) : value,
    } as T;
  }

  return obj;
};

export function assoc<T extends Record<string, unknown>, O>(
  obj: T,
  path: AssocPath,
  value: O,
): Result<Readonly<unknown>, string | Error>;
export function assoc<
  T extends Record<string, unknown>,
  O extends Record<string, unknown>,
>(
  obj: T,
  obj2: O,
): Result<Readonly<Omit<T, keyof O> & O>, string | Error>;
export function assoc<
  T extends Record<string, unknown>,
  O extends Record<string, unknown>,
  V,
>(
  obj: T,
  p1: O | AssocPath,
  val?: V[],
): Result<Readonly<unknown> | Readonly<Omit<T, keyof O> & O>, string | Error> {
  if (Array.isArray(p1) && val) {
    if (val.length !== p1.length) {
      return Err("Length of paths do not match length of values");
    }

    try {
      return Ok(
        val.reduce(
          (acc, currVal, index) => setIn(acc, p1[index] as AssocPath, currVal),
          { ...obj },
        ),
      );
    } catch (e) {
      return Err(e);
    }
  }

  return Ok(deepFreeze({ ...obj, ...p1 }) as Omit<T, keyof O> & O);
}

type Fn<I, O> = (arg: I) => O;

// DONT LAUGH. IT HAS TO BE LIKE THIS
export function thread<A, B>(v: A, f1: Fn<A, B>): B;
export function thread<A, B, C>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
): C;
export function thread<A, B, C, D>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
): D;
export function thread<A, B, C, D, E>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
  f4: Fn<D, E>,
): E;
export function thread<A, B, C, D, E, F>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
  f4: Fn<D, E>,
  f5: Fn<E, F>,
): F;
export function thread<A, B, C, D, E, F, G>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
  f4: Fn<D, E>,
  f5: Fn<E, F>,
  f6: Fn<F, G>,
): G;
export function thread<A, B, C, D, E, F, G, H>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
  f4: Fn<D, E>,
  f5: Fn<E, F>,
  f6: Fn<F, G>,
  f7: Fn<G, H>,
): H;
export function thread<A, B, C, D, E, F, G, H, I>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
  f4: Fn<D, E>,
  f5: Fn<E, F>,
  f6: Fn<F, G>,
  f7: Fn<G, H>,
  f8: Fn<H, I>,
): I;
export function thread<A, B, C, D, E, F, G, H, I>(
  v: A,
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
  f4: Fn<D, E>,
  f5: Fn<E, F>,
  f6: Fn<F, G>,
  f7: Fn<G, H>,
  f8: Fn<H, I>,
  ...fs: Fn<any, any>[]
): unknown;
export function thread<T>(value: T, ...fns: Fn<any, any>[]) {
  return ((input: any) => fns.reduce((acc, fn) => fn(acc), input))(value);
}
