import "dotenv/config";

type NodeEnv = "development" | "production" | "test";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getPort(): number {
  const value = process.env.PORT;

  if (!value) {
    return 5001;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${value}`);
  }

  return port;
}

function getNodeEnv(): NodeEnv {
  const value = process.env.NODE_ENV || "development";

  if (value !== "development" && value !== "production" && value !== "test") {
    throw new Error(`Invalid NODE_ENV: ${value}`);
  }

  return value;
}

export const config = {
  port: getPort(),
  databaseUrl: getEnv("DATABASE_URL"),
  nodeEnv: getNodeEnv(),
  jwtSecret: getEnv("JWT_SECRET"),
};
