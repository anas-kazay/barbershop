import { Router, Request, Response } from "express";
import * as ownerController from "../controllers/ownerController";
import verifyTokenAndRoles from "../middlewares/verifyRole";
import { UserRole } from "../models/UserRole";

const router = Router();

// Route to get all users
router.get(
  "/users",
  verifyTokenAndRoles([UserRole.OWNER]),
  async (req: Request, res: Response) => {
    try {
      await ownerController.getAllUsersController(req, res);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route to create a barber
router.post(
  "/barbers",
  verifyTokenAndRoles([UserRole.OWNER]), // Assuming only owners can create barbers
  async (req: Request, res: Response) => {
    try {
      await ownerController.createBarberController(req, res);
    } catch (error) {
      res.status(500).json({ message: "Failed to create barber" });
    }
  }
);

// Route to delete a barber
router.delete(
  "/barbers/:barberId",
  verifyTokenAndRoles([UserRole.OWNER]),
  async (req: Request, res: Response) => {
    try {
      await ownerController.deleteUserController(req, res);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete barber" });
    }
  }
);

// Route to update the schedule
router.put(
  "/barbers/:barberId/schedule",
  verifyTokenAndRoles([UserRole.OWNER]),
  async (req, res) => {
    try {
      await ownerController.updateBarberScheduleController(req, res);
    } catch (error) {
      res.status(500).json({ message: "Failed to update barber's schedule" });
    }
  }
);

// Route to get all services
router.post(
  "/services",
  verifyTokenAndRoles([UserRole.OWNER]),
  async (req: Request, res: Response) => {
    try {
      await ownerController.createServiceController(req, res);
    } catch (error) {
      res.status(500).json({ message: "Failed to create service" });
    }
  }
);

// Route to modify a service
router.put(
  "/services/:id",
  verifyTokenAndRoles([UserRole.OWNER]),
  async (req: Request, res: Response) => {
    try {
      await ownerController.modifyServiceController(req, res);
    } catch (error) {
      res.status(500).json({ message: "Failed to modify service" });
    }
  }
);

// Route to delete a service
router.delete(
  "/services/:id",
  verifyTokenAndRoles([UserRole.OWNER]),
  async (req: Request, res: Response) => {
    try {
      await ownerController.deleteServiceController(req, res);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  }
);

export default router;
