import express from "express";
import { getUserWithEvents } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", authenticate, getUserWithEvents);

export default router;
