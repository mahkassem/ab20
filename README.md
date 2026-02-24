# AB20 APIs (Express + TypeScript + SQLite)

This repo contains two small, layered APIs:

- **Order API**: `apps/order` (default `http://localhost:3000`)
- **Merchant API**: `apps/merchant` (default `http://localhost:3001`)

## Postman

Combined collection: `postman/ab20.postman_collection.json`

- `orderBaseUrl`: `http://localhost:3000`
- `merchantBaseUrl`: `http://localhost:3001`

## Run

### Order (Run)

```bash
cd apps/order
npm install
npm run dev
```

### Merchant (Run)

```bash
cd apps/merchant
npm install
npm run dev
```

## Endpoints

### Order (Endpoints)

- `GET /health`
- Products: `POST/GET/GET:id/PUT:id/DELETE:id /products`
- Users: `POST/GET/GET:id/PUT:id/DELETE:id /users`
- Orders: `POST/GET/GET:id/DELETE /orders`

### Merchant (Endpoints)

- `GET /health`
- Users: `POST/GET/GET:id/PUT:id/DELETE:id /users`
- Categories: `POST/GET/GET:id/PUT:id/DELETE:id /categories`
- Stores: `POST/GET/GET:id/PUT:id/DELETE:id /stores`
