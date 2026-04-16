import { useState, useRef, useEffect } from "react";
import { downloadTemplate } from "../../services/productImportService";
import { FileDown } from "lucide-react";
import { useGlobalImport } from "../../components/admin/NotificationUpdateUpload";
import { getCategories } from "../../services/adminCategoryService";

export default function ProductUploadPage() {
  const { startUpload, isUploading } = useGlobalImport();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch kategori untuk mapping pesan error dari backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Gagal load kategori", err);
      }
    };
    fetchCategories();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Pilih file dulu");

    // Jalankan upload via global context
    await startUpload(file, categories);

    // Reset local file state agar UI bersih
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (isUploading) return; // Prevent drop saat lagi proses upload
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".xlsx")) {
      setFile(droppedFile);
    } else {
      alert("File harus format .xlsx");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-10">
      {/* Note: Error Modal dan Success Notification sekarang dirender 
          oleh GlobalImportProvider di level layout 
      */}

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Massal Produk</h1>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-[1fr_340px] gap-10">
        {/* ================= LEFT UPLOAD ================= */}
        <div className="space-y-6">
          {/* DOWNLOAD TEMPLATE */}
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-green-700 hover:text-green-900"
          >
            <FileDown size={18} />
            <span className="font-medium">Download Template</span>
          </button>

          {/* ================= DROPZONE ================= */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => !isUploading && setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl
              flex flex-col items-center justify-center
              p-32 text-center transition
              ${
                dragging
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 bg-white"
              }
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <p className="text-xl font-medium text-gray-600">
              Drag & Drop File Excel
            </p>
            <p className="text-gray-400 my-2">atau</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              disabled={isUploading}
            >
              Browse Files
            </button>

            {file && (
              <p className="mt-4 text-sm text-gray-700 font-semibold">
                {file.name}
              </p>
            )}

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
                } else if (f) {
                  alert("File harus format .xlsx");
                }
              }}
            />
          </div>

          {/* ================= STATUS IN PAGE (Mirroring Global State) ================= */}
          {(file || isUploading) && (
            <div className="p-5 border rounded-xl bg-white shadow-sm transition-all">
              <div className="text-sm">
                <span className="font-medium text-gray-700">
                  {isUploading
                    ? "Sedang memproses upload di server... (boleh pindah halaman)"
                    : file?.name}
                </span>
              </div>
            </div>
          )}

          {/* ================= START BUTTON ================= */}
          {file && !isUploading && (
            <button
              onClick={handleUpload}
              className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow-sm transition-all"
            >
              Upload Produk
            </button>
          )}
        </div>

        {/* ================= HINT PANEL ================= */}
        <div className="sticky top-10 h-fit">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-6">
              Panduan Upload Produk
            </h2>
            <div className="space-y-5">
              {[
                "Download template Excel terlebih dahulu.",
                "Isi data produk sesuai format pada template.",
                "Upload kembali file Excel.",
                "Sistem akan memproses upload produk di background.",
              ].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-6 font-semibold text-green-700">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}