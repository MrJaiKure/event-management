import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to Authenticate User
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
    return res.status(400).json({ message: "Invalid token format" });

  jwt.verify(tokenParts[1], "secret", async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  });
};

// ✅ API to Fetch Logged-in User
export const getCurrentUser = async (req, res) => {
  res.json(req.user);
};
