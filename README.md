# presque

[![deno doc](https://badgers.space/badge/deno/doc/blue)](https://doc.deno.land/https/deno.land/x/presque)
[![npm](https://badgers.space/npm/version/presque)](https://www.npmjs.com/package/presque)

An attempt to make TypeScript less bad by just adding features and utilities
from more good languages in a way that's _close enough_.

## Installation/Usage

- With Deno:

```ts
import { Err, Ok } from "https://deno.land/x/presque/lib/result.ts";
```

- With Node.js:

```bash
npm i presque
```

```ts
import { Err, Ok } from "presque/result";
```

## Currently Implemented

| name        | description                                            | inspiration |
| ----------- | ------------------------------------------------------ | ----------- |
| `result`    | A type used for returning and propogating errors.      | Rust        |
| `immutable` | Functions/utilities for immutable data transformation. | Clojure     |
