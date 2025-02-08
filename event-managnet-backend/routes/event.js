import express from "express";
import { getAllEvents, createEvent, joinEvent, deleteEvent } from "../controller/eventControllers.js";
import { authenticate } from "../controller/authController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", authenticate, createEvent);
router.post("/:eventId/join", authenticate, joinEvent);
router.delete("/:eventId", authenticate, deleteEvent); // ✅ Correct route

export default router;
