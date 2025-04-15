import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, Card } from "antd";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Read from .env

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  // Check if the user is already logged in by verifying the presence of a token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to homepage if already logged in
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, credentials);
      console.log("Login Response:", data);

      // Store access token and refresh token in localStorage
      localStorage.setItem("token", data.token); // Store the access token
      localStorage.setItem("role", data.user.role); // Store the user's role
      localStorage.setItem("refreshToken", data.refreshToken); // Store the refresh token
      localStorage.setItem("role", data.user.role); // Store the user's role

      navigate("/"); // Redirect to homepage
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-light vh-100">
      <div className="text-center">
        <h1
          style={{ color: "#212529", backgroundColor: "#f9a81c" }}
          className="pt-4 pb-4"
        >
          Warehouse Orders Dispatching System
        </h1>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <Card
          title={<h4 className="text-center text-dark">Login</h4>}
          className="shadow-lg p-4 rounded"
          style={{ width: "400px" }}
        >
          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item label="Username" required>
              <Input
                type="text"
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                placeholder="Enter username"
              />
            </Form.Item>
            <Form.Item label="Password" required>
              <Input.Password
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
