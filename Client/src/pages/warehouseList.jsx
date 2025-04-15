import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { toast } from "react-hot-toast";

const role = localStorage.getItem("role");
const API_URL = import.meta.env.VITE_API_URL;

function WarehouseList() {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);

  const todayDateString = new Date().toDateString();

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();

      const todayPending = data.filter((order) => {
        const createdAt = new Date(order.createdAt).toDateString();
        return order.status === "Pending" && createdAt === todayDateString;
      });

      setOrders(todayPending);
      setVisibleOrders(todayPending.slice(0, 4));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Poll every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 5000); // 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const columns = [
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (platform) => (
        <span style={{ fontSize: "60px" }}>{platform}</span>
      ),
    },
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
      render: (text) => <span style={{ fontSize: "60px" }}>{text}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <span style={{ fontSize: "60px" }}>{text}</span>,
    },
    {
      title: "Part Numbers",
      key: "partNumbers",
      render: (_, record) => (
        <ul style={{ fontSize: "60px", paddingLeft: "20px", margin: 0 }}>
          {record.entries
            ?.flatMap((entry) => entry.partNumbers)
            .map((pn, i) => (
              <li style={{ listStyle: "none" }} key={i}>
                {pn}
              </li>
            ))}
        </ul>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      {/* <h1 style={{ fontSize: "55px", marginBottom: "30px" }}>
        Today's Pending Orders
      </h1> */}
      <Table
        dataSource={visibleOrders}
        columns={columns}
        rowKey="_id"
        pagination={false}
        bordered
      />
    </div>
  );
}

export default WarehouseList;
