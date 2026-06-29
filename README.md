# AB20 APIs (Laravel + PHP + SQLite)

Laravel port of the AB20 technical assessment. Two small, layered APIs:

- **Order API**: `apps/order` (run on `http://localhost:3000`)
- **Merchant API**: `apps/merchant` (run on `http://localhost:3001`)

Each app is layered the same way: **routes → controllers → services → repositories**, with a
central `AppException` rendered as JSON. SQLite is the default database.

> This is the **starting point** for the assessment. See [`REQUIREMENTS.md`](REQUIREMENTS.md)
> for what to implement (JWT auth across both apps + the product↔store relationship). Those
> features are intentionally **not** implemented yet.

## Postman

Combined collection: `postman/ab20.postman_collection.json`

- `orderBaseUrl`: `http://localhost:3000`
- `merchantBaseUrl`: `http://localhost:3001`

## Run

Same steps for each app — only the directory and port differ.

### Order (port 3000)

```bash
cd apps/order
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve --port=3000
```

### Merchant (port 3001)

```bash
cd apps/merchant
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve --port=3001
```

## Endpoints

### Order

- `GET /health`
- Products: `POST/GET/GET:id/PUT:id/DELETE:id /products`
- Users: `POST/GET/GET:id/PUT:id/DELETE:id /users`
- Orders: `POST/GET/GET:id /orders`, `DELETE /orders` (delete all)

### Merchant

- `GET /health`
- Users: `POST/GET/GET:id/PUT:id/DELETE:id /users`
- Categories: `POST/GET/GET:id/PUT:id/DELETE:id /categories`
- Stores: `POST/GET/GET:id/PUT:id/DELETE:id /stores`
