import { useContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const socket = io("https://event-management-production-2eae.up.railway.app");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log( API_BASE_URL)
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
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const fetchUserEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/${user.id}`, {
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
        `${API_BASE_URL}/api/events/${eventId}/join`,
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
  
      await axios.delete(`${API_BASE_URL}/api/events/${eventId}`, {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow-lg mb-6">
          🎉 Event <span className="text-yellow-300">Dashboard</span>
        </h2>
  
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => filterEvents("all")}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
              filter === "all" ? "bg-blue-700 shadow-lg scale-105" : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => filterEvents("upcoming")}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
              filter === "upcoming" ? "bg-blue-700 shadow-lg scale-105" : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => filterEvents("past")}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
              filter === "past" ? "bg-blue-700 shadow-lg scale-105" : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Past
          </button>
        </div>
  
        {/* Event Cards */}
        {filteredEvents.length === 0 ? (
          <p className="text-center text-white text-lg font-semibold">🚀 No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 rounded-2xl shadow-2xl mb-6 transition-all hover:scale-105 hover:shadow-3xl"
            >
              <h3 className="text-2xl font-bold text-gray-800">{event.name}</h3>
              <p className="text-gray-600">🎤 Created by: <span className="font-semibold">{event.createdBy.name}</span></p>
              <p className="text-gray-700 mt-2">{event.description}</p>
              <p className="text-gray-500 mt-2">📅 Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-500">👥 Attendees: {event.attendees.length}</p>
  
              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => joinEvent(event._id)}
                  className="flex-1 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 transition-all"
                >
                  ✅ Join Event
                </button>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700 transition-all"
                >
                  ❌ Delete Event
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
};

export default Dashboard;
