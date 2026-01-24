const Registration = require("../models/registration");
const Event = require("../models/Event");

exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const registration = await Registration.create({
            user: userId,
            event: eventId,
        });

        res.status(201).json({
            success: true,
            message: "Successfully registered for this Event",
            registration,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: "You are already registered for this event" });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({
            user: req.user._id,
        }).populate("event");

        res.status(200).json({
            success: true,
            count: registrations.length,
            registrations,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate("user", "name email role")
            .populate("event", "title location date capacity");

        res.status(200).json({
            success: true,
            count: registrations.length,
            registrations,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
