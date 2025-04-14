import React, { useState } from "react";
import { Input, Button, Card, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_API_URL;

message.config({
  top: 100,
  duration: 3,
});

function OrdersScan() {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [scannedPart, setScannedPart] = useState("");
  const [trackingIdValid, setTrackingIdValid] = useState(false);
  const [scannedParts, setScannedParts] = useState([]);
  const [loading, setLoading] = useState(false);

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
        message.success(` Tracking ID verified: ${trackingId}`);
      } else {
        message.error(" Invalid Tracking ID. Please try again.");
      }
    } catch (error) {
      message.error("⚠️ Error fetching order. Try again.");
    }
    setLoading(false);
  };

  const verifyPartNumber = async () => {
    if (!scannedPart) {
      message.error("⚠️ Please enter a Part Number.");
      return;
    }

    if (scannedParts.includes(scannedPart)) {
      message.warning("⚠️ This part has already been scanned.");
      setScannedPart("");
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
          message.success(` Part ${currentPartIndex + 1} matched.`);
        } else {
          message.success("🎉 All parts matched. Order ready for dispatch!");
          resetState();
        }
      } else {
        message.error(" Wrong Part Number. Please scan again.");
      }
    } catch (error) {
      message.error("⚠️ Error verifying Part Number. Try again.");
    }
    setLoading(false);
  };

  const resetState = () => {
    setOrder(null);
    setTrackingId("");
    setTrackingIdValid(false);
    setScannedParts([]);
  };

  const handleKeyPress = (event, type) => {
    if (event.key === "Enter") {
      if (type === "tracking") fetchOrder();
      if (type === "part") verifyPartNumber();
    }
  };

  const handlePaste = async (e, type) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData)
      .getData("text")
      .trim();

    if (type === "tracking") {
      setTrackingId(pastedText);
      fetchOrderWithValue(pastedText); // pass directly
    }

    if (type === "part") {
      setScannedPart(pastedText);
      verifyPartNumberWithValue(pastedText); // pass directly
    }
  };
  const fetchOrderWithValue = async (pastedTrackingId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/orders/scan/validateTrackingId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingId: pastedTrackingId }),
        }
      );

      const data = await response.json();
      if (data.order) {
        setOrder(data.order);
        setTrackingIdValid(true);
        setCurrentPartIndex(0);
        setScannedPart("");
        setScannedParts([]);
        message.success(`Tracking ID verified: ${pastedTrackingId}`);
      } else {
        message.error("Invalid Tracking ID. Please try again.");
      }
    } catch (error) {
      message.error("⚠️ Error fetching order. Try again.");
    }
    setLoading(false);
  };

  const verifyPartNumberWithValue = async (pastedPartNumber) => {
    if (!pastedPartNumber) {
      message.error("⚠️ Please enter a Part Number.");
      return;
    }

    if (scannedParts.includes(pastedPartNumber)) {
      message.warning("⚠️ This part has already been scanned.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/orders/scan/validatePartNumbers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingId, partNumber: pastedPartNumber }),
        }
      );

      const data = await response.json();

      if (data.message === "Part number matched.") {
        setScannedParts([...scannedParts, pastedPartNumber]);
        setScannedPart("");

        if (
          currentPartIndex + 1 <
          order.entries.flatMap((entry) => entry.partNumbers).length
        ) {
          setCurrentPartIndex(currentPartIndex + 1);
          message.success(`Part ${currentPartIndex + 1} matched.`);
        } else {
          message.success("🎉 All parts matched. Order ready for dispatch!");
          resetState();
        }
      } else {
        message.error("Wrong Part Number. Please scan again.");
      }
    } catch (error) {
      message.error("⚠️ Error verifying Part Number. Try again.");
    }
    setLoading(false);
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
        style={{
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
              onKeyPress={(e) => handleKeyPress(e, "tracking")}
              onPaste={(e) => handlePaste(e, "tracking")} // pass the event
              placeholder="🔍 Scan Tracking ID"
              style={{ fontSize: "70px", padding: "10px" }}
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
                "Verify Tracking ID"
              )}
            </Button>
          </>
        ) : (
          <>
            <p>
              🔢 Scanning Part {currentPartIndex + 1} of{" "}
              {order.entries.flatMap((entry) => entry.partNumbers).length}
            </p>
            <Input
              value={scannedPart}
              onChange={(e) => setScannedPart(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, "part")}
              onPaste={(e) => handlePaste(e, "part")} // pass the event
              placeholder="📌 Scan Part Number"
              style={{ fontSize: "70px", padding: "10px" }}
              autoFocus
            />

            <Button
              type="primary"
              style={{
                marginTop: "10px",
                width: "100%",
                fontSize: "40px",
                padding: "40px 40px 90px",
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
                "Verify Part No"
              )}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default OrdersScan;
