import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Select, Row, Col } from "antd";
import { toast } from "react-hot-toast";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // Read from .env

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, []);

  // Set order status color
  const getStatusStyle = (status) => ({
    color: status === "Dispatched" ? "#2ecc71" : "#f39c12",
    fontWeight: "bold",
    fontSize: "16px",
  });

  // Handle filter change
  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setFilteredOrders(
      value === "all"
        ? orders
        : orders.filter((order) => order.status === value)
    );
  };
  const goBack = () => navigate(-1);

  return (
    <div
      className="container-fluid"
      style={{
        paddingTop: "60px",
        padding: "0px 40px",
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* Heading */}
      <div style={{ padding: "40px" }}>
        <Button
          type="link"
          onClick={goBack}
          style={{
            padding: "12px 0",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <ArrowLeftOutlined
            style={{ marginRight: "10px", fontSize: "20px" }}
          />
          Back to Home
        </Button>
        <h1
          className="text-center p-4 mb-4"
          style={{
            fontSize: "36px",
            color: "#02335f",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          Orders List
        </h1>
      </div>

      {/* Filter Dropdown */}
      <div style={{ textAlign: "end", marginBottom: "30px" }}>
        <Select
          defaultValue="all"
          onChange={handleFilterChange}
          className="custom-select"
          style={{
            width: "250px",
            borderRadius: "8px",
            padding: "6px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Select.Option value="all">All Orders</Select.Option>
          <Select.Option value="Dispatched">Dispatched</Select.Option>
          <Select.Option value="Pending">Pending</Select.Option>
        </Select>
      </div>

      {/* Orders List */}
      <Row gutter={[16, 24]}>
        {filteredOrders.map((order) => (
          <Col key={order._id} xs={24} sm={12} md={8} lg={6}>
            <Link to={`/order/${order._id}`} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                style={{
                  borderRadius: "12px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  padding: "20px",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <h3
                  className="text-center"
                  style={{ fontSize: "24px", color: "#2c3e50" }}
                >
                  Tracking ID: {order.trackingId}
                </h3>
                <p style={{ fontSize: "16px", color: "#7f8c8d" }}>
                  <strong>Customer Name:</strong> {order.customerName}
                </p>
                <p style={{ fontSize: "16px", color: "#7f8c8d" }}>
                  <strong>Part Numbers:</strong>
                  <ul>
                    {order.entries
                      .flatMap((entry) => entry.partNumbers)
                      .map((pn, index) => (
                        <li key={index} style={{ fontSize: "14px" }}>
                          {pn}
                        </li>
                      ))}
                  </ul>
                </p>
                <p style={getStatusStyle(order.status)}>
                  <strong>Status:</strong> {order.status}
                </p>
                <Button
                  type="primary"
                  block
                  style={{
                    marginTop: "10px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    backgroundColor: "#2980b9",
                    borderColor: "#2980b9",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  View Details
                </Button>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default OrderDetails;
