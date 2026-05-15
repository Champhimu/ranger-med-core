import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  // Checks if token exists.
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // Verifies JWT signature using ACCESS_TOKEN_SECRET
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Fetch user details from database
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Attach user info to request
    req.user = {
      userId: user._id,
      id: user._id, // For backward compatibility
      role: user.role,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
