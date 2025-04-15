import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "antd";
import { toast } from "react-hot-toast";
import LogoutButton from "../components/logout";
const HomePage = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleCreateOrderClick = () => {
    toast.success("Navigating to create a new order...");
  };

  const handleOrdersDetailsClick = () => {
    toast.success("Navigating ");
  };

  return (
    <div
      className="container-fluid"
      style={{
        height: "100vh",
        paddingTop: "20px",
        backgroundColor: "#f4f6f9",
      }}
    >
      <div className="d-flex justify-content-end ">
        <LogoutButton /> {/* Add LogoutButton here */}
      </div>

      <div className="row justify-content-center">
        <div className="col">
          <Card
            title={
              <span
                style={{
                  color: "#02335f",
                  fontSize: "60px",
                  fontWeight: "bold",
                }}
              >
                Welcome to the Order Management System
              </span>
            }
            style={{
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "30px",
              fontSize: "26px",
              backgroundColor: "#fff",
            }}
          >
            {/* ✅ Show only for admin after role is loaded */}
            {role === "admin" && (
              <>
                {" "}
                <div className="text-center">
                  <Link to="/order-entry">
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={handleCreateOrderClick}
                      style={{
                        marginBottom: "15px",
                        borderRadius: "8px",
                        fontSize: "40px",
                        padding: "40px 40px 100px",
                        backgroundColor: "#2980b9",
                        borderColor: "#2980b9",
                      }}
                    >
                      Create New Order
                    </Button>
                  </Link>
                </div>
                <div className="text-center">
                  <Link to="/orders-details">
                    <Button
                      type="default"
                      size="large"
                      block
                      onClick={handleOrdersDetailsClick}
                      style={{
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "40px",
                        padding: "40px 40px 100px",
                        backgroundColor: "#f1c40f",
                        borderColor: "#f1c40f",
                      }}
                    >
                      See All Orders
                    </Button>
                  </Link>
                </div>
              </>
            )}
            <div className="text-center">
              <Link to="/warehouse-list">
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={handleOrdersDetailsClick}
                  style={{
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "40px",
                    padding: "40px 40px 100px",
                    backgroundColor: "#f10fed",
                    borderColor: "#f10fed",
                  }}
                >
                  Warehouse List{" "}
                </Button>
              </Link>
            </div>
            <div className="text-center mt-2">
              <Link to="/orders-scan">
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={handleOrdersDetailsClick}
                  style={{
                    borderRadius: "8px",
                    fontSize: "40px",
                    padding: "40px 40px 100px",
                    backgroundColor: "rgb(45 211 22)",
                    borderColor: "#f6c40f",
                  }}
                >
                  Scan Orders (For Warehouse Scanner)
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
