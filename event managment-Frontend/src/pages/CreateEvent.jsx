import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure token format is correct
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        // "http://localhost:5000/api/events",
        eventData,
        {
          headers: { Authorization: `Bearer ${token}` }, // Fix: Added "Bearer"
        }
      );
      console.log("Event created:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating event:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to create event.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={eventData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={eventData.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
