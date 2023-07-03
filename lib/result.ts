export class UnwrapError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export interface OkErr<T, E> {
  isOk: boolean;
  isErr: boolean;
  /**
   * Returns `true` if the result is `Ok` and the value inside it matches a predicate.
   * @param {(value) => boolean} predicate predicate function
   * @returns {boolean} result
   */
  isOkAnd: (predicate: (value: T) => boolean) => boolean;
  /**
   * Returns `true` if the result is `Err` and the value inside it matches a predicate.
   * @param {(value) => boolean} predicate predicate function
   * @returns {boolean} result
   */
  isErrAnd: (predicate: (value: E) => boolean) => boolean;
  /**
   * Returns the contained `Ok` value, throws with an optional message if the value is an `Err`.
   */
  unwrap: (error?: string) => T | void;
  /**
   * Returns the contained `Ok` value or a provided default.
   */
  unwrapOr: (fb: T) => T;
  /**
   * Returns the contained `Ok` value or computes it from a function.
   */
  unwrapOrElse: (op: (error: E) => T) => T;
  /**
   * Returns the contained `Err` value, throws if the value is an `Ok`.
   */
  unwrapErr: (error?: string) => E | void;
  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   * This function can be used to compose the results of two functions.
   */
  map: <U>(f: (value: T) => U) => Result<U, E>;
  /**
   * Returns the provided default (if `Err`), or applies a function to the conatined value (if `Ok`).
   */
  mapOr: <U>(fb: U, f: (value: T) => U) => U;
  /**
   * Maps a `Result<T, E>` to U by applying fb function default to a contained `Err` value, or function `f` to a contained `Ok` value.
   */
  mapOrElse: <U>(fb: (error: E) => U, f: (value: T) => U) => U;
  /**
   * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   */
  mapErr: <U>(f: (error: E) => U) => Result<T, U>;
}

export interface IOk<T> extends OkErr<T, never> {
  value: T;
}

export interface IErr<T> extends OkErr<never, T> {
  error: T;
}

class _Ok<T> implements IOk<T> {
  public readonly isOk = true;
  public readonly isErr = false;

  public constructor(public readonly value: T) {}

  public isOkAnd(predicate: (value: T) => boolean): boolean {
    return predicate(this.value);
  }

  public isErrAnd(_: unknown): boolean {
    return false;
  }

  public unwrap(_?: string): T {
    return this.value;
  }

  public unwrapOr(_: T): T {
    return this.value;
  }

  public unwrapOrElse(_: unknown): T {
    return this.value;
  }

  public unwrapErr(error?: string): void {
    throw new UnwrapError(`${error} : ${this.value}`);
  }

  public map<U>(f: (value: T) => U): _Ok<U> {
    return new _Ok(f(this.value));
  }

  public mapOr<U>(_: unknown, f: (value: T) => U): U {
    return f(this.value);
  }

  public mapOrElse<U>(_: unknown, f: (value: T) => U): U {
    return f(this.value);
  }

  public mapErr(_: unknown): _Ok<T> {
    return this;
  }
}

class _Err<T> implements IErr<T> {
  public readonly isOk = false;
  public readonly isErr = true;

  public constructor(public readonly error: T) {}

  public isOkAnd(_: unknown): boolean {
    return false;
  }

  public isErrAnd(predicate: (error: T) => boolean): boolean {
    return predicate(this.error);
  }

  public unwrap(error?: string): void {
    throw new UnwrapError(error);
  }

  public unwrapOr<U>(fb: U): U {
    return fb;
  }

  public unwrapOrElse<U>(f: (error: T) => U): U {
    return f(this.error);
  }

  public unwrapErr(_: unknown): T {
    return this.error;
  }

  public map(_: unknown): this {
    return this;
  }

  public mapOr<U>(fb: U, _: unknown): U {
    return fb;
  }

  public mapOrElse<U>(fb: (err: T) => U, _: unknown): U {
    return fb(this.error);
  }

  public mapErr<U>(f: (error: T) => U): _Err<U> {
    return new _Err(f(this.error));
  }
}

export type Result<T, E> = _Ok<T> | _Err<E>;
export const Ok = <T>(value: T): _Ok<T> => new _Ok(value);
export const Err = <T>(error: T): _Err<T> => new _Err(error);
