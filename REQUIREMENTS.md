# Technical Assessment Requirements

This repository contains two Laravel (PHP) APIs:

- **Order API**: `apps/order` (default port `3000`)
- **Merchant API**: `apps/merchant` (default port `3001`)

Your task is to implement the requirements below.

## 1) Authentication (JWT) — Required

Add authentication using **JWT** and make it work **across both apps**.

### Requirements

- Protected endpoints must require a valid `Authorization: Bearer <token>` header.
- Token verification must work in **both** the Order API and the Merchant API.
- Use a **shared signing secret / public key** mechanism so a token minted for one app is accepted by the other.
- Unauthorized requests must return `401` with a JSON error message.
- Requests with insufficient permissions (if you add roles/claims) must return `403`.

### Notes / Guidance

- You may choose where tokens are minted.
- Keep the implementation simple and consistent with the existing code style (controllers/services/repositories + central error handling).

## 2) Product Belongs To Merchant Store — Required

Currently there is no relationship between products (Order API) and merchant stores (Merchant API).

### Requirements

- A **product must belong to a merchant store**.
- Add a `storeId` (or equivalent) association to products.
- Product create/update must validate that the referenced store exists.
  - If the store does not exist, return `400` client error.

### Expectations

- The relationship should be enforceable at the application level.
- The API should remain consistent and predictable (clear error messages, no silent failures).

## 3) Docker — Bonus

Dockerize the project and add Docker Compose to run both APIs together.

### Requirements

- Add Dockerfiles for both apps.
- Add a `docker-compose.yml` that starts:
  - Order API on `3000`
  - Merchant API on `3001`
- Containers should start with a single command (e.g., `docker compose up`).
- Ensure required environment variables are configurable via Compose.

## Deliverables

- Fix any code issues (if found).
- Source code changes, a PR through a fork.
- Updated documentation (README and/or notes) describing how to:
  - Obtain a JWT and call protected endpoints
  - Run both apps locally
  - Run via Docker Compose (bonus)

## Acceptance Criteria (High-Level)

- Both APIs run successfully.
- JWT-protected endpoints reject unauthenticated requests and accept valid tokens.
- Products cannot be created/updated without a valid store association.
- Bonus: `docker compose up` runs both APIs and they respond on their ports.
