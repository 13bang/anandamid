import { useState, useRef, useEffect } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { getCategories } from "../../services/adminCategoryService";
import api from "../../services/api";
import { useGlobalImport } from "../../components/admin/NotificationUpdateUpload";

export default function ProductUpdatePage() {
  const { startUpdate, isUpdating } = useGlobalImport();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [templateStatus, setTemplateStatus] = useState<{
    available: boolean;
    expiresAt: number | null;
  }>({ available: false, expiresAt: null });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [onlyWithSku, setOnlyWithSku] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchTemplateStatus = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.append("category_code", selectedCategories.join(","));
      }
      params.append("only_with_sku", String(onlyWithSku));

      const res = await api.get(
        `/product-import/template-update/status?${params.toString()}`
      );

      const data = res.data;
      setTemplateStatus({
        available: data.available,
        expiresAt: data.expires_at,
      });

      if (data.expires_at) {
        setTimeLeft(data.expires_at - Date.now());
      }
    } catch (err) {
      console.error("Gagal ambil status template", err);
    }
  };

  const handleGenerateTemplate = async () => {
    try {
      setIsDownloading(true);
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.append("category_code", selectedCategories.join(","));
      }
      params.append("only_with_sku", String(onlyWithSku));

      await api.get(
        `/product-import/template-update?${params.toString()}&force=true`
      );
      await fetchTemplateStatus(); 
    } catch (error) {
      alert("Gagal generate template");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) {
        params.append("category_code", selectedCategories.join(","));
      }
      params.append("only_with_sku", String(onlyWithSku));

      const res = await api.get(
        `/product-import/template-update/download?${params.toString()}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-update-template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal download template");
    }
  };

  useEffect(() => {
    fetchTemplateStatus();
  }, [selectedCategories, onlyWithSku]);

  useEffect(() => {
    if (!templateStatus.expiresAt) return;
    const interval = setInterval(() => {
      const diff = templateStatus.expiresAt! - Date.now();
      if (diff <= 0) {
        setTemplateStatus({ available: false, expiresAt: null });
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [templateStatus.expiresAt]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdate = async () => {
    if (!file) return alert("Pilih file dulu");
    
    // Jalankan update via global context
    await startUpdate(file, categories);
    
    // Reset local file state agar UI bersih
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (isUpdating) return; // Prevent drop saat lagi proses
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".xlsx")) {
      setFile(droppedFile);
    } else {
      alert("File harus .xlsx");
    }
  };

  return (
    <div className="w-full min-h-screen p-10">
      {/* Note: Error Modal dan Success Notification sekarang dirender 
          oleh GlobalImportProvider di level layout 
      */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Update Massal Produk</h1>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-10">
        <div className="space-y-6">
          
          {/* CATEGORY DROPDOWN */}
          <div ref={dropdownRef} className="relative max-w-md">
            <p className="mb-2 font-medium">Pilih Kategori (Opsional)</p>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex justify-between items-center border px-4 py-2 rounded-lg bg-white"
            >
              <span className="text-sm text-gray-700">
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} kategori dipilih`
                  : "Pilih kategori"}
              </span>
              <span className="text-gray-400">▾</span>
            </button>
            {dropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories(prev => [...prev, cat.code]);
                        } else {
                          setSelectedCategories(prev => prev.filter(c => c !== cat.code));
                        }
                      }}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* OPTIONS */}
          <div className="max-w-md p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <p className="mb-4 text-sm font-semibold text-gray-800">
              Opsi Download Template
            </p>

            <div className="space-y-3">

              {/* OPTION 1 */}
              <label className="flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all
                hover:border-green-500 hover:bg-green-50
                has-[:checked]:border-green-600 has-[:checked]:bg-green-50"
              >
                <input
                  type="radio"
                  name="skuOption"
                  checked={onlyWithSku === true}
                  onChange={() => setOnlyWithSku(true)}
                  className="w-4 h-4 accent-green-600 cursor-pointer"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Hanya Produk dengan SKU Seller
                  </p>
                  <p className="text-xs text-gray-500">
                    Untuk update produk yang memiliki SKU
                  </p>
                </div>
              </label>

              {/* OPTION 2 */}
              <label className="flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all
                hover:border-green-500 hover:bg-green-50
                has-[:checked]:border-green-600 has-[:checked]:bg-green-50"
              >
                <input
                  type="radio"
                  name="skuOption"
                  checked={onlyWithSku === false}
                  onChange={() => setOnlyWithSku(false)}
                  className="w-4 h-4 accent-green-600 cursor-pointer"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Semua Produk
                  </p>
                  <p className="text-xs text-gray-500">
                    Download seluruh data produk tanpa filter SKU
                  </p>
                </div>
              </label>

            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerateTemplate}
            disabled={isDownloading}
            className={`flex items-center gap-2 transition-all px-4 py-2 rounded-lg border ${
              isDownloading 
                ? "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed" 
                : "text-green-700 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
            }`}
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
            <span className="font-medium">{isDownloading ? "Menyiapkan File..." : "Generate Template"}</span>
          </button>

          {/* DROPZONE */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => !isUpdating && setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-20 text-center transition
              ${dragging ? "border-green-600 bg-green-50" : "border-gray-300 bg-white"}
              ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <p className="text-xl font-medium text-gray-600">Drag & Drop File Excel</p>
            <p className="text-gray-400 my-2">atau</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              disabled={isUpdating}
            >
              Browse Files
            </button>
            {file && <p className="mt-4 text-sm text-gray-700 font-semibold">{file.name}</p>}
            <input
              type="file"
              accept=".xlsx"
              ref={inputRef}
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.name.endsWith(".xlsx")) setFile(f);
              }}
            />
          </div>

          {/* STATUS IN PAGE (Mirroring Global State) */}
          {(file || isUpdating) && (
            <div className="p-5 border rounded-xl bg-white shadow-sm">
              <div className="text-sm">
                <span className="font-medium text-gray-700">
                  {isUpdating
                    ? "Sedang memproses update di server..."
                    : file?.name}
                </span>
              </div>
            </div>
          )}

          {/* START BUTTON */}
          {file && !isUpdating && (
            <button
              onClick={handleUpdate}
              className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow-md transition-all"
            >
              Mulai Update Produk
            </button>
          )}

        </div>

        {/* HINT PANEL */}
        <div className="sticky top-10 h-fit">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-6">Panduan Update Produk</h2>
            <div className="space-y-5">
              {[
                "Pilih kategori produk yang ingin diupdate.",
                "Pilih Opsi Download All atau SKU Seller Only.",
                "Download template Excel.",
                "Edit data produk pada file Excel.",
                "Upload kembali file Excel.",
                "Sistem akan memproses update produk di background."
              ].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-6 font-semibold text-green-700">{i + 1}.</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Template Siap Download</p>
            {templateStatus.available ? (
              <>
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FileDown size={16} /> Download Template
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">Expired dalam {formatTime(timeLeft)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center">Belum ada template. Klik "Generate Template".</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}