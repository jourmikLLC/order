import { BrowserRouter } from "react-router-dom"; // Import the Router
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "antd/dist/antd.css";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />{" "}
    {/* ✅ Add Toaster here */}
    <App /> {/* Your app is wrapped in BrowserRouter here */}
  </BrowserRouter>
);
