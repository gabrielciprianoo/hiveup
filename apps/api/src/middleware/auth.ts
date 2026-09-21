import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const bearer = request.headers.authorization;

  if (!bearer) {
    response.status(401).json({ error: "No autorizado" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    response.status(401).json({ error: "No autorizado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "object" && "id" in decoded) {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        response.status(401).json({ error: "Token inválido" });
        return;
      }

      request.user = user;
      next();
    }
  } catch {
    response.status(401).json({ error: "Token inválido" });
  }
}
