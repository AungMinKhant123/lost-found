import bcrypt from "bcrypt";
import { createHash } from "node:crypto";

export async function hashRefreshToken(refreshToken: string): Promise<string> {
  return bcrypt.hash(refreshToken, 10);
}

export async function verifyRefreshToken(
  refreshToken: string,
  refreshTokenHash: string,
): Promise<boolean> {
  return bcrypt.compare(refreshToken, refreshTokenHash);
}

export function createRefreshTokenLookup(refreshToken: string): string {
  return createHash("sha256").update(refreshToken).digest("hex");
}
