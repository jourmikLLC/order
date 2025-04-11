import React from "react";
import OrderForm from "../components/OrderForm";
import { Row, Col, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons"; // Back Arrow Icon
import { useNavigate } from "react-router-dom"; // For navigation

const OrderDetailsEntry = () => {
  const navigate = useNavigate(); // Hook for navigating back

  // Back button handler
  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div
      className="container-fluid"
      style={{ paddingTop: "60px", backgroundColor: "#f7f7f7" }}
    >
      <Row justify="center">
        <Col span={18} md={12}>
          <div className="text-center mb-5">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={goBack}
              style={{
                fontSize: "18px",
                color: "#2980b9",
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              Back to Orders
            </Button>
            <h1
              className="display-4"
              style={{ color: "#2c3e50", fontSize: "36px", fontWeight: "bold" }}
            >
              Order Management System
            </h1>
            <p className="lead" style={{ color: "#7f8c8d", fontSize: "18px" }}>
              Create a new order below
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "30px",
              marginBottom: "40px",
            }}
          >
            <OrderForm />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailsEntry;
