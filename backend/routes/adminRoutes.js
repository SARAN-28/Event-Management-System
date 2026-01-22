const express = require("express");
const router = express.Router();

const { getAllUsers, updateUserRole, deleteUser,} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware")

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);

router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
