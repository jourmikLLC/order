import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { createOrder } from "../api";
import toast from "react-hot-toast";

function OrderForm() {
  const [form] = Form.useForm();
  const [entries, setEntries] = useState([{ trackingId: "", partNumbers: [""] }]);

  const handlePartNumberChange = (index, value) => {
    const newEntries = [...entries];
    newEntries[index].partNumbers = Array.from({ length: value }, () => "");
    setEntries(newEntries);
  };

  const handleSubmit = async (values) => {
    try {
      await createOrder({ ...values, entries });
      toast.success("Order created successfully!");
      form.resetFields();
      setEntries([{ trackingId: "", partNumbers: [""] }]);
    } catch (error) {
      console.error("Error saving order", error);
      toast.error("Error saving order!");
    }
  };

  return (
    <div className="bg-light p-4 rounded shadow-sm">
      <h3 className="text-center mb-4 text-primary">Create Order</h3>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
        <Form.Item label="Customer Name" name="customerName" rules={[{ required: true, message: "Please enter customer name!" }]}> 
          <Input placeholder="Enter Customer Name" />
        </Form.Item>
        
        {entries.map((entry, index) => (
          <div key={index} className="mb-3">
            <Form.Item label={`Tracking ID`} name={["entries", index, "trackingId"]} rules={[{ required: true, message: "Enter Tracking ID!" }]}> 
              <Input placeholder="Enter Tracking ID" />
            </Form.Item>
            <Form.Item label="Number of Part Numbers" name={["entries", index, "partNumberCount"]}>
              <Select defaultValue={1} onChange={(value) => handlePartNumberChange(index, value)}>
                {[1, 2, 3, 4, 5].map(num => (
                  <Select.Option key={num} value={num}>{num}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            {entry.partNumbers.map((_, pnIndex) => (
              <Form.Item key={pnIndex} label={`Part Number ${pnIndex + 1}`} name={["entries", index, "partNumbers", pnIndex]} rules={[{ required: true, message: "Enter part number!" }]}> 
                <Input placeholder="Enter Part Number" />
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