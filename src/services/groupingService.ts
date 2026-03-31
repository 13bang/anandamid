import axios from "axios";
import api from "./api";

const API_URL = `${import.meta.env.VITE_API_BASE}/api/v1/groupings`;

// GET ALL GROUPINGS
export const getGroupings = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// CREATE GROUPING
export const createGrouping = async (data: {
  name: string;
  child_ids: string[];
}) => {
  return api.post("/groupings", data);
};

// DELETE GROUPING
export const deleteGrouping = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
    
// ASSIGN CATEGORY KE GROUPING
export const assignCategoriesToGrouping = async (
  groupingId: string,
  category_ids: string[]
) => {
  const res = await axios.patch(`${API_URL}/${groupingId}/assign`, {
    category_ids,
  });
  return res.data;
};

// REMOVE CATEGORY DARI GROUPING
export const removeCategoryFromGrouping = async (
  categoryId: string
) => {
  const res = await axios.patch(`${API_URL}/remove-category/${categoryId}`);
  return res.data;
};

// GET CATEGORY YANG BELUM ADA GROUPING
export const getUngroupedCategories = async () => {
  const res = await axios.get(`${API_URL}/ungrouped`);
  return res.data;
};

export const updateGrouping = async (
  id: string,
  data: {
    name: string;
    child_ids: string[];
  }
) => {
  return api.patch(`/groupings/${id}`, data);
};