import api from "./api";

export const downloadTemplate = async () => {
  const response = await api.get("/product-import/template", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "product_template.xlsx");
  document.body.appendChild(link);
  link.click();
};

export const uploadMassProduct = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/product-import/upload", formData);
};

export const updateMassProduct = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/product-import/update", formData);
};