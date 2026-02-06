const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, toggleCheckInOut,} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser)

router.post("/checkin-checkout", toggleCheckInOut);

module.exports = router;
