import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/categories";

export const getCategories = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createCategory = async (data: {
  name: string;
  code: string;
}) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; code?: string }
) => {
  const res = await axios.patch(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
