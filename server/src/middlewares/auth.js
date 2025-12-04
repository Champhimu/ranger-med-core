import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  // Checks if token exists.
  if (!token) return res.status(401).json({ message: "No token provided" });

  // Verifies JWT signature using ACCESS_TOKEN_SECRET
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    // If invalid/expired → returns 403
    if (err) return res.status(403).json({ message: "Invalid token" });

    // If valid req.user = userId and allows the request
    req.user = data.id;
    next();
  });
};
