import Event from "../models/Events.js";
import User from "../models/User.js";


// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Create event

export const createEvent = async (req, res) => {
  try {
    console.log("Request received:", req.body); // Log request data

    const { name, description, date } = req.body;
    if (!name || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = new Event({
      name,
      description,
      date,
      createdBy: req.user.id,
    });

    await event.save();

    // Update User's createdEvents array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdEvents: event._id },
    });

    res.json(event);
  } catch (error) {
    console.error("Error creating event:", error); // Log error
    res.status(500).json({ message: "Error creating event", error });
  }
};



// Join event
export const joinEvent = async (req, res) => {
    try {
      console.log("Join event request received:", req.params.eventId, req.user.id);
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }
  
      const event = await Event.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check if user is already in the attendees list
      if (event.attendees.includes(req.user.id)) {
        return res.status(400).json({ message: "You have already joined this event" });
      }
  
      event.attendees.push(req.user.id);
      await event.save();
  
      // Emit real-time attendee update
      const io = req.app.get("socketio");
      io.to(req.params.eventId).emit("updateAttendees", req.params.eventId);
  
      res.json({ message: "Joined event successfully" });
    } catch (error) {
      console.error("Error joining event:", error);
      res.status(500).json({ message: "Error joining event", error });
    }
  };

// Delete event
export const deleteEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      // Ensure only the event creator or an admin can delete the event
      if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to delete this event" });
      }
  
      await Event.findByIdAndDelete(req.params.eventId);
  
      // Emit event deletion to update frontend
      const io = req.app.get("socketio");
      io.emit("eventDeleted", req.params.eventId);
  
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Error deleting event", error });
    }
  };
  