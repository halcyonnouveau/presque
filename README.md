# presque

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/presque/result.ts)
[![npm](https://badgers.space/npm/version/presque)](https://www.npmjs.com/package/presque)

An attempt to make TypeScript less bad by just adding features and utilities from more good languages in a way that's _close enough_.

## Installation/Usage

- With Deno:

```ts
import { Ok, Err } from "https://deno.land/x/presque/result.ts";
```

- With Node.js:

```bash
npm i presque
```
```ts
import { Ok, Err } from "presque/result";
```

## Currently Implemented

| name | description | inspiration |
|---|---|---|
| `result` | A type used for returning and propogating errors. | Rust |
| `immutable` | Functions/utilities for immutable data transformation. | Clojure |
