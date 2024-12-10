import app from "./server";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default (req: VercelRequest, res: VercelResponse) => {
  app(req as any, res as any); // Forward the request to Express
};
