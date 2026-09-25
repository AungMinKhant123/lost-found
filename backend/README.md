## Database Setup

After cloning the project, follow these steps to set up the database.

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

Make sure Docker Desktop is running, then start the development database:

```bash
docker compose -f ./docker.dev/docker-compose.yml up -d
```

### 3. Apply existing Prisma migrations

The project already contains the migration files, so **do not create a new migration** during initial setup.

```bash
npx prisma migrate dev
```

This applies all existing migrations in `prisma/migrations/` to your local PostgreSQL database.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma Client based on `prisma/schema.prisma`.

### 5. Seed the database

Populate the database with the project's initial/test data:

```bash
npx prisma db seed
```

### 6. Start the backend

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5001
```

Swagger API documentation:

```text
http://localhost:5001/docs
```

---

## Quick Setup

For a fresh local setup, run:

```bash
npm install

docker compose -f ./docker.dev/docker-compose.yml up -d

npx prisma migrate dev

npx prisma generate

npx prisma db seed

npm run dev
```

### Important

If you only want to use the **existing migrations**, do not run:

```bash
npx prisma migrate dev --name <migration-name>
```

That command is for creating a **new migration** after changing `schema.prisma`.

If you only need to apply migrations that already exist, use:

```bash
npx prisma migrate dev
```

If you need to completely reset your local development database and re-run all migrations:

```bash
npx prisma migrate reset
```

⚠️ `migrate reset` deletes all existing data in the development database.
