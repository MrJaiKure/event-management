import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://event-management-three-zeta.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and authentication headers
  })
);


// http://localhost:5000 this backendhosted uri

// Connect to MongoDB
mongoose 
  .connect('mongodb+srv://kurejaideep2003:b4hu42BtSu3xfMbr@cluster0.fl4s4.mongodb.net/')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ✅ Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running!" });
});


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// WebSockets for real-time attendee updates
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
    io.to(eventId).emit("updateAttendees", eventId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Attach socket instance to the app (for access in controllers)
app.set("socketio", io);

server.listen(5000, () => console.log("Server running on port 5000"));
