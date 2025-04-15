import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


import User from "../models/Auth.js";
// Login API

// Login API
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body);

    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT access token (expires in 1 hour)
    const accessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // Include role in payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
console.log(user.role);
    // Create JWT refresh token (expires in 7 days)
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // Include role in payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Respond with tokens and user data (including role)
    res.json({
      token: accessToken,
      refreshToken: refreshToken,
      user: { id: user._id, username: user.username, role: user.role }, // Make sure role is included here
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ message: "Database error", error });
  }
});

// Middleware for Authentication and Role-based Authorization
const verifyTokenAndRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      
      req.userId = decoded.id;
      req.role = decoded.role; // Store the user's role from token

      if (requiredRole && req.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }
      
      next();
    });
  };
};

// Example Protected Route: Only accessible for admin users
router.get("/admin", verifyTokenAndRole("admin"), (req, res) => {
  res.json({ message: "Welcome to the admin section", userId: req.userId });
});

// Middleware for Authentication
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    next();
  });
};

// Example Protected Route
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Welcome to the protected route!", userId: req.userId });
});
export default router;
