import React, { useState } from "react";
import { Input, Button, Card, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_API_URL; // Read from .env

message.config({
  top: 100,
  duration: 3,
});

// Audio files in the public/sounds folder
const errorBeep = new Audio("/sounds/error-beep.mp3");
const successBeep = new Audio("/sounds/success-beep.mp3");

function OrdersScan() {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [scannedPart, setScannedPart] = useState("");
  const [trackingIdValid, setTrackingIdValid] = useState(false);
  const [scannedParts, setScannedParts] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch Order by Tracking ID
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/orders/scan/validateTrackingId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        message.success(`Tracking ID verified: ${trackingId}`);
        successBeep.play(); // Play success sound
      } else {
        message.error("Invalid Tracking ID. Please try again.");
        errorBeep.play(); // Play error sound
        setTrackingId(""); // 👈 Clear tracking ID input
      }
    } catch (error) {
      message.error("⚠️ Error fetching order. Try again.");
      errorBeep.play(); // Play error sound
      setTrackingId(""); // 👈 Clear tracking ID input
    }
    setLoading(false);
  };

  // Verify Part Number
  const verifyPartNumber = async () => {
    if (!scannedPart) {
      message.error("⚠️ Please enter a Part Number.");
      errorBeep.play(); // Play error sound
      return;
    }

    if (scannedParts.includes(scannedPart)) {
      message.warning("⚠️ This part has already been scanned.");
      setScannedPart(""); // Reset input
      errorBeep.play(); // Play error sound
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/orders/scan/validatePartNumbers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingId, partNumber: scannedPart }),
        }
      );

      const data = await response.json();

      if (data.message === "Part number matched.") {
        setScannedParts([...scannedParts, scannedPart]);
        setScannedPart("");

        if (
          currentPartIndex + 1 <
          order.entries.flatMap((entry) => entry.partNumbers).length
        ) {
          setCurrentPartIndex(currentPartIndex + 1);
          message.success(`Part ${currentPartIndex + 1} matched.`);
          successBeep.play(); // Play success sound
        } else {
          message.success("🎉 All parts matched. Order ready for dispatch!");
          successBeep.play(); // Play success sound
          resetState();
        }
      } else {
        message.error("Wrong Part Number. Please scan again.");
        errorBeep.play(); // Play error sound
        setScannedPart(""); // 👈 Clear scanned part input
      }
    } catch (error) {
      message.error("⚠️ Error verifying Part Number. Try again.");
      errorBeep.play(); // Play error sound
      setScannedPart(""); // 👈 Clear scanned part input
    }
    setLoading(false);
  };

  // Reset state after order completion
  const resetState = () => {
    setOrder(null);
    setTrackingId("");
    setTrackingIdValid(false);
    setScannedParts([]);
  };

  // Handle barcode scanner auto-submit
  const handleKeyPress = (event, type) => {
    if (event.key === "Enter") {
      if (type === "tracking") fetchOrder();
      if (type === "part") verifyPartNumber();
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        display: "flex",
        justifyContent: "center",
        fontSize: "70px",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8d9fa",
      }}
    >
      <Card
        // title="📦 Warehouse Order Dispatching System"
        style={{
          // width: "600px",
          padding: "20px",
          textAlign: "center",
          fontSize: "70px",
          fontWeight: "bold",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        {!trackingIdValid ? (
          <>
            <p style={{ fontSize: "70px" }}>
              Enter Tracking ID to fetch order details:
            </p>
            <Input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="🔍 Scan Tracking ID"
              style={{ fontSize: "70px", padding: "10px" }}
              onKeyPress={(e) => handleKeyPress(e, "tracking")}
              autoFocus
            />
            <Button
              type="primary"
              style={{
                marginTop: "10px",
                width: "100%",
                fontSize: "40px",
                padding: "20px 20px 80px",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: "#1890ff",
                border: "none",
              }}
              onClick={fetchOrder}
              disabled={loading}
            >
              {loading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 70, color: "#fff" }}
                      spin
                    />
                  }
                />
              ) : (
                <span className="">Verify Tracking ID</span>
              )}
            </Button>
          </>
        ) : (
          <>
            <p style={{}}>
              🔢 Scanning Part {currentPartIndex + 1} of{" "}
              {order.entries.flatMap((entry) => entry.partNumbers).length}
            </p>
            <Input
              value={scannedPart}
              onChange={(e) => setScannedPart(e.target.value)}
              placeholder="📌 Scan Part Number"
              style={{ fontSize: "70px", padding: "10px" }}
              onKeyPress={(e) => handleKeyPress(e, "part")}
              autoFocus
            />
            <Button
              type="primary"
              style={{
                marginTop: "10px",
                width: "100%",
                fontSize: "40px",
                // paddingBottom: "60px !important",
                padding: "40px 40px 80px",
                paddingBottom: "80px",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: "#1890ff",
                border: "none",
              }}
              onClick={verifyPartNumber}
              disabled={loading}
            >
              {loading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 70, color: "#fff" }}
                      spin
                    />
                  }
                />
              ) : (
                <span className="">Verify Part No</span>
              )}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default OrdersScan;
