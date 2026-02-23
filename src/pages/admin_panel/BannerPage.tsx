import { useEffect, useState } from "react";
import {
  getBanners,
  uploadBanner,
  deleteBanner,
  updateBanner,
  updateBannerTitle,
  type Banner,
} from "../../services/bannerService";
import { Upload, Trash2, RefreshCw, Pencil } from "lucide-react";

const BASE_FILE_URL = "http://localhost:3000";

export default function BannerPage() {
  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempTitle, setTempTitle] = useState("");

  const fetchData = async () => {
    try {
      const res = await getBanners();
      setData(res);
    } catch {
      alert("Gagal mengambil banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await uploadBanner(selectedFile);
      setSelectedFile(null);
      await fetchData();
      alert("Upload berhasil");
    } catch {
      alert("Upload gagal");
    } finally {
      setUploading(false);
    }
  };

    const handleSaveTitle = async (id: string) => {
        try {
            await updateBannerTitle(id, tempTitle);
            setEditingId(null);
            await fetchData();
        } catch {
            alert("Gagal update title");
        }
    };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus banner?")) return;
    await deleteBanner(id);
    await fetchData();
  };

  const handleReplace = async (id: string, file: File) => {
    await updateBanner(id, file);
    await fetchData();
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <div className="flex items-start gap-10 p-10">
        {/* LEFT SIDE */}
        <div className="flex-1">
            {data.length === 0 && (
                <p className="text-gray-500">Belum ada banner</p>
            )}

            <div className="flex flex-col gap-6">
                {data.map((banner) => (
                <div
                    key={banner.id}
                    className="overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md"
                >
                    {/* TITLE */}
                    <div className="px-4 py-3 border-b border-gray-100">
                    {editingId === banner.id ? (
                        <input
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={() => handleSaveTitle(banner.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                handleSaveTitle(banner.id);
                                }
                            }}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            autoFocus
                        />
                    ) : (
                        <h3
                        onClick={() => {
                            setEditingId(banner.id);
                            setTempTitle(
                            banner.title ||
                                banner.image_url.split("/").pop()?.split(".")[0] ||
                                ""
                            );
                        }}
                        className="flex items-center justify-between text-sm font-semibold cursor-pointer group hover:text-gray-600"
                        >
                        <span>
                            {banner.title ||
                            banner.image_url.split("/").pop()?.split(".")[0]}
                        </span>

                        <Pencil
                            size={14}
                            className="text-gray-400 transition"
                        />
                        </h3>
                    )}
                    </div>

                    {/* IMAGE */}
                    <img
                    src={`${BASE_FILE_URL}${banner.image_url}`}
                    alt="banner"
                    onClick={() =>
                        setPreviewImage(
                        `${BASE_FILE_URL}${banner.image_url}`
                        )
                    }
                    className="w-full h-[200px] object-cover cursor-pointer"
                    />

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 p-4 border-t border-gray-100">
                    <label className="flex items-center justify-center flex-1 h-10 gap-2 text-sm font-medium transition border border-gray-300 cursor-pointer rounded-xl bg-gray-50 hover:bg-gray-100">
                        <RefreshCw size={16} />
                        Ganti Banner
                        <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                            handleReplace(
                                banner.id,
                                e.target.files[0]
                            );
                            }
                        }}
                        />
                    </label>

                    <button
                        onClick={() => handleDelete(banner.id)}
                        className="flex items-center justify-center w-10 h-10 transition hover:bg-red-50 rounded-xl"
                    >
                        <Trash2
                        size={16}
                        className="text-red-500"
                        />
                    </button>
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* RIGHT SIDE - UPLOAD PANEL */}
        <div className="w-[340px] border border-gray-200 p-6 rounded-2xl shadow-sm sticky top-10 bg-white">
          <h3 className="mb-5 text-lg font-semibold">
            Upload Banner
          </h3>

          <label className="flex items-center gap-3 p-3 transition border border-gray-400 border-dashed cursor-pointer rounded-xl hover:bg-gray-50">
            <Upload size={18} />
            <span className="text-sm text-gray-600 truncate">
              {selectedFile
                ? selectedFile.name
                : "Pilih gambar"}
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setSelectedFile(
                  e.target.files ? e.target.files[0] : null
                )
              }
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`mt-4 w-full h-10 rounded-xl text-white text-sm font-medium transition ${
              uploading || !selectedFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90%] max-h-[90%]"
          >
            <img
              src={previewImage}
              alt="preview"
              className="max-w-full max-h-[80vh] rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}