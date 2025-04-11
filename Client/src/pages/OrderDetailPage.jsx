import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL; // Read from .env

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        const data = await response.json();
        setOrder(data);
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
      const response = await fetch(`${API_URL}/orders/${orderId}/dispatch`, {
        method: "PUT",
      });
      const updatedOrder = await response.json();

      if (updatedOrder.status === "Dispatched") {
        toast.success("Order dispatched successfully!");
        setOrder(updatedOrder);
      } else {
        toast.error("Failed to dispatch order.");
      }
    } catch (error) {
      console.error("Error dispatching order:", error);
      toast.error("Error dispatching order.");
    }
  };

  const goBack = () => navigate(-1);

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
              marginBottom: "20px",
            }}
          >
            <ArrowLeftOutlined
              style={{ marginRight: "10px", fontSize: "20px" }}
            />
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
            <h3
              className="text-center"
              style={{ fontSize: "28px", marginBottom: "20px" }}
            >
              Order Details
            </h3>

            <div style={{ paddingBottom: "20px", fontSize: "18px" }}>
              <p>
                <strong>Customer Name:</strong> {order.customerName}
              </p>
              <p>
                <strong>Tracking ID:</strong> {order.trackingId}
              </p>

              <p>
                <strong>Part Numbers:</strong>
              </p>
              <ul>
                {order.entries
                  .flatMap((entry) => entry.partNumbers)
                  .map((pn, index) => (
                    <li key={index}>
                      <strong>Part {index + 1}:</strong> {pn}
                    </li>
                  ))}
              </ul>

              <p>
                <strong>Status: </strong>
                <span
                  style={{
                    fontWeight: "bold",
                    color: order.status === "Dispatched" ? "green" : "orange",
                  }}
                >
                  {order.status}
                </span>
              </p>
            </div>

            {/* Dispatch Button */}
            {/* {order.status !== "Dispatched" && (
              <div className="text-center">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleDispatch}
                  style={{
                    borderRadius: "8px",
                    fontSize: "18px",
                    padding: "10px 30px",
                    backgroundColor: "green",
                    borderColor: "green",
                    color: "white",
                  }}
                >
                  Dispatch Order
                </Button>
              </div>
            )} */}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
