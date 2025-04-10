import React from "react";
import { Form, Input, Button } from "antd";
import { createOrder } from "../api";
import toast from "react-hot-toast";  // Toast for notifications

function OrderForm() {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await createOrder(values);
      toast.success("Order created successfully!");  // Show success toast
      form.resetFields(); // Reset form fields after successful submission
    } catch (error) {
      console.error("Error saving order", error);
      toast.error("Error saving order!");  // Show error toast
    }
  };

  return (
    <div className="bg-light p-4 rounded shadow-sm">
      <h3 className="text-center mb-4 text-primary">Create Order</h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: "500px", margin: "auto" }}
      >
        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: "Please enter customer name!" }]}
        >
          <Input placeholder="Enter Customer Name" />
        </Form.Item>
        
        <Form.Item
          label="Part Number"
          name="partNumber"
          rules={[{ required: true, message: "Please enter part number!" }]}
        >
          <Input placeholder="Enter Part Number" />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter quantity!" }]}
        >
          <Input type="number" placeholder="Enter Quantity" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price!" }]}
        >
          <Input type="number" placeholder="Enter Price" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Order
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default OrderForm;
