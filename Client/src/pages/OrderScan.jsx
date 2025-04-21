import React, { useState, useRef } from "react";
import { Input, Button, Card, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_API_URL;
const getPartCountMap = (parts) => {
  return parts.reduce((map, part) => {
    map[part] = (map[part] || 0) + 1;
    return map;
  }, {});
};

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
  const trackingInputRef = useRef(null);
  const partInputRef = useRef(null);

  const sanitizeInput = (value) => {
    return value.replace(/\D/g, ""); // Remove all non-digit characters
  };

  const handlePaste = async (e, type) => {
    // e.preventDefault();

    // Get the pasted text
    const pastedText = (e.clipboardData || window.clipboardData)
      .getData("text")
      .trim();
    const sanitizedText = sanitizeInput(pastedText); // Sanitize the pasted input
  };

  const fetchOrder = async () => {
    setLoading(true);
    const cleanedTrackingId = sanitizeInput(trackingId); // ensure it's numeric
    setTrackingId(cleanedTrackingId);

    try {
      const response = await fetch(
        `${API_URL}/orders/scan/validateTrackingId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingId: cleanedTrackingId }),
        }
      );

      const data = await response.json();

      if (data.order) {
        if (data.order.status === "Dispatched") {
          message.warning("⚠️ This order has already been dispatched.");
          errorBeep.play();
          setTrackingId("");
          setLoading(false);
          return;
        }
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
  const verifyPartNumber = async () => {
    if (!scannedPart) {
      message.error("⚠️ Please enter a Part Number.");
      errorBeep.play();
      return;
    }

    const allParts = order.entries.flatMap((entry) => entry.partNumbers);
    const expectedPartsMap = getPartCountMap(allParts);
    const scannedPartsMap = getPartCountMap(scannedParts);

    const alreadyScannedCount = scannedPartsMap[scannedPart] || 0;
    const expectedCount = expectedPartsMap[scannedPart] || 0;

    if (alreadyScannedCount >= expectedCount) {
      message.warning(
        "⚠️ This part has already been scanned the required number of times."
      );
      setScannedPart("");
      errorBeep.play();
      return;
    }

    setLoading(true);
    try {
      const cleanedTrackingId = sanitizeInput(trackingId); // ensure it's numeric
      const response = await fetch(
        `${API_URL}/orders/scan/validatePartNumbers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trackingId: cleanedTrackingId,
            partNumber: scannedPart,
          }),
        }
      );

      const data = await response.json();

      if (data.message === "Part number matched.") {
        setScannedParts((prev) => [...prev, scannedPart]);
        setScannedPart("");
        successBeep.play();

        if (scannedParts.length + 1 < allParts.length) {
          setCurrentPartIndex(scannedParts.length + 1);
          message.success(`✅ Part ${scannedParts.length + 1} matched.`);
        } else {
          // All parts scanned, dispatch order
          const dispatchResponse = await fetch(
            `${API_URL}/orders/scan/markDispatched`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                trackingId,
                dispatchedAt: new Date().toISOString(),
              }),
            }
          );

          const dispatchData = await dispatchResponse.json();

          if (dispatchResponse.ok) {
            message.success("🎉 Order marked as dispatched!");
            successBeep.play();
            localStorage.setItem("dispatchUpdate", Date.now());
          } else {
            message.warning(
              `All parts matched, but dispatch failed: ${dispatchData.message}`
            );
            errorBeep.play();
          }

          resetState();
        }
      } else {
        message.error("❌ Wrong Part Number. Please scan again.");
        errorBeep.play();
        setScannedPart("");
      }
    } catch (error) {
      message.error("⚠️ Error verifying Part Number. Try again.");
      errorBeep.play();
      setScannedPart("");
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
    e.preventDefault();
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
              // ref={trackingInputRef}
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)} // Apply sanitizeInput here
              onKeyPress={(e) => handleKeyPress(e, "tracking")}
              onPaste={(e) => handlePaste(e, "tracking")}
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
              onKeyPress={(e) => handleKeyPress(e, "part")}
              onPaste={(e) => handlePaste(e, "part")}
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

// import { Input, Button, Card, message, Spin } from "antd";
// import { LoadingOutlined } from "@ant-design/icons";

// const API_URL = import.meta.env.VITE_API_URL;
// const errorBeep = new Audio("/sounds/error-beep.mp3");
// const successBeep = new Audio("/sounds/success-beep.mp3");
// message.config({
//   top: 100,
//   duration: 3,
// });

// function OrdersScan() {
//   const [trackingId, setTrackingId] = useState("");
//   const [order, setOrder] = useState(null);
//   const [currentPartIndex, setCurrentPartIndex] = useState(0);
//   const [scannedPart, setScannedPart] = useState("");
//   const [trackingIdValid, setTrackingIdValid] = useState(false);
//   const [scannedParts, setScannedParts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchOrder = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${API_URL}/orders/scan/validateTrackingId`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ trackingId }),
//         }
//       );

//       const data = await response.json();
//       if (data.order) {
//         setOrder(data.order);
//         setTrackingIdValid(true);
//         setCurrentPartIndex(0);
//         setScannedPart("");
//         setScannedParts([]);
//         message.success(`Tracking ID verified: ${trackingId}`);
//         successBeep.play();
//       } else {
//         message.error("Invalid Tracking ID. Please try again.");
//         errorBeep.play();
//       }
//     } catch (error) {
//       message.error("⚠️ Error fetching order. Try again.");
//       errorBeep.play();
//     }
//     setLoading(false);
//   };

