import { assertEquals, assertThrows } from "./deps.ts";
import { Err, Ok } from "../lib/result.ts";

Deno.test("isOkAnd", () => {
  const x = Ok(42);
  const y = Err("Error");
  assertEquals(
    x.isOkAnd((val: number) => val === 42),
    true,
  );
  assertEquals(
    x.isOkAnd((val: number) => val !== 42),
    false,
  );
  assertEquals(
    y.isOkAnd((val: number) => val === 42),
    false,
  );
  assertEquals(
    y.isOkAnd((val: number) => val !== 42),
    false,
  );
});

Deno.test("isErrAnd", () => {
  const x = Ok(42);
  const y = Err("Error");
  assertEquals(
    x.isErrAnd((val: string) => val === "Error"),
    false,
  );
  assertEquals(
    x.isErrAnd((val: string) => val !== "Error"),
    false,
  );
  assertEquals(
    y.isErrAnd((val: string) => val === "Error"),
    true,
  );
  assertEquals(
    y.isErrAnd((val: string) => val !== "Error"),
    false,
  );
});

Deno.test("unwrap", () => {
  const x = Ok(42);
  const y = Err("Error");
  assertEquals(x.unwrap("Error"), 42);
  assertThrows(() => y.unwrap("Error"), "Error");
  assertThrows(() => y.unwrap());
});

Deno.test("unwrapErr", () => {
  assertThrows(() => Ok(":)").unwrapErr("Error"), "Error");
  assertEquals(Err("This Error").unwrapErr("Different Error"), "This Error");
});

Deno.test("unwrapOr", () => {
  assertEquals(Ok(42).unwrapOr(49), 42);
  assertEquals(Err("OH NO").unwrapOr(49), 49);
});

const count = (x: string) => x.length;

Deno.test("unwrapOrElse", () => {
  assertEquals(Ok(2).unwrapOrElse(count), 2);
  assertEquals(Err("peanuts").unwrapOrElse(count), 7);
});

Deno.test("map", () => {
  assertEquals(Ok("foo").map(count).value, 3);
  assertEquals(Err("bar").map(count).error, "bar");
});

Deno.test("mapOr", () => {
  assertEquals(Ok("zoo").mapOr(1, count), 3);
  assertEquals(Err("bar").mapOr(1, count), 1);
});

Deno.test("mapOrElse", () => {
  assertEquals(Ok("mew").mapOrElse(() => 1, count), 3);
  assertEquals(Err("nyan").mapOrElse(() => 1, count), 1);
});
