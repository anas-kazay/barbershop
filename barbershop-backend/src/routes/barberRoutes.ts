import { Router, Request, Response } from "express";
import * as barberController from "../controllers/barberController";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    await barberController.getAllBarbersController(req, res);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch barbers" });
  }
});

export default router;
