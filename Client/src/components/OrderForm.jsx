import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { createOrder } from "../api";
import toast from "react-hot-toast";

function OrderForm() {
  const [form] = Form.useForm();
  const [entries, setEntries] = useState([
    { partNumberCount: 1, partNumbers: [""] },
  ]);

  // Handle change in number of part numbers
  const handlePartNumberCountChange = (index, value) => {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index].partNumberCount = value;
      newEntries[index].partNumbers = Array(value).fill(""); // Reset partNumbers array with the correct size
      return newEntries;
    });
  };

  // Handle change in part number inputs
  const handlePartNumberInputChange = (entryIndex, partIndex, value) => {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[entryIndex].partNumbers[partIndex] = value;
      return newEntries;
    });
  };

  // Submit Form
  const handleSubmit = async (values) => {
    try {
      const orderData = {
        customerName: values.customerName,
        trackingId: values.trackingId,
        entries: entries.map((entry) => ({
          partNumberCount: entry.partNumberCount, // Send number of part numbers
          partNumbers: entry.partNumbers.filter((part) => part), // Remove empty values
        })),
      };
      console.log("Payload Sent:", orderData); // Debugging
      await createOrder(orderData);
      toast.success("Order created successfully!");
      form.resetFields();
      setEntries([{ partNumberCount: 1, partNumbers: [""] }]); // Reset form
    } catch (error) {
      console.error("Error saving order", error);
      toast.error("Error saving order!");
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
          label="Tracking ID"
          name="trackingId"
          rules={[{ required: true, message: "Enter Tracking ID!" }]}
        >
          <Input placeholder="Enter Tracking ID" />
        </Form.Item>

        {entries.map((entry, index) => (
          <div key={index} className="mb-3">
            <Form.Item label="Number of Part Numbers">
              <Select
                value={entry.partNumberCount}
                onChange={(value) => handlePartNumberCountChange(index, value)}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <Select.Option key={num} value={num}>
                    {num}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {entry.partNumbers.map((partNumber, pnIndex) => (
              <Form.Item
                key={pnIndex}
                label={`Part Number ${pnIndex + 1}`}
                rules={[{ required: true, message: "Enter part number!" }]}
              >
                <Input
                  placeholder="Enter Part Number"
                  value={partNumber}
                  onChange={(e) =>
                    handlePartNumberInputChange(index, pnIndex, e.target.value)
                  }
                />
              </Form.Item>
            ))}
          </div>
        ))}

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
