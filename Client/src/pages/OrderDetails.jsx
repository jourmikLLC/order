import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // Link to navigate to Order Details
import { Card, Button, Select, Row, Col } from "antd";  // Ant Design components
import { toast } from "react-hot-toast";  // For toast notifications

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");  // Filter state

  useEffect(() => {
    // Fetch the list of orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://order-two-gamma.vercel.app/api/orders");
        
        const data = await response.json();
        setOrders(data);  // Set orders in the state
        setFilteredOrders(data);  // Initially show all orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, []);

  // Function to set order status color
  const getStatusStyle = (status) => {
    if (status === "dispatched") {
      return { color: "#2ecc71", fontWeight: "bold", fontSize: "16px" };  // Green for dispatched
    } else if (status === "pending") {
      return { color: "#f39c12", fontWeight: "bold", fontSize: "16px" };  // Orange for pending
    }
    return { fontWeight: "bold", fontSize: "16px" };  // Default bold if status is unknown
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setStatusFilter(value);
    if (value === "all") {
      setFilteredOrders(orders);  // Show all orders
    } else {
      setFilteredOrders(orders.filter(order => order.status === value));  // Filter based on selected status
    }
  };

  return (
    <div className="container-fluid" style={{ paddingTop: "60px", padding: "0px 40px", backgroundColor: "#f7f7f7" }}>
      {/* Heading Section */}
      <div style={{ Padding: "40px" }}>
        <h1 className="text-center p-4 mb-4" style={{ fontSize: "36px", color: "#02335f", fontWeight: "bold", letterSpacing: "2px" }}>
          Orders List
        </h1>
      </div>

      {/* Filter Dropdown Section */}
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
    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
  }}
>
  <Select.Option value="all">All Orders</Select.Option>
  <Select.Option value="dispatched">Dispatched</Select.Option>
  <Select.Option value="pending">Pending</Select.Option>
</Select>

</div>


      {/* Orders List Section */}
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
                <h3 className="text-center" style={{ fontSize: "24px", color: "#2c3e50" }}>Order ID: {order._id}</h3>
                <p style={{ fontSize: "16px", color: "#7f8c8d" }}><strong>Customer Name:</strong> {order.customerName}</p>
                <p style={{ fontSize: "16px", color: "#7f8c8d" }}><strong>Part Number:</strong> {order.partNumber}</p>
                <p style={getStatusStyle(order.status)}><strong>Status:</strong> {order.status}</p>
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
