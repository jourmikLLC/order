import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Input, Select, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";

const { TextArea } = Input;
const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL;

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        const data = await response.json();
        setOrder(data);
        form.setFieldsValue(data);
      } catch (error) {
        toast.error("Failed to fetch order details.");
      }
    };

    fetchOrderDetails();
  }, [orderId, form]);

  const handleUpdateOrder = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Order updated successfully!");
        navigate(-1); // go back
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate(-1);

  if (!order) return <div>Loading...</div>;

  return (
    <div
      className="container-fluid"
      style={{ background: "rgb(247, 247, 247)", paddingTop: "50px" }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Back Button */}
          <Button
            type="link"
            onClick={goBack}
            style={{
              padding: "12px",
              fontSize: "20px",
              background: "#02335f",
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              color: "#fff",
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: "10px" }} />
            Back to Orders
          </Button>

          {/* Order Edit Form */}
          <Card
            title={`Edit Order: ${order.orderId}`}
            style={{
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "30px",
            }}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleUpdateOrder}
              initialValues={order}
            >
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tracking ID"
                name="trackingId"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Pending">Pending</Option>
                  <Option value="Dispatched">Dispatched</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Dispatched At" name="dispatchedAt">
                <Input placeholder="ISO Date String (optional)" />
              </Form.Item>

              {/* Additional editable fields can go here */}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: "100%", marginTop: "20px" }}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