//   const verifyPartNumber = async () => {
//     if (!scannedPart) {
//       message.error("⚠️ Please enter a Part Number.");
//       errorBeep.play();
//       return;
//     }

//     if (scannedParts.includes(scannedPart)) {
//       message.warning("⚠️ This part has already been scanned.");
//       setScannedPart("");
//       errorBeep.play();
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${API_URL}/orders/scan/validatePartNumbers`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ trackingId, partNumber: scannedPart }),
//         }
//       );

//       const data = await response.json();

//       if (data.message === "Part number matched.") {
//         setScannedParts([...scannedParts, scannedPart]);
//         setScannedPart("");
//         successBeep.play();

//         if (
//           currentPartIndex + 1 <
//           order.entries.flatMap((entry) => entry.partNumbers).length
//         ) {
//           setCurrentPartIndex(currentPartIndex + 1);
//           message.success(`Part ${currentPartIndex + 1} matched.`);
//         } else {
//           message.success("🎉 All parts matched. Order ready for dispatch!");
//           successBeep.play();
//           resetState();
//         }
//       } else {
//         message.error("Wrong Part Number. Please scan again.");
//         errorBeep.play();
//       }
//     } catch (error) {
//       message.error("⚠️ Error verifying Part Number. Try again.");
//       errorBeep.play();
//     }
//     setLoading(false);
//   };

//   const resetState = () => {
//     setOrder(null);
//     setTrackingId("");
//     setTrackingIdValid(false);
//     setScannedParts([]);
//   };

//   const handleKeyPress = (event, type) => {
//     if (event.key === "Enter") {
//       if (type === "tracking") fetchOrder();
//       if (type === "part") verifyPartNumber();
//     }
//   };

//   const handlePaste = async (e, type) => {
//     e.preventDefault();
//     const pastedText = (e.clipboardData || window.clipboardData)
//       .getData("text")
//       .trim();

//     if (type === "tracking") {
//       setTrackingId(pastedText);
//       await new Promise((resolve) => setTimeout(resolve, 20));
//       fetchOrder();
//     }

//     if (type === "part") {
//       setScannedPart(pastedText);
//       await new Promise((resolve) => setTimeout(resolve, 20));
//       verifyPartNumber();
//     }
//   };

//   return (
//     <div
//       className="container-fluid"
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         fontSize: "70px",
//         alignItems: "center",
//         height: "100vh",
//         backgroundColor: "#f8d9fa",
//       }}
//     >
//       <Card
//         style={{
//           padding: "20px",
//           textAlign: "center",
//           fontSize: "70px",
//           fontWeight: "bold",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//           borderRadius: "10px",
//         }}
//       >
//         {!trackingIdValid ? (
//           <>
//             <p style={{ fontSize: "70px" }}>
//               Enter Tracking ID to fetch order details:
//             </p>
//             <Input
//               value={trackingId}
//               onChange={(e) => setTrackingId(e.target.value)}
//               onKeyPress={(e) => handleKeyPress(e, "tracking")}
//               onPaste={(e) => handlePaste(e, "tracking")}
//               placeholder="🔍 Scan Tracking ID"
//               style={{ fontSize: "70px", padding: "10px" }}
//               autoFocus
//             />
//             <Button
//               type="primary"
//               style={{
//                 marginTop: "10px",
//                 width: "100%",
//                 fontSize: "40px",
//                 padding: "20px 20px 80px",
//                 fontWeight: "bold",
//                 borderRadius: "8px",
//                 backgroundColor: "#1890ff",
//                 border: "none",
//               }}
//               onClick={fetchOrder}
//               disabled={loading}
//             >
//               {loading ? (
//                 <Spin
//                   indicator={
//                     <LoadingOutlined
//                       style={{ fontSize: 70, color: "#fff" }}
//                       spin
//                     />
//                   }
//                 />
//               ) : (
//                 "Verify Tracking ID"
//               )}
//             </Button>
//           </>
//         ) : (
//           <>
//             <p>
//               🔢 Scanning Part {currentPartIndex + 1} of{" "}
//               {order.entries.flatMap((entry) => entry.partNumbers).length}
//             </p>
//             <Input
//               value={scannedPart}
//               onChange={(e) => setScannedPart(e.target.value)}
//               onKeyPress={(e) => handleKeyPress(e, "part")}
//               onPaste={(e) => handlePaste(e, "part")}
//               placeholder="📌 Scan Part Number"
//               style={{ fontSize: "70px", padding: "10px" }}
//               autoFocus
//             />
//             <Button
//               type="primary"
//               style={{
//                 marginTop: "10px",
//                 width: "100%",
//                 fontSize: "40px",
//                 padding: "40px 40px 80px",
//                 paddingBottom: "40px",
//                 fontWeight: "bold",
//                 borderRadius: "8px",
//                 backgroundColor: "#1890ff",
//                 border: "none",
//               }}
//               onClick={verifyPartNumber}
//               disabled={loading}
//             >
//               {loading ? (
//                 <Spin
//                   indicator={
//                     <LoadingOutlined
//                       style={{ fontSize: 70, color: "#fff" }}
//                       spin
//                     />
//                   }
//                 />
//               ) : (
//                 "Verify Part No"
//               )}
//             </Button>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }

// export default OrdersScan;
