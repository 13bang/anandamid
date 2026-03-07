export const getThumbnailUrl = (url: string) => {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  const fileName = url.split("/").pop();

  return `${import.meta.env.VITE_API_BASE}/uploads/products/thumbnails/${fileName}`;
};

export const getOriginalUrl = (url: string) => {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  const fileName = url.split("/").pop();

  return `${import.meta.env.VITE_API_BASE}/uploads/products/original/${fileName}`;
};