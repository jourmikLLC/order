import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL; // Read from .env

const API = axios.create({
  baseURL: `${API_URL}`, // Uses Vite's proxy
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
