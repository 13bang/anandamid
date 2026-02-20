import api from "./api";

const API_URL = "http://localhost:3000/api/v1/product-images";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createProductImages = async (data: {
  product_id: string;
  image_urls: string[];
}) => {
  const res = await api.post(API_URL, data, {
    headers: getAuthHeader(),
  });

  return res.data;
};

export const deleteProductImage = async (id: string) => {
  const res = await api.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });

  return res.data;
};

