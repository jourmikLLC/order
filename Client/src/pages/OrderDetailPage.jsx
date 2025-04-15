import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Input, Select, Form, DatePicker } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

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

        // Preprocess date fields for antd DatePicker
        form.setFieldsValue({
          ...data,
          dispatchedAt: data.dispatchedAt ? dayjs(data.dispatchedAt) : null,
          createdAt: data.createdAt ? dayjs(data.createdAt) : null,
        });
      } catch (error) {
        toast.error("Failed to fetch order details.");
      }
    };

    fetchOrderDetails();
  }, [orderId, form]);

  const handleUpdateOrder = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        dispatchedAt: values.dispatchedAt
          ? values.dispatchedAt.toISOString()
          : null,
        createdAt: values.createdAt ? values.createdAt.toISOString() : null,
      };

      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Order updated successfully!");
        navigate(-1);
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
      style={{ background: "#f7f7f7", paddingTop: "50px" }}
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
            <Form layout="vertical" form={form} onFinish={handleUpdateOrder}>
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Order ID"
                name="orderId"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Serial Number"
                name="serialNo"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Platform"
                name="platform"
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
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>

              {/* <Form.Item label="Dispatched At" name="dispatchedAt">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Created At" name="createdAt">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                />
              </Form.Item> */}

              {/* Render entries with part numbers */}
              <Form.List name="entries">
                {(fields) => (
                  <div>
                    <h5 className="mt-3">Part Entries</h5>
                    {fields.map((field, i) => (
                      <div
                        key={field.key}
                        style={{
                          marginBottom: "20px",
                          padding: "15px",
                          border: "1px solid #ccc",
                          borderRadius: "10px",
                        }}
                      >
                        <Form.Item
                          label={`Part Number Count`}
                          name={[field.name, "partNumberCount"]}
                          rules={[{ required: true }]}
                        >
                          <Select>
                            {[1, 2, 3, 4, 5].map((count) => (
                              <Option key={count} value={count}>
                                {count}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.List name={[field.name, "partNumbers"]}>
                          {(partFields) => (
                            <div>
                              {partFields.map((pf, j) => (
                                <Form.Item
                                  key={pf.key}
                                  label={`Part Number ${j + 1}`}
                                  name={[pf.name]}
                                  rules={[{ required: true }]}
                                >
                                  <Input />
                                </Form.Item>
                              ))}
                            </div>
                          )}
                        </Form.List>
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>

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
