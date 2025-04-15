import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Select, Table, DatePicker, Input, Row, Col } from "antd";
import { toast } from "react-hot-toast";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Search } = Input;
const API_URL = import.meta.env.VITE_API_URL;

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [dispatchedDate, setDispatchedDate] = useState(null);
  const navigate = useNavigate();

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
      toast.success("Orders list refreshed");
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Main filter logic
  const filterOrders = (
    status = statusFilter,
    trackingId = searchTrackingId,
    date = dispatchedDate
  ) => {
    let result = [...orders];

    if (status !== "all") {
      result = result.filter((order) => order.status === status);
    }

    if (trackingId) {
      result = result.filter((order) =>
        order.trackingId?.toLowerCase().includes(trackingId.toLowerCase())
      );
    }

    if (date) {
      result = result.filter((order) => {
        if (!order.dispatchedAt) return false;
        const dispatched = new Date(order.dispatchedAt);
        return dispatched.toDateString() === date.toDate().toDateString();
      });
    }

    setFilteredOrders(result);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    filterOrders(value, searchTrackingId, dispatchedDate);
  };

  const handleSearchChange = (value) => {
    setSearchTrackingId(value);
    filterOrders(statusFilter, value, dispatchedDate);
  };

  const handleDispatchedDateChange = (date) => {
    setDispatchedDate(date);
    filterOrders(statusFilter, searchTrackingId, date);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearchTrackingId("");
    setDispatchedDate(null);
    setFilteredOrders(orders);
  };

  const goBack = () => navigate(-1);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Part Numbers",
      key: "partNumbers",
      render: (_, record) => (
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {record.entries
            .flatMap((entry) => entry.partNumbers)
            .map((pn, i) => (
              <li key={i}>{pn}</li>
            ))}
        </ul>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "Dispatched" ? "#2ecc71" : "#f39c12",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Dispatched At",
      dataIndex: "dispatchedAt",
      key: "dispatchedAt",
      render: (date) =>
        date ? new Date(date).toLocaleString() : "Not dispatched",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/order/${record._id}`}>
          <Button type="primary">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div
      className="container-fluid"
      style={{
        paddingTop: "60px",
        padding: "0px 40px",
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* Header */}
      <div style={{ padding: "40px" }}>
        <Button
          type="link"
          onClick={goBack}
          style={{
            padding: "12px",
            background: "#02335f",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            color: "#fff",
          }}
        >
          <ArrowLeftOutlined
            style={{ marginRight: "10px", fontSize: "20px" }}
          />
          Back to Home
        </Button>
        <h1
          className="text-center p-4 mb-4"
          style={{
            fontSize: "36px",
            color: "#02335f",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          Orders List
        </h1>
      </div>

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
        <Col xs={24} sm={6}>
          <Select
            value={statusFilter}
            onChange={handleFilterChange}
            style={{ width: "100%" }}
          >
            <Select.Option value="all">All Orders</Select.Option>
            <Select.Option value="Dispatched">Dispatched</Select.Option>
            <Select.Option value="Pending">Pending</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={6}>
          <Search
            placeholder="Search Tracking ID"
            allowClear
            enterButton
            value={searchTrackingId}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearchChange}
          />
        </Col>
        <Col xs={24} sm={6}>
          <DatePicker
            onChange={handleDispatchedDateChange}
            value={dispatchedDate}
            style={{ width: "100%" }}
            placeholder="Filter by Dispatched Date"
            allowClear
          />
        </Col>
        <Col xs={24} sm={3}>
          <Button
            onClick={handleResetFilters}
            style={{ width: "100%", backgroundColor: "red", marginTop: "2px" }}
          >
            Reset Filters
          </Button>
        </Col>
        <Col xs={24} sm={3}>
          <Button
            type="primary"
            onClick={fetchOrders}
            style={{ width: "100%", marginTop: "2px" }}
          >
            Refresh List
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 30 }}
        bordered
      />
    </div>
  );
}

export default OrderDetails;
