import { useState, useRef } from "react";
import { downloadTemplate, uploadMassProduct, listenImportProgress } from "../../services/productImportService";
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

    try {
        setLoading(true);
        setProgress(0);
        setShowSuccess(false);

        const eventSource = listenImportProgress((msg) => {
        const data = JSON.parse(msg);

        console.log("SSE:", data);

        if (data.percent !== undefined) {
            setProgress(data.percent);
        }

        if (data.percent === 100) {
            eventSource.close();

            setTimeout(() => {
            setShowSuccess(true);
            }, 300);
        }
        });

        const res = await uploadMassProduct(file);

        setSuccessCount(res.data.total_created || 0);
        setErrorCount(res.data.total_error || 0);

    } catch (err: any) {
        const message = err.response?.data?.message || "Terjadi kesalahan";
        const errors = err.response?.data?.errors;

        setErrorModal({
        message,
        errors,
        });

        setProgress(0);

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

    const resetState = () => {
        setFile(null);
        setProgress(0);
        setShowSuccess(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);

    return (
        <div className="w-full min-h-screen bg-gray-50 p-10">

            {/* ================= LOADING MODAL ================= */}

            {loading && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">

                    <div className="w-[420px] p-8 bg-white rounded-2xl shadow-xl text-center">

                        <div className="flex justify-center mb-4">
                            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                        </div>

                        <h2 className="text-lg font-semibold mb-2">
                            Uploading Products
                        </h2>

                        <p className="text-sm text-gray-500 mb-4">
                            Mohon tunggu, sistem sedang memproses file
                        </p>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-2 bg-green-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className="text-sm mt-2 text-gray-600">
                            {progress}%
                        </p>

                    </div>

                </div>
            )}

            {/* ================= HEADER ================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Upload Massal Produk
                </h1>

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

                        <span className="font-medium">
                            Download Template
                        </span>

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
                            p-32 text-center transition
                            ${dragging
                                ? "border-green-600 bg-green-50"
                                : "border-gray-300 bg-white"
                            }
                        `}
                    >

                        <p className="text-xl font-medium text-gray-600">
                            Drag & Drop File Excel
                        </p>

                        <p className="text-gray-400 my-2">
                            atau
                        </p>

                        <button
                            onClick={() => inputRef.current?.click()}
                            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Browse Files
                        </button>

                        {file && (
                            <p className="mt-4 text-sm text-gray-700">
                                {file.name}
                            </p>
                        )}

                        <input
                            key={file ? file.name : "empty"}
                            type="file"
                            accept=".xlsx"
                            ref={inputRef}
                            hidden
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />

                    </div>

                    {/* ================= STATUS ================= */}

                    {file && (

                        <div className="p-4 border rounded-xl bg-white shadow-sm">

                            <div className="flex justify-between text-sm mb-2">

                                <span>{file.name}</span>

                                {showSuccess ? (
                                    <span className="text-green-600 font-medium">
                                        Completed
                                    </span>
                                ) : loading ? (
                                    <span className="text-blue-600 font-medium">
                                        Uploading...
                                    </span>
                                ) : null}

                            </div>

                            {loading && (

                                <div className="w-full h-2 bg-gray-200 rounded-full">

                                    <div
                                        className="h-2 bg-green-600 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />

                                </div>

                            )}

                        </div>

                    )}

                    {file && !loading && !showSuccess && (

                        <button
                            onClick={handleUpload}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                            "Upload kembali file Excel ke sistem.",
                            "Sistem akan memproses upload produk."
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

            {/* ================= ERROR MODAL ================= */}

            {errorModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="relative w-full max-w-xl p-6 bg-white shadow-2xl rounded-2xl">

                        <button
                            onClick={() => setErrorModal(null)}
                            className="absolute text-gray-400 top-4 right-4 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <h2 className="mb-4 text-xl font-semibold text-red-600">
                            {errorModal.message}
                        </h2>

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

            {showSuccess && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">

                    <div className="w-[420px] bg-white rounded-3xl shadow-2xl p-8 text-center scale-100 animate-scaleIn">

                    {/* ICON */}
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        </div>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-xl font-semibold mb-2">
                        Upload Berhasil 🎉
                    </h2>

                    {/* DESC */}
                    <p className="text-sm text-gray-500 mb-6">
                        {successCount > 0 && `${successCount} produk berhasil ditambahkan.`}
                        {errorCount > 0 && ` ${errorCount} data gagal diproses.`}
                    </p>

                    {/* BUTTON */}
                    <button
                        onClick={resetState}
                        className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                        Selesai
                    </button>

                    </div>
                </div>
            )}

        </div>
    );
}