import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Modal,
  Select,
  Table,
  DatePicker,
  Input,
  Row,
  Col,
} from "antd";
import { toast } from "react-hot-toast";
import { ArrowLeftOutlined } from "@ant-design/icons";
const role = localStorage.getItem("role");

const { Search } = Input;
const API_URL = import.meta.env.VITE_API_URL;

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [createdDate, setCreatedDate] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);

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
    date = createdDate
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
        if (!order.createdAt) return false;
        const created = new Date(order.createdAt);
        return created.toDateString() === date.toDate().toDateString();
      });
    }

    setFilteredOrders(result);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    filterOrders(value, searchTrackingId, createdDate);
  };

  const handleSearchChange = (value) => {
    setSearchTrackingId(value);
    filterOrders(statusFilter, value, createdDate);
  };

  const handleCreatedDateChange = (date) => {
    setCreatedDate(date);
    filterOrders(statusFilter, searchTrackingId, date);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearchTrackingId("");
    setCreatedDate(null);
    setFilteredOrders(orders);
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderIdToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setShowModal(false);
        fetchOrders();
      } else {
        toast.error(data.message || "Error deleting order");
      }
    } catch (error) {
      toast.error("Error deleting order");
      console.error(error);
    }
  };

  const openModal = (orderId) => {
    setOrderIdToDelete(orderId);
    setShowModal(true);
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
      title: "Serial No",
      dataIndex: "serialNo",
      key: "serialNo",
    },
    {
      title: "platform",
      dataIndex: "platform",
      key: "platform",
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Dispatched At",
      dataIndex: "dispatchedAt",
      key: "dispatchedAt",
      render: (date) => (date ? new Date(date).toLocaleString() : "-"),
    },
    ...(role === "admin"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <div>
                <Link to={`/order/${record._id}`}>
                  <Button type="primary">Edit</Button>
                </Link>
                <Button
                  type="danger"
                  style={{ marginLeft: "10px" }}
                  onClick={() => openModal(record._id)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Are you sure you want to delete this order?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)} // Close modal on cancel
              ></button>
            </div>
            <div className="modal-body">This action cannot be undone.</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setShowModal(false)} // Close modal on cancel
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteOrder} // Confirm deletion
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="container-fluid"
        style={{
          paddingTop: "60px",
          padding: "0px 40px",
          backgroundColor: "#f7f7f7",
        }}
      >
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

        {/* Filters and Search */}
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
              onChange={handleCreatedDateChange}
              value={createdDate}
              style={{ width: "100%" }}
              placeholder="Filter by Created Date"
              allowClear
            />
          </Col>
          <Col xs={24} sm={3}>
            <Button
              onClick={handleResetFilters}
              style={{
                width: "100%",
                backgroundColor: "red",
                marginTop: "2px",
              }}
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

        {/* Orders Table */}
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 30 }}
          bordered
        />
      </div>
    </div>
  );
}

export default OrderDetails;
