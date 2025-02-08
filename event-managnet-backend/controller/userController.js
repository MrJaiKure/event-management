import User from "../models/User.js";

// Get User with Created Events
export const getUserWithEvents = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("createdEvents");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
