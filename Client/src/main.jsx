import { BrowserRouter as Router } from "react-router-dom"; // Import the Router
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "antd/dist/antd.css";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Toaster position="top-center" reverseOrder={false} />{" "}
    {/* ✅ Add Toaster here */}
    <App /> {/* Your app is wrapped in Router here */}
  </Router>
);
