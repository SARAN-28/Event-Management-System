const express = require("express");
const router = express.Router();

const { getAllUsers, updateUserRole, deleteUser, getAllSessions, } = require("../controllers/adminController");

const { getAllRegistrations, } = require("../controllers/registrationController");

const { protect } = require("../middleware/authMiddleware");

const { authorizeRoles } = require("../middleware/roleMiddleware")

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

router.get("/sessions", protect, authorizeRoles("admin"), getAllSessions);

router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);

router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

router.get("/registrations", protect, authorizeRoles("admin"), getAllRegistrations);

module.exports = router;
