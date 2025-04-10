import axios from "axios";

const API = axios.create({
    baseURL: '', // Change to your server URL in production
  });
export const getServerStatus = async () => {
  const response = await API.get("/");
  return response.data;
};

export const createOrder = async (orderData) => {
  return await API.post("https://order-two-gamma.vercel.app//orders", orderData);
};

export const getOrders = async () => {
  return await API.get("https://order-two-gamma.vercel.app//orders");
};
