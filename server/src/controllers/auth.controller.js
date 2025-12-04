import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// POST: /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already registered
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash the password using bcrypt
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user in the DB with hashed password.
    await User.create({ name, email, password: hashed, role });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email.
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare input password with hashed password in DB
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // If valid: generate accessToken(15min) and refreshToken(7days)
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/refresh
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) return res.status(401).json({ message: "No token" });
    
    // Check if refresh token exists in DB
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid token" });

    // Verify refresh token using REFRESH_TOKEN_SECRET
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
      if (err) return res.status(403).json({ message: "Token expired" });

      // If valid → generate a new access token (15 min) and a new refresh token.
      const newAccessToken = generateAccessToken(data.id);
      const newRefreshToken = generateRefreshToken(data.id);

      // Save the new refresh token in DB (rotation).
      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Remove the refresh token from DB
    await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });

    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
