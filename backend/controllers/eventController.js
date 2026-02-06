const Event = require("../models/event")
const Registration = require("../models/Registration");

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, capacity } = req.body;

        if (!title || !date || !location || !capacity) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            capacity,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();

        let registeredEventIds = [];

        if (req.user) {
            const registrations = await Registration.find({
                user: req.user._id,
            });

            registeredEventIds = registrations.map(
                (reg) => reg.event.toString()
            );
        }

        const eventsWithStatus = events.map((event) => ({
            ...event._doc,
            isRegistered: registeredEventIds.includes(
                event._id.toString()
            ),
        }));
        res.status(200).json({
            success: true,
            events: eventsWithStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (
            req.user.role === "organizer" &&
            event.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(event, req.body);
        await event.save();

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (
            req.user.role === "organizer" &&
            event.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
