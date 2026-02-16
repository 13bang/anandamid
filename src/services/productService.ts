// services/productService.ts
import api from "./api";

const API_URL = "http://localhost:3000/api/v1/products";

export const getProducts = async (params?: any) => {
  const res = await api.get(API_URL, { params });
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
};
