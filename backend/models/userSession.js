const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "organizer", "admin"],
            required: true,
        },
        loginTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        logoutTime: {
            type: Date,
            default: null,
        },
        checkInTime: {
            type: Date
        },
        checkOutTime: {
            type: Date
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserSession", userSessionSchema);
