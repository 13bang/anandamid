import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE}/api/v1/categories`;

interface CategoryPayload {
  name: string;
  code: string;
  image?: File | null;
}

export const getCategories = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getParentCategories = async () => {
  const res = await axios.get(`${API_URL}/parents`);
  return res.data;
};

export const createCategory = async (data: CategoryPayload) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("code", data.code);

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateCategory = async (
  id: string,
  data: FormData
) => {
  const res = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteCategory = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};