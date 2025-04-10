import axios from "axios";

const API = axios.create({
  baseURL: "/api", // Uses Vite's proxy
});

export const getServerStatus = async () => {
  const response = await API.get("/");
  return response.data;
};

export const createOrder = async (orderData) => {
  return await API.post("/orders", orderData);
};

export const getOrders = async () => {
  return await API.get("/orders");
};
