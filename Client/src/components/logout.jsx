// LogoutButton.js
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LogoutButton = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    navigate("/login"); // Redirect to login page
  };

  return (
    <Button
      danger
      onClick={handleLogout}
      style={{
        fontWeight: "bold",
        fontSize: "18px",
        borderRadius: "14px",
        padding: "5px 20px 34px",
        backgroundColor: "#02335f",
        // marginTop: "10px",
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
