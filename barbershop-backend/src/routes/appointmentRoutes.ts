import { Router } from "express";
import { UserRole } from "../models/UserRole"; // Assuming you have defined user roles
import {
  getAllAppointmentsController,
  getAppointmentsByBarberAndDayController,
  getAppointmentsByBarberIdController,
  getAppointmentsByUserIdController,
  reserveAppointment,
  updateAppointmentStatusController,
} from "../controllers/appointmentController"; // Import the controller method
import verifyTokenAndRoles from "./../middlewares/verifyRole";

const router = Router();

// Route to reserve an appointment
router.post(
  "/reserve",
  verifyTokenAndRoles([UserRole.CUSTOMER, UserRole.OWNER]), // Ensure only authenticated users can make appointments
  async (req, res) => {
    try {
      await reserveAppointment(req, res);
    } catch (error) {
      res.status(500).json({ message: "Failed to reserve appointment" });
    }
  }
);

// Get all appointments (Owner only)
router.get(
  "/",
  verifyTokenAndRoles([UserRole.OWNER]), // Ensure only authorized users can access all appointments
  getAllAppointmentsController
);

// Get appointments by user ID (any authenticated user)
router.get(
  "/user/appointments",
  verifyTokenAndRoles([UserRole.CUSTOMER, UserRole.OWNER]),
  getAppointmentsByUserIdController
);

// Get appointments by barber ID (any authenticated user)
router.get(
  "/barber/appointments",
  verifyTokenAndRoles([UserRole.BARBER, UserRole.OWNER]),
  getAppointmentsByBarberIdController
);

// Update appointment status (Owner, Barber, Customer)
router.put(
  "/:appointmentId/status",
  verifyTokenAndRoles([UserRole.OWNER, UserRole.BARBER, UserRole.CUSTOMER]),
  updateAppointmentStatusController
);

// Get appointments by barber ID and day (Owner, Barber, Customer)
router.get(
  "/:barberId",
  verifyTokenAndRoles([UserRole.OWNER, UserRole.CUSTOMER, UserRole.BARBER]),
  getAppointmentsByBarberAndDayController
);

export default router;
