# AB20 — Technical Assessment

This repository holds a small backend technical assessment, available in **two
stacks on two branches**. Pick the one that matches the role:

- **[`node`](../../tree/node)** — Node.js + Express + TypeScript + SQLite
- **[`laravel`](../../tree/laravel)** — PHP + Laravel + SQLite

Both branches contain the **same** assessment: two layered APIs — an **Order API**
and a **Merchant API** — plus a shared Postman collection. Each is a *starting
point*, with two features deliberately left for you to implement.

## What you implement

See [`REQUIREMENTS.md`](REQUIREMENTS.md) for the full task. In short:

1. **JWT authentication**, working across **both** APIs with a shared signing secret.
2. **Product ↔ merchant store** relationship — a product must belong to a store,
   validated against the Merchant API's stores.
3. **Docker Compose** to run both APIs together (bonus).

## How to take it

1. **Fork** this repository.
2. Check out the branch for your stack: `git checkout node` *or* `git checkout laravel`.
3. Follow that branch's own `README.md` to run both apps locally.
4. Implement the requirements and open a **PR from your fork**.

## Branches

| Branch    | Stack                            | Contents       |
| --------- | -------------------------------- | -------------- |
| `main`    | —                                | this overview  |
| `node`    | Express + TypeScript + SQLite    | starting point |
| `laravel` | Laravel + PHP + SQLite           | starting point |

> The two starting points are functionally equivalent: same entities, endpoints,
> validation, and JSON shapes — only the framework differs.
