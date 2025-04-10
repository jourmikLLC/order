import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // useNavigate for navigation
import { Button, Card } from "antd";  // Ant Design components
import { ArrowLeftOutlined } from "@ant-design/icons";  // Ant Design icon
import { toast } from "react-hot-toast";  // For toast notifications

function OrderDetailPage() {
  const { orderId } = useParams();  // Extract orderId from URL
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();  // Hook for navigation

  useEffect(() => {
    // Fetch the order details based on orderId
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://order-two-gamma.vercel.app/api/orders/${orderId}`);
        const data = await response.json();
        setOrder(data);  // Set the order details in state
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to fetch order details.");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleDispatch = async () => {
    try {
      // Update order status to dispatched
      const response = await fetch(`https://order-two-gamma.vercel.app/api/orders/${orderId}/dispatch`, {
        method: "PUT",
      });
      const updatedOrder = await response.json();

      if (updatedOrder.status === "dispatched") {
        toast.success("Order dispatched successfully!");
        setOrder(updatedOrder);  // Update the order state to reflect new status
      } else {
        toast.error("Failed to dispatch order.");
      }
    } catch (error) {
      console.error("Error dispatching order:", error);
      toast.error("Error dispatching order.");
    }
  };

  const goBack = () => {
    navigate(-1);  // Navigate to the previous page
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: "50px" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Back Button */}
          <Button
            type="link"
            onClick={goBack}
            style={{
              padding: "12px 0", 
              fontSize: "20px", 
              display: "flex", 
              alignItems: "center",
              marginBottom: "20px"
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: "10px", fontSize: "20px" }} />
            Back to Orders
          </Button>

          {/* Order Details Card */}
          <Card
            title={`Order ID: ${order._id}`}
            style={{
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "30px",
            }}
          >
            <h3 className="text-center" style={{ fontSize: "28px", marginBottom: "20px" }}>Order Details</h3>

            <div style={{ paddingBottom: "20px", fontSize: "18px" }}>
              <p><strong>Customer Name:</strong> {order.customerName}</p>
              <p><strong>Part Number:</strong> {order.partNumber}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Price:</strong> ${order.price}</p>
              <p><strong>Status:</strong> <span style={{ fontWeight: "bold", color: order.status === "dispatched" ? "green" : "orange" }}>{order.status}</span></p>
            </div>

            {/* Dispatch Button */}
            {order.status !== "dispatched" && (
              <div className="text-center">
                <Button
  type="primary"
  size="large"
  onClick={handleDispatch}
  style={{
    borderRadius: "8px", 
    fontSize: "18px", 
    padding: "10px 30px",
    backgroundColor: "green",  // Set background color to green
    borderColor: "green",  // Set border color to green
    color: "white",  // Set text color to white
  }}
>
  Dispatch Order
</Button>

              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
