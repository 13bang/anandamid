import { useState, useRef } from "react";
import { downloadTemplate, uploadMassProduct } from "../../services/productImportService";
import { FileDown } from "lucide-react";

export default function ProductUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState<{ message: string; errors?: string[] } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Pilih file dulu");

    let interval: any;

    try {
      setLoading(true);
      setProgress(0);

      // fake progress animation
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 200);

      await uploadMassProduct(file);

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setShowSuccess(true);
      }, 300);

      setTimeout(() => {
        setShowSuccess(false);
        setFile(null);
        setProgress(0);
      }, 1300);
    } catch (err: any) {
      clearInterval(interval);
      setProgress(0);

      const message = err.response?.data?.message || "Terjadi kesalahan";
      const errors = err.response?.data?.errors;

      setErrorModal({ message, errors });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  return (
    <div className="flex items-center justify-center h-full p-8 bg-green-200">
      <div className="max-w-6xl px-16 mx-auto bg-white shadow-xl py-14 rounded-3xl">
        <h1 className="mb-6 text-2xl font-bold">Upload Massal Product</h1>

        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 mb-6 text-green-700 transition hover:text-green-900"
        >
          <FileDown size={18} />
          <span className="font-medium">Download Template</span>
        </button>

        <div className="grid grid-cols-2 gap-8">
          {/* LEFT SIDE - DROPZONE */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed flex flex-col items-center justify-center p-10 transition
            ${dragging ? "border-green-600 bg-green-50" : "border-gray-300"}`}
          >
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Drag & drop file Excel di sini</p>
              <p className="my-2">atau</p>
              <button
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 text-white transition bg-green-600 hover:bg-green-700"
              >
                Browse Files
              </button>
              {file && <p className="mt-4 text-sm text-gray-700">{file.name}</p>}
            </div>

            <input
              type="file"
              accept=".xlsx"
              ref={inputRef}
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* RIGHT SIDE - UPLOAD STATUS */}
          <div className="space-y-4">
            {file && (
              <div className="p-4 border shadow-sm rounded-xl">
                <div className="flex justify-between mb-2 text-sm">
                  <span>{file.name}</span>
                  {showSuccess ? (
                    <span className="font-medium text-green-600">Completed</span>
                  ) : loading ? (
                    <span className="font-medium text-blue-600">Uploading...</span>
                  ) : null}
                </div>

                {loading && (
                  <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div
                      className="h-2 transition-all duration-300 bg-green-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {showSuccess && (
                  <div className="w-full h-2 bg-green-200 rounded-full">
                    <div className="w-full h-2 bg-green-600" />
                  </div>
                )}
              </div>
            )}

            {file && !loading && !showSuccess && (
              <button
                onClick={handleUpload}
                className="w-full py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ERROR MODAL */}
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-xl p-6 bg-white shadow-2xl rounded-2xl">
            {/* Close Button */}
            <button
              onClick={() => setErrorModal(null)}
              className="absolute text-gray-400 top-4 right-4 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="mb-4 text-xl font-semibold text-red-600">{errorModal.message}</h2>

            {errorModal.errors && (
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {errorModal.errors.map((err, index) => (
                  <div
                    key={index}
                    className="p-2 text-sm bg-red-50 text-red-700 rounded-lg border border-red-200"
                  >
                    {err}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setErrorModal(null)}
              className="w-full py-2 mt-6 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}