# Lost and Found Backend

Fastify + Prisma backend for a lost-and-found app.

## Requirements

- Docker Desktop
- Node.js 24 or newer, only needed for local development outside Docker
- npm

## Run With Docker

Use this path if you only want to start the full project and open Swagger.

1. Clone the project and enter the backend folder.

```bash
git clone <repo-url>
cd lost-found/backend
```

2. Start the containers.

```bash
docker compose -f compose.yml up --build -d
```

The first build can take a few minutes because Docker installs dependencies and builds the API image.

3. Check that all containers are running.

```bash
docker compose -f compose.yml ps
```

You should see:

- `lost-found-postgresql`
- `lost-found-minio`

to run server
- npm run dev
- npx prisma migrate
- npx prisma generate

The API is ready when you see Fastify listening on port `5001`.

5. Open Swagger.

```text
http://localhost:5001/docs
```

You should see the `Items` tag with `POST /items`.

## Docker Ports

- API: `http://localhost:5001`
- Swagger: `http://localhost:5001/docs`
- PostgreSQL from host machine: `localhost:5433`
- PostgreSQL inside Docker network: `postgresql:5432`
- MinIO API: `http://localhost:9000`
- MinIO console: `http://localhost:9001`

## Stop Docker

Stop containers but keep database data:

```bash
docker compose -f compose.yml down
```

Stop containers and delete volumes/database data:

```bash
docker compose -f compose.yml down -v
```

## Local Development

Use this path if you want to run the API with hot reload on your machine while PostgreSQL and MinIO run in Docker.

1. Install dependencies.

```bash
npm install
```

2. Create a local environment file.

```bash
cp .env.example .env
```

3. Start only PostgreSQL and MinIO.

```bash
docker compose -f compose.yml up -d postgresql minio
```

4. Generate Prisma client.

```bash
npx prisma generate
```

5. Apply database migrations.

```bash
npx prisma migrate deploy
```

6. Start the development server.

```bash
npm run dev
```

7. Open Swagger.

```text
http://localhost:5001/docs
```

## Main Endpoints

- `GET /` - health message
- `POST /auth/register` - register a user
- `POST /auth/login` - login and receive JWT token
- `POST /items` - create lost/found item, requires bearer token

## Create Item Request

`POST /items` requires `Authorization: Bearer <token>`.

```json
{
  "type": "LOST",
  "title": "Black wallet",
  "description": "Small leather wallet",
  "categoryId": "category-uuid",
  "location": "Library",
  "colorId": "color-uuid",
  "dateLostOrFound": "2026-09-04T10:00:00.000Z",
  "imageUrls": ["https://example.com/image.jpg"]
}
```

The `categoryId` and `colorId` must already exist in the database.

## Useful Commands

Build TypeScript:

```bash
npm run build
```

View API logs:

```bash
docker compose -f compose.yml logs -f api
```

Rebuild only the API image:

```bash
docker compose -f compose.yml build api
```

Restart only the API container:

```bash
docker compose -f compose.yml up -d api
```

## Troubleshooting

If port `5001` is already used, change the API port mapping in `compose.yml`.

If port `5433` is already used, change the PostgreSQL host port in `compose.yml`, then update `.env` to use the same host port for local development.

If Swagger does not show `POST /items`, rebuild the API image:

```bash
docker compose -f compose.yml up --build -d api
```
