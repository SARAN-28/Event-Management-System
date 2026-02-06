const express = require("express");
const router = express.Router();

const { createEvent, updateEvent, getAllEvents, deleteEvent, getSingleEvent, getMyEvents,} = require("../controllers/eventController");

const { registerForEvent, getEventRegistrations, } = require("../controllers/registrationController");

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get( "/:eventId/registrations",protect,authorizeRoles("organizer", "admin"),getEventRegistrations);

router.get("/my-events", protect, authorizeRoles("organizer"), getMyEvents);

router.get("/", getAllEvents);

router.get("/:id", getSingleEvent);

router.post("/", protect, authorizeRoles("admin", "organizer"), createEvent);

router.put("/:id", protect, authorizeRoles("admin", "organizer"), updateEvent);

router.put("/admin/event/:id", protect, authorizeRoles("admin", "organizer"), updateEvent)

router.delete("/:id", protect, authorizeRoles("admin", "organizer"), deleteEvent);

router.post("/:id/register", protect, authorizeRoles("user"), registerForEvent);

module.exports = router; 