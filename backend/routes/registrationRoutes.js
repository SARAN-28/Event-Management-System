const express = require("express");
const router = express.Router();

const { getMyRegistrations, registerForEvent, getOrganizerEventRegistrations, } = require("../controllers/registrationController");

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/my-registrations", protect, getMyRegistrations);

router.get("/events/:eventId/registrations", protect, authorizeRoles("organizer"), getOrganizerEventRegistrations);

router.post("/:id", protect, registerForEvent);

module.exports = router;