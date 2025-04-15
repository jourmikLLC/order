import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "antd"; // Importing Ant Design components
import { toast } from "react-hot-toast"; // Importing React Hot Toast

const HomePage = () => {
  // Show success toast on button click
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
        paddingTop: "60px",
        backgroundColor: "#f4f6f9",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card
            title={
              <span
                style={{
                  color: "#02335f",
                  fontSize: "32px",
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
            <h4
              className="text-center"
              style={{
                color: "#34495e",
                fontSize: "20px",
                marginBottom: "30px",
              }}
            >
              Manage your orders with ease
            </h4>

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
                    padding: "40px 40px 80px",
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
                    padding: "40px 40px 80px",
                    backgroundColor: "#f1c40f",
                    borderColor: "#f1c40f",
                  }}
                >
                  See All Orders
                </Button>
              </Link>
            </div>

            {/* <div className="text-center">
              <Link to="/orders-scan">
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={handleOrdersDetailsClick}
                  style={{
                    borderRadius: "8px",
                    fontSize: "40px",
                    padding:"40px",
                    backgroundColor: "rgb(15 241 92)",
                    borderColor: "#f1c40f",
                  }}
                  disabled
                >
                  Scan Orders
                </Button>
              </Link>
            </div> */}
            <div className="text-center p-2 mt-2">
              <Link to="/orders-scan2">
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={handleOrdersDetailsClick}
                  style={{
                    borderRadius: "8px",
                    fontSize: "40px",
                    padding: "40px 40px 80px",
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
