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
    }, 3000); // 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const columns = [
    {
      title: "PlatF",
      dataIndex: "platform",
      key: "platform",
      render: (platform) => (
        <span style={{ fontSize: "50px" }}>{platform}</span>
      ),
    },
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
      render: (text) => <span style={{ fontSize: "50px" }}>{text}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <span style={{ fontSize: "50px" }}>{text}</span>,
    },
    {
      title: "Part Numbers",
      key: "partNumbers",
      render: (_, record) => {
        const partList =
          record.entries?.flatMap((entry) => entry.partNumbers) || [];

        // Create frequency map
        const partCountMap = partList.reduce((acc, pn) => {
          if (pn) {
            acc[pn] = (acc[pn] || 0) + 1;
          }
          return acc;
        }, {});

        return (
          <ol style={{ fontSize: "50px", margin: 0 }}>
            {Object.entries(partCountMap).map(([part, count], i) => (
              <li style={{ listStyle: "none" }} key={i}>
                {part} {count > 1 ? `× ${count}` : ""}
              </li>
            ))}
          </ol>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "30px", fontWeight: "bold" }}>
      {/* <h1 style={{ fontSize: "55px", marginBottom: "30px" }}>
        Today's Pending Orders
      </h1> */}
      <Table
        className="warehouse-list"
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
