import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export type TokenPayload = {
  id: string;
  email: string;
  username: string;
};

export function getTokenPayload(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get("token")?.value;

  if (!token || !process.env.TOKEN_SECRET) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
