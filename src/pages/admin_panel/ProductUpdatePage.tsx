import { useState, useRef, useEffect } from "react";
import { downloadUpdateTemplate, updateMassProduct, listenImportProgress } from "../../services/productImportService";
import { FileDown } from "lucide-react";
import { getCategories } from "../../services/adminCategoryService";

export default function ProductUpdatePage() {
  const [log, setLog] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isErrorRef = useRef(false);

  const [errorModal, setErrorModal] = useState<{
    message: string;
    errors?: string[];
  } | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetState = () => {
    setFile(null);
    setProgress(0);
    setShowSuccess(false);
    setLog("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpdate = async () => {
    if (!file) return alert("Pilih file dulu");

    let eventSource: EventSource | null = null;

    try {
      setLoading(true);
      setProgress(0);
      isErrorRef.current = false;
      setShowSuccess(false);

      eventSource = listenImportProgress((msg) => {
        const data = JSON.parse(msg);
        setLog(data.message);

        if (data.percent !== undefined) {
          setProgress(data.percent);
        }

        if (data.percent === 100) {
          eventSource?.close();

          setTimeout(() => {
            if (!isErrorRef.current) {
              setShowSuccess(true);
              // Opsional: Reset form otomatis setelah 3 detik sukses
              setTimeout(() => {
                resetState();
              }, 3000);
            }
          }, 300);
        }
      });

      await updateMassProduct(file);

    } catch (err: any) {
      eventSource?.close();
      isErrorRef.current = true;

      const message = err.response?.data?.message || "Terjadi kesalahan";
      let rawErrors: string[] = err.response?.data?.errors || [];

      const enhancedErrors = rawErrors.map((errorStr: string) => {
        const foundCategory = categories.find((cat) =>
          errorStr.toLowerCase().includes(cat.name.toLowerCase())
        );
        if (foundCategory) {
          return `${errorStr} (Kode yang benar: ${foundCategory.code})`;
        }
        return errorStr;
      });

      setErrorModal({
        message,
        errors: enhancedErrors,
      });

      setProgress(0);
    } finally {
      eventSource?.close();
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".xlsx")) {
      setFile(droppedFile);
    } else {
      alert("File harus .xlsx");
    }
  };

  return (
    <div className="w-full min-h-screen p-10">
      
      {/* ================= ERROR MODAL (TETAP ADA) ================= */}
      {errorModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl p-8 flex flex-col scale-100 animate-scaleIn">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Update Gagal</h2>
            </div>
            <p className="text-gray-600 mb-4 font-medium">
              {errorModal.message}
            </p>
            <div className="flex-1 overflow-y-auto bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
              {errorModal.errors && errorModal.errors.length > 0 ? (
                <ul className="space-y-2">
                  {errorModal.errors.map((err, i) => (
                    <li key={i} className="text-sm text-red-700 flex gap-2">
                      <span className="font-bold">•</span> {err}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-500 italic">Tidak ada detail error tambahan.</p>
              )}
            </div>
            <button
              onClick={() => {
                setErrorModal(null);
                resetState();
              }}
              className="w-full py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition font-semibold"
            >
              Tutup & Perbaiki File
            </button>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Update Massal Produk</h1>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-[1fr_340px] gap-10">
        
        {/* ================= LEFT UPLOAD ================= */}
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

          {/* DOWNLOAD TEMPLATE */}
          <button
            onClick={() => downloadUpdateTemplate(selectedCategories)}
            className="flex items-center gap-2 text-green-700 hover:text-green-900"
          >
            <FileDown size={18} />
            <span className="font-medium">Download Template</span>
          </button>

          {/* ================= DROPZONE ================= */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl
              flex flex-col items-center justify-center
              p-20 text-center transition
              ${dragging ? "border-green-600 bg-green-50" : "border-gray-300 bg-white"}
            `}
          >
            <p className="text-xl font-medium text-gray-600">Drag & Drop File Excel</p>
            <p className="text-gray-400 my-2">atau</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              Browse Files
            </button>
            {file && <p className="mt-4 text-sm text-gray-700">{file.name}</p>}
            <input
              key={file ? file.name : "empty"}
              type="file"
              accept=".xlsx"
              ref={inputRef}
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.name.endsWith(".xlsx")) {
                  setFile(f);
                } else {
                  alert("File harus .xlsx");
                }
              }}
            />
          </div>

          {/* ================= STATUS & INLINE PROGRESS ================= */}
          {file && (
            <div className="p-5 border rounded-xl bg-white shadow-sm transition-all">
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="font-medium text-gray-700 truncate mr-4">
                  {file.name}
                </span>

                {showSuccess ? (
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    Update Berhasil
                  </span>
                ) : loading ? (
                  <span className="text-green-600 font-semibold animate-pulse">
                    Memproses... {progress}%
                  </span>
                ) : (
                  <span className="text-gray-500 font-medium">Siap diproses</span>
                )}
              </div>

              {/* Progress Bar Muncul Saat Loading */}
              {loading && (
                <div className="mt-2 animate-fadeIn">
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2 text-gray-500 italic">
                    {log || "Menyiapkan data..."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* UPDATE BUTTON */}
          {file && !loading && !showSuccess && (
            <button
              onClick={handleUpdate}
              className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow-sm transition-all"
            >
              Mulai Update Produk
            </button>
          )}

        </div>

        {/* ================= HINT PANEL ================= */}
        <div className="sticky top-10 h-fit">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-6">Panduan Update Produk</h2>
            <div className="space-y-5">
              {[
                "Pilih kategori produk yang ingin diupdate.",
                "Download template Excel.",
                "Edit data produk pada file Excel.",
                "Upload kembali file Excel.",
                "Sistem akan memproses update produk."
              ].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-6 font-semibold text-green-700">{i + 1}.</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}