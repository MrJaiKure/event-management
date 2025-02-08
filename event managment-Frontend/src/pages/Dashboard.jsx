import { useContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const socket = io("http://localhost:5000");

const Dashboard = () => {
    const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    fetchEvents();
    if (user) fetchUserEvents();
    socket.on("updateAttendees", fetchEvents);
    socket.on("eventDeleted", fetchEvents); // Refresh when an event is deleted
  
    return () => {
      socket.off("updateAttendees");
      socket.off("eventDeleted");
    };
  }, []);
  

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const fetchUserEvents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUserEvents(res.data.createdEvents);
    } catch (error) {
      console.error("Error fetching user events:", error);
    }
  };

  const filterEvents = (type) => {
    setFilter(type);
    if (type === "all") {
      setFilteredEvents(events);
    } else if (type === "upcoming") {
      setFilteredEvents(
        events.filter((event) => new Date(event.date) > new Date())
      );
    } else {
      setFilteredEvents(
        events.filter((event) => new Date(event.date) < new Date())
      );
    }
  };

  const joinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to join an event.");
        return;
      }
  
      console.log("Joining event:", eventId);
  
      const response = await axios.post(
        `http://localhost:5000/api/events/${eventId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Correct format
        }
      );
  
      console.log("Event joined successfully:", response.data);
      socket.emit("joinEvent", eventId);
    } catch (error) {
      console.error("Error joining event:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to join event.");
    }
  };
  
  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete an event.");
        return;
      }
  
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure correct format
      });
  
      // Optimistically remove the event from UI
      setEvents(events.filter((event) => event._id !== eventId));
      socket.emit("eventDeleted", eventId);
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to delete event.");
    }
  };
  
  
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Event Dashboard</h2>

        <div className="mb-4">
          <button
            onClick={() => filterEvents("all")}
            className={`mr-2 px-4 py-2 rounded ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => filterEvents("upcoming")}
            className={`mr-2 px-4 py-2 rounded ${
              filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => filterEvents("past")}
            className={`px-4 py-2 rounded ${
              filter === "past" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            Past
          </button>
        </div>

        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div

              key={event._id}
              className="border p-4 rounded-lg shadow-md mb-4"
            >
                
              <h3 className="text-xl font-semibold">{event.name}</h3>
                <h4> Event Created by : {event.createdBy.name}</h4>
              <p className="text-gray-700">{event.description}</p>
              <p className="text-gray-500">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-500">
                Attendees: {event.attendees.length}
              </p>

              <button
                onClick={() => joinEvent(event._id)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Join Event
              </button>
              <button
                onClick={() => deleteEvent(event._id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
