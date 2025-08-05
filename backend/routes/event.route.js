import express from "express";
import { getEvents, createEvent, getEventById, updateEvent, deleteEvent, handleRSVP } from "../controllers/event.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, createEvent);
router.get("/:id", getEventById);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.put('/:id/rsvp', handleRSVP);

export default router;