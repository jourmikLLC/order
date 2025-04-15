import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // Add role field to user schema
});

const User = mongoose.model("User", userSchema);

// Connect to MongoDB (adjust your URI accordingly)
mongoose.connect("mongodb+srv://jourmikmak:jourmik@inventory.iy3xoho.mongodb.net/?retryWrites=true&w=majority&appName=inventory", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });

// Function to create users
const createUsers = async () => {
  try {
    // Creating an admin user
    const adminPassword = await bcrypt.hash("admin@123", 10); // Hash the password for security
    const admin = new User({
      username: "admin",
      password: adminPassword,
      role: "admin", // Admin role
    });
    
    // Creating a simple user
    const simplePassword = await bcrypt.hash("warehouse@123", 10); // Hash the password for security
    const simple = new User({
      username: "warehouse",
      password: simplePassword,
      role: "user", // Simple user role
    });

    // Save users to the database
    await admin.save();
    await simple.save();

    console.log("Admin and simple users created successfully!");
    mongoose.disconnect(); // Disconnect from the database after operation
  } catch (error) {
    console.error("Error creating users:", error);
    mongoose.disconnect(); // Disconnect from the database after error
  }
};

// Call the function to create users
createUsers();
