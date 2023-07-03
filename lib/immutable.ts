export enum Nav {
  ALL = "ALL",
  NONE = "NONE",
  FIRST = "FIRST",
  LAST = "LAST",
  MAPKEYS = "MAPKEYS",
  MAPVALS = "MAPVALS",
}

export type AssocPath = (string | number | AssocPath)[];

export class im {
  private static deepFreeze<
    T extends Readonly<(Readonly<unknown>[] | Record<string, unknown>)>,
  >(object: T): T {
    if (Array.isArray(object)) {
      (object as Readonly<unknown>[]).forEach((value) => {
        if (value && typeof value === "object") {
          this.deepFreeze(
            value as Readonly<unknown>[] | Record<string, unknown>,
          );
        }
      });
    } else {
      Object.values(object).forEach((value) => {
        if (value && typeof value === "object") {
          this.deepFreeze(
            value as Readonly<unknown>[] | Record<string, unknown>,
          );
        }
      });
    }
    return Object.freeze(object);
  }

  private static setIn<T, V>(obj: T, path: AssocPath, value: V): T {
    const [head, ...tail] = path;

    if (typeof head === "number" && Array.isArray(obj)) {
      const copy = [...obj];
      copy[head] = this.setIn(copy[head] ?? {}, tail, value);
      return copy as T;
    } else if (typeof head === "string") {
      return {
        ...obj,
        [head]: this.setIn(obj[head as keyof T] ?? {}, tail, value),
      } as T;
    }

    return obj;
  }

  public static assoc<T extends Record<string, unknown>, O>(
    obj: T,
    path: AssocPath,
    value: O,
  ): Readonly<T>;
  public static assoc<
    T extends Record<string, unknown>,
    O extends Record<string, unknown>,
  >(
    obj: T,
    obj2: O,
  ): Readonly<Omit<T, keyof O> & O>;
  public static assoc<
    T extends Record<string, unknown>,
    O extends Record<string, unknown>,
    V,
  >(
    obj: T,
    p1: O | AssocPath,
    val?: V[],
  ): Readonly<T> | Readonly<Omit<T, keyof O> & O> {
    if (Array.isArray(p1) && val) {
      if (val.length !== p1.length) {
        throw new Error("Length of paths do not match length of values");
      }
      let copy = { ...obj };
      for (let i = 0; i < val.length; i++) {
        copy = this.setIn(copy, p1[i] as AssocPath, val[i]);
      }
      return this.deepFreeze(copy);
    }

    return this.deepFreeze({ ...obj, ...p1 }) as Omit<T, keyof O> & O;
  }

  public static select() {
  }

  public static transform() {
  }
}

// Usage
// const obj1 = im.assoc({ a: 1, b: 2 }, { a: 3, c: "4" });
// console.log(obj1); // { a: 3, b: 2, c: 4 }
//
// const obj2 = im.assoc({ a: 1, b: 2 }, ["a", "b", "c"], [2, "Dog", { x: 1 }]);
// console.log(obj2); // { a: 2, b: "Dog", c: { x: 1 } }
//
// const obj3 = im.assoc({ a: 1, b: { x: { y: ["a", "b"] } } }, ["a", [
//   "b",
//   "x",
//   "y",
//   1,
// ]], [5, "c"]);
// console.log(obj3); // { a: 5, b: { x: { y: [ 'a', 'c' ] } } }

// im.select(
//   filter(v => v.Animal),
//   NAV.MAPKEYS
//   filter(k => k === "Dog"),
//
// im.transform(
