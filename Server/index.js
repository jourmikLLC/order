// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import orderRoutes from "./Routes/OrderRoutes.js";

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors());

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// app.use("/api/orders", orderRoutes);

// app.get("/", (req, res) => {
//   res.send("Server is running...");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./Routes/OrderRoutes.js";
import serverless from "serverless-http"; // Serverless function handler

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Export serverless function
module.exports.handler = serverless(app);
