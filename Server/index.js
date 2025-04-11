import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./Routes/OrderRoutes.js";
import AuthRoutes from "./Routes/AuthRoute.js";

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

// const db = await mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "password",
//   database: process.env.DB_NAME || "warehouse_db",
// });
// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api",AuthRoutes)
// Basic route for testing
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

