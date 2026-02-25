const BASE_URL = "http://localhost:3000/api/v1/banner-image";

export interface Banner {
  id: string;
  title?: string;
  slot?: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export const getBanners = async (): Promise<Banner[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Gagal fetch banner");
  console.log(res);
  return res.json();
};

export const uploadBanner = async (
  file: File,
  slot: string
): Promise<Banner> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("slot", slot);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Gagal upload banner");
  return res.json();
};

export const updateBanner = async (
  id: string,
  file: File
): Promise<Banner> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Gagal update banner");
  return res.json();
};

export const deleteBanner = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Gagal delete banner");
};

export const updateBannerTitle = async (
  id: string,
  title: string
) => {
  const res = await fetch(
    `http://localhost:3000/api/v1/banner-image/${id}/title`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    }
  );

  if (!res.ok) {
    throw new Error("Gagal update title");
  }

  return res.json();
};

export const updateBannerSlot = async (id: string, slot: string) => {
  const res = await fetch(`http://localhost:3000/api/v1/banner-image/${id}/slot`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slot }),
  });

  if (!res.ok) throw new Error("Gagal update slot");
  return res.json();
};