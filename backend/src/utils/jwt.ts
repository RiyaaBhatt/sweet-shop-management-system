// src/utils/jwt.ts
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export interface TokenPayload {
  userId: number;
  role: string;
  email: string;
  tokenVersion?: number;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // Short-lived access token
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(
    {
      ...payload,
      tokenVersion: payload.tokenVersion || 0, // For token revocation
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Long-lived refresh token
  );
}

export function verifyAccessToken<T = TokenPayload>(token: string): T {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as T;
}

export function verifyRefreshToken<T = TokenPayload>(token: string): T {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as T;
}

export function generateTokens(payload: TokenPayload) {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}
