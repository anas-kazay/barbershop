import { Request, Response, Router } from "express";
import { getAllServicesController } from "../controllers/serviceController";

const router = Router();
// Route to get all services
router.get("/", async (req: Request, res: Response) => {
  try {
    await getAllServicesController(req, res);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

export default router;
