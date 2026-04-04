import api from "./api";

// GET ALL GROUPINGS
export const getGroupings = async () => {
  const res = await api.get("/groupings");
  return res.data;
};

// CREATE GROUPING
export const createGrouping = (data: FormData) => {
  return api.post("/groupings", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE GROUPING
export const deleteGrouping = async (id: string) => {
  return api.delete(`/groupings/${id}`);
};

// ASSIGN CATEGORY KE GROUPING
export const assignCategoriesToGrouping = async (
  groupingId: string,
  category_ids: string[]
) => {
  const res = await api.patch(`/groupings/${groupingId}/assign`, {
    category_ids,
  });
  return res.data;
};

// REMOVE CATEGORY DARI GROUPING
export const removeCategoryFromGrouping = async (categoryId: string) => {
  const res = await api.patch(`/groupings/remove-category/${categoryId}`);
  return res.data;
};

// GET CATEGORY YANG BELUM ADA GROUPING
export const getUngroupedCategories = async () => {
  const res = await api.get("/groupings/ungrouped");
  return res.data;
};

// UPDATE GROUPING
export const updateGrouping = (id: string, data: FormData) => {
  return api.patch(`/groupings/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};