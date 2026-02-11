import dotenv from "dotenv";
import path from "path";
import { existsSync } from "fs";

function findProjectRoot(startDir: string): string {
  let current = startDir;
  while (current !== path.dirname(current)) {
    if (existsSync(path.join(current, ".git"))) {
      return current;
    }
    current = path.dirname(current);
  }
  throw new Error("Could not find project root (.git directory not found)");
}

dotenv.config({ path: path.join(findProjectRoot(__dirname), ".env") });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it in .env at the project root, or as a GitHub Secret (CI).`
    );
  }
  return value;
}

export const ENV = {
  BASE_URL: requireEnv("BASE_URL"),
  TEST_USERNAME: requireEnv("TEST_USERNAME"),
  TEST_PASSWORD: requireEnv("TEST_PASSWORD"),
} as const;
