// utils/refreshToken.ts

import bcrypt from "bcrypt";

export async function hashRefreshToken(refreshToken: string): Promise<string> {
  return bcrypt.hash(refreshToken, 10);
}

export async function verifyRefreshToken(
  refreshToken: string,
  refreshTokenHash: string,
): Promise<boolean> {
  return bcrypt.compare(refreshToken, refreshTokenHash);
}
