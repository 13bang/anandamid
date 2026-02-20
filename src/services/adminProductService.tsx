// services/adminProductService.ts
import api from "./api";

const API_URL = "http://localhost:3000/api/v1/admin/products";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAdminProducts = async (params?: any) => {
  const res = await api.get(API_URL, {
    params,
    headers: getAuthHeader(),
  });
  return res.data;
};

export const createAdminProduct = async (data: any) => {
  const res = await api.post(API_URL, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const updateAdminProduct = async (id: string, data: any) => {
  const res = await api.put(`${API_URL}/${id}`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const deleteAdminProduct = async (id: string) => {
  await api.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
};

export const getAdminProductById = async (id: string) => {
  const res = await api.get(`/admin/products/${id}`);
  return res.data;
};
