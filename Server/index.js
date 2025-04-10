import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./Routes/OrderRoutes.js";

dotenv.config();
const app = express();

// CORS configuration to allow requests from your frontend

app.use(express.json());
app.use(cors({
    origin: "*",  // For testing, change "*" to your frontend URL for production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://jourmikmak:jourmik@inventory.iy3xoho.mongodb.net/?retryWrites=true&w=majority&appName=inventory')
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/orders", orderRoutes);
app.get("/test", (req, res) => {
    res.json({ message: "Server is up and running!" });
  });
  
// Basic route for testing
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
