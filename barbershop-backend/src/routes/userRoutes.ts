import { Request, Response, Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

// Route to register a user
router.post("/register", async (req, res, next) => {
  try {
    await userController.createUserController(req, res);
  } catch (error) {
    next(error);
  }
});

// Route to login a user
router.post("/login", async (req, res, next) => {
  try {
    await userController.loginUserController(req, res);
  } catch (error) {
    next(error);
  }
});

// Route to get user data
router.get("/userData", async (req, res, next) => {
  try {
    await userController.getUserController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
