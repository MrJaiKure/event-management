import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // 'user' or 'admin'
    createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Track created events
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
