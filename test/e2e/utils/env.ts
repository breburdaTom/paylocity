/**
 * Environment variable validation and access.
 *
 * All required environment variables are validated at import time.
 * If any required variable is missing, the process fails immediately
 * with a clear error message.
 *
 * Locally: values are loaded from the root .env file via dotenv.
 * On CI: values are injected via GitHub Secrets → workflow env.
 */

import dotenv from "dotenv";
import path from "path";
import { existsSync } from "fs";

/**
 * Walk up from the given directory to find the project root (contains .git).
 */
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
