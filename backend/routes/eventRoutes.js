const express = require("express");
const router = express.Router();

const { createEvent, getAllEvents, updateEvent, deleteEvent, } = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getAllEvents);

router.post("/", protect, authorizeRoles("admin", "organizer"), createEvent);

router.put("/:id", protect, authorizeRoles("admin", "organizer"), updateEvent);

router.delete("/:id", protect, authorizeRoles("admin", "organizer"), deleteEvent);

module.exports = router;