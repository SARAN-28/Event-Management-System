const Registration = require("../models/Registration");
const Event = require("../models/event");

exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    res.status(201).json({
      success: true,
      message: "Event registered successfully",
      registration,
    });
  } catch (error) {
    console.error("REGISTER EVENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
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
      .populate("user", "name email")
      .populate("event", "title date location");

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("GET ALL REGISTRATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrganizerEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ event: eventId })
      .populate("user", "name email")
      .populate("event", "title createdBy");

    if (!registrations.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        registrations: [],
      });
    }

    if (
      registrations[0].event.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ event: eventId })
       .populate("user", "name email")
      .populate("event", "title date");

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};