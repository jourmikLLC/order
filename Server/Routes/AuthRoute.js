import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Login API
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body); // 🔵 Log request body

    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      console.log("❌ User not found!");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      console.log("❌ Incorrect password!");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ Login successful!");
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ message: "Database error", error });
  }
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
