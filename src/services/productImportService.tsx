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

// TEMPLATE UPDATE (baru)
export const downloadUpdateTemplate = async (categoryCodes?: string[]) => {

  const query =
    categoryCodes && categoryCodes.length
      ? `?category_code=${categoryCodes.join(",")}`
      : "";

  const response = await api.get(`/product-import/template-update${query}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "product_update_template.xlsx");

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

export const listenImportProgress = (onMessage: (msg: string) => void) => {

  const eventSource = new EventSource(
    `${import.meta.env.VITE_API_BASE}/api/v1/product-import/progress`
  );

  eventSource.onmessage = (event) => {
    onMessage(event.data);
  };

  eventSource.onerror = () => {
    eventSource.close();
  };

  return eventSource;
};