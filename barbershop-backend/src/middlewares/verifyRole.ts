import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/UserRole";

const JWT_SECRET = process.env.JWT_SECRET || "";

const verifyTokenAndRoles = (roles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        message: "No Authorization header provided",
        details: "Authorization header is missing",
      });
      return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        message: "Invalid Authorization header format",
        details: "Format should be 'Bearer <token>'",
      });
      return;
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        role: UserRole;
      };

      if (!roles.includes(decoded.role)) {
        res.status(403).json({
          message: "Forbidden: Insufficient role",
          details: `Required roles: ${roles}, User role: ${decoded.role}`,
        });
        return;
      }

      // Attach decoded user info to request for further use
      //req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          message: "Invalid token",
          details: error.message,
        });
      } else if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          message: "Token expired",
          details: "The provided token has expired",
        });
      } else {
        res.status(500).json({
          message: "Token verification error",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  };
};

export default verifyTokenAndRoles;
