import React, { useState } from "react";
import { Input, Button, Card, message } from "antd";

const API_URL = import.meta.env.VITE_API_URL; // Read from .env

message.config({
  top: 100, // Large display for better visibility
  duration: 3, // Toast duration
});

function OrdersScan() {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [scannedPart, setScannedPart] = useState("");
  const [trackingIdValid, setTrackingIdValid] = useState(false);
  const [scannedParts, setScannedParts] = useState([]);

  // Fetch Order by Tracking ID
  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `${API_URL}/orders/scan/validateTrackingId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackingId }),
        }
      );

      const data = await response.json();
      if (data.order) {
        setOrder(data.order);
        setTrackingIdValid(true);
        setCurrentPartIndex(0);
        setScannedPart("");
        setScannedParts([]);
        message.success({
          content: `✅ Tracking ID verified: ${trackingId}`,
          duration: 3,
          style: { fontSize: "18px", fontWeight: "bold" },
        });
      } else {
        message.error({
          content: "❌ Invalid Tracking ID. Please try again.",
          duration: 3,
          style: { fontSize: "18px", fontWeight: "bold" },
        });
      }
    } catch (error) {
      message.error({
        content: "⚠️ Error fetching order. Try again.",
        duration: 3,
        style: { fontSize: "18px", fontWeight: "bold" },
      });
    }
  };

  // Verify Part Number
  const verifyPartNumber = async () => {
    if (!scannedPart) {
      message.error({
        content: "⚠️ Please enter a part number.",
        duration: 3,
        style: { fontSize: "18px", fontWeight: "bold" },
      });
      return;
    }

    // Check if part has already been scanned
    if (scannedParts.includes(scannedPart)) {
      message.warning({
        content:
          "⚠️ This part number has already been scanned. Scan the next part.",
        duration: 3,
        style: { fontSize: "18px", fontWeight: "bold" },
      });
      setScannedPart(""); // Reset input
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/orders/scan/validatePartNumbers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackingId, partNumber: scannedPart }),
        }
      );

      const data = await response.json();

      if (data.message === "Part number matched.") {
        // Mark part as scanned
        setScannedParts([...scannedParts, scannedPart]);
        setScannedPart("");

        if (
          currentPartIndex + 1 <
          order.entries.flatMap((entry) => entry.partNumbers).length
        ) {
          setCurrentPartIndex(currentPartIndex + 1);
          message.success({
            content: `✅ Part ${currentPartIndex + 1} matched.`,
            duration: 3,
            style: { fontSize: "18px", fontWeight: "bold" },
          });
        } else {
          message.success({
            content: "🎉 All part numbers matched. Order ready for dispatch!",
            duration: 4,
            style: { fontSize: "20px", fontWeight: "bold", color: "green" },
          });
          setOrder(null);
          setTrackingId("");
          setTrackingIdValid(false);
          setScannedParts([]);
        }
      } else if (data.message.includes("Wrong part number")) {
        message.error({
          content: "❌ Wrong part number. Please scan again.",
          duration: 3,
          style: { fontSize: "18px", fontWeight: "bold" },
        });
      }
    } catch (error) {
      message.error({
        content: "⚠️ Error verifying part number. Try again.",
        duration: 3,
        style: { fontSize: "18px", fontWeight: "bold" },
      });
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8d9fa", // Light gray background
      }}
    >
      <Card
        title="📦 Order Scanning"
        style={{
          width: "600px",
          padding: "20px",
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "bold",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Adds a soft shadow
          borderRadius: "10px",
        }}
      >
        {!trackingIdValid ? (
          <>
            <p style={{ fontSize: "18px" }}>
              Enter Tracking ID to fetch order details:
            </p>
            <Input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="🔍 Scan Tracking ID"
              style={{ fontSize: "16px", padding: "10px" }}
            />
            <Button
              type="primary"
              style={{
                marginTop: "10px",
                width: "100%",
                fontSize: "18px",
                padding: "15px 20px", // Adjusted padding for better size
                fontWeight: "bold",
                paddingBottom: "40px",
                borderRadius: "8px", // Rounded corners for a modern look
                backgroundColor: "#1890ff", // Ensures a strong primary blue
                border: "none", // Removes border
                transition: "all 0.3s ease", // Smooth hover effect
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#40a9ff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1890ff")}
              onClick={fetchOrder}
            >
              ✅ Verify Tracking ID
            </Button>
          </>
        ) : (
          <>
            <p style={{ fontSize: "18px" }}>
              🔢 Scanning Part {currentPartIndex + 1} of{" "}
              {order.entries.flatMap((entry) => entry.partNumbers).length}
            </p>
            <Input
              value={scannedPart}
              onChange={(e) => setScannedPart(e.target.value)}
              placeholder="📌 Scan Part Number"
              style={{ fontSize: "16px", padding: "10px" }}
            />
            <Button
              type="primary"
              style={{
                marginTop: "10px",
                width: "100%",
                fontSize: "18px",
                padding: "15px 20px", // Adjusted padding for better size
                fontWeight: "bold",
                paddingBottom: "40px",
                borderRadius: "8px", // Rounded corners for a modern look
                backgroundColor: "#1890ff", // Ensures a strong primary blue
                border: "none", // Removes border
                transition: "all 0.3s ease", // Smooth hover effect
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#40a9ff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1890ff")}
              onClick={fetchOrder}
            >
              ✅ Verify Part Number
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default OrdersScan;
