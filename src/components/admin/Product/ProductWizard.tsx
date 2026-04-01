import { useState, useEffect } from "react";
import { getOriginalUrl } from "../../imageHelper";
import { deleteProductImage } from "../../../services/adminProductImageService";

interface ProductWizardProps {
  mode: "create" | "edit";
  categories: any[];
  initialData?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ProductWizard({
  mode,
  categories,
  initialData,
  onClose,
  onSubmit,
}: ProductWizardProps) {

  const [step, setStep] = useState(1);

    const getInitialForm = () => ({
        category_id: initialData?.category?.id || "",
        name: initialData?.name || "",
        description: initialData?.description || "",

        sku_seller: initialData?.sku_seller || "",
        stock: initialData?.stock ?? 0,
        warranty: initialData?.warranty || "",

        price_normal: initialData?.price_normal || 0,
        price_discount: initialData?.price_discount || 0,

        socket_type: initialData?.socket_type || "",
        ram_type: initialData?.ram_type || "",

        download_url: initialData?.download_url || "",
        is_active: initialData?.is_active ?? true,
        is_popular: initialData?.is_popular ?? false,

        images:
            initialData?.images?.map((img: any) => ({
            id: img.id,
            image_url: img.image_url,
            file: null,
            })) || [],
    });

    const [form, setForm] = useState(getInitialForm());

    const selectedCategory = categories.find(
        (c) => c.id === form.category_id
    );

    const isProcessor = selectedCategory?.name?.toLowerCase().includes("processor");
    const isMotherboard = selectedCategory?.name?.toLowerCase().includes("motherboard");
    const isRam = selectedCategory?.name?.toLowerCase().includes("ram");

    const isPCComponent = isProcessor || isMotherboard || isRam;
        
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setForm(getInitialForm());
        setStep(1);
    }, [initialData, mode]);

    const finalPrice = Math.max(
        0,
        form.price_normal - form.price_discount
    );

    const isStep1Valid =
        form.category_id &&
        form.name.trim() !== "" &&
        form.stock >= 0;

    const isStep2Valid =
        form.price_normal > 0;

    const nextStep = () => {
        if (step === 1 && !isStep1Valid) return;
        if (step === 2 && !isStep2Valid) return;
        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
    };

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({
        ...prev,
        [field]: value,
        }));
    };

    useEffect(() => {
        console.log("IMAGES FIELD:", initialData?.images);
        console.log("FIRST IMAGE:", initialData?.images?.[0]);
        console.log("FIRST IMAGE URL:", initialData?.images?.[0]?.image_url);
        }, [initialData]);


    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl">

        <div className="mb-6 text-sm font-semibold">
          {mode === "create" ? "Tambah Product" : "Ubah Product"}
        </div>

        <div className="flex flex-col max-h-[80vh]">

        {/* STEP INDICATOR */}
        <div className="flex justify-between mb-6 text-sm font-medium">
            {[
                { id: 1, label: "Informasi Dasar" },
                { id: 2, label: "Harga" },
                { id: 3, label: "Media & Status" },
            ].map((item) => (
                <div
                key={item.id}
                className={`flex items-center gap-2 ${
                    step === item.id ? "text-blue-600" : "text-gray-400"
                }`}
                >
                <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                    step === item.id
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                >
                    {`0${item.id}`}
                </div>
                <span>{item.label}</span>
                </div>
            ))}
        </div>

        <div className="flex-1 pr-2 overflow-y-auto">

        {/* STEP 1 */}
        {step === 1 && (
        <div className="space-y-6">

        {/* Section Title */}
        <div className="text-lg font-semibold">
            Informasi Dasar Produk
        </div>

        {/* Kategori */}
        <div>
            <label className="block mb-1 text-sm font-medium">
            Kategori
            </label>
            <select
            value={form.category_id}
            onChange={(e) =>
                handleChange("category_id", e.target.value)
            }
            className="w-full px-3 py-2 border rounded-lg"
            >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                {cat.name}
                </option>
            ))}
            </select>
        </div>

        {/* Nama Produk */}
        <div>
            <label className="block mb-1 text-sm font-medium">
            Nama Produk
            </label>
            <input
            type="text"
            value={form.name}
            onChange={(e) =>
                handleChange("name", e.target.value)
            }
            className="w-full px-3 py-2 border rounded-lg"
            />
        </div>

        {/* Deskripsi */}
        <div>
            <label className="block mb-1 text-sm font-medium">
            Deskripsi Produk
            </label>
            <textarea
            value={form.description}
            onChange={(e) =>
                handleChange("description", e.target.value)
            }
            className="w-full h-24 px-3 py-2 border rounded-lg"
            />
        </div>

        {/* ====================== */}
        {/* PC SPEC SECTION */}
        {/* ====================== */}
        {isPCComponent && (
        <div className="pt-4 border-t">
            <div className="mb-4 font-semibold text-md">
            Spesifikasi PC Builder
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* SOCKET TYPE */}
            {(isProcessor || isMotherboard) && (
                <div>
                <label className="block mb-1 text-sm font-medium">
                    Socket Type
                </label>
                <input
                    type="text"
                    placeholder="Contoh: AM4, LGA1700"
                    value={form.socket_type}
                    onChange={(e) =>
                    handleChange("socket_type", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                />
                </div>
            )}

            {/* RAM TYPE */}
            {(isMotherboard || isRam) && (
                <div>
                <label className="block mb-1 text-sm font-medium">
                    RAM Type
                </label>
                <input
                    type="text"
                    placeholder="Contoh: DDR4, DDR5"
                    value={form.ram_type}
                    onChange={(e) =>
                    handleChange("ram_type", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                />
                </div>
            )}

            </div>
        </div>
        )}

        {/* Inventory Section */}
        <div className="pt-4 border-t">
            <div className="mb-4 font-semibold text-md">
            Informasi Inventory
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* SKU Seller */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                SKU Seller
                </label>
                <input
                type="text"
                value={form.sku_seller}
                onChange={(e) => handleChange("sku_seller", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                />
            </div>

            {/* Warranty */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                Warranty
                </label>
                <input
                type="text"
                placeholder="Contoh: 1 Tahun"
                value={form.warranty}
                onChange={(e) => handleChange("warranty", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                />
            </div>

            </div>
        </div>

        </div>
        )}
        
        {/* STEP 2 */}
        {step === 2 && (
        <div className="space-y-4">

            {/* Row Harga + Stock */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Harga Normal */}
            <div>
                <label className="block mb-1 text-xs font-medium">
                Harga Normal
                </label>
                <div className="flex overflow-hidden border rounded-lg">
                <div className="flex items-center px-3 text-xs bg-gray-100">
                    Rp
                </div>
                <input
                    type="number"
                    placeholder="Masukkan harga normal"
                    value={form.price_normal || ""}
                    onChange={(e) =>
                    handleChange(
                        "price_normal",
                        e.target.value === "" ? 0 : Number(e.target.value)
                    )
                    }
                    className="w-full px-3 py-1.5 text-sm outline-none"
                />
                </div>
            </div>

            {/* Harga Diskon */}
            <div>
                <label className="block mb-1 text-xs font-medium">
                Harga Diskon
                </label>
                <div className="flex overflow-hidden border rounded-lg">
                <div className="flex items-center px-3 text-xs bg-gray-100">
                    Rp
                </div>
                <input
                    type="number"
                    placeholder="Masukkan harga diskon"
                    value={form.price_discount || ""}
                    onChange={(e) =>
                    handleChange(
                        "price_discount",
                        e.target.value === "" ? 0 : Number(e.target.value)
                    )
                    }
                    className="w-full px-3 py-1.5 text-sm outline-none"
                />
                </div>
            </div>

            {/* Stock (lebih kecil) */}
            <div>
                <label className="block mb-1 text-xs font-medium">
                Stock <span className="text-red-500">*</span>
                </label>
                <input
                type="number"
                min="0"
                placeholder="0"
                value={form.stock || ""}
                onChange={(e) =>
                    handleChange(
                    "stock",
                    e.target.value === "" ? 0 : Number(e.target.value)
                    )
                }
                className="w-full px-3 py-1.5 text-sm border rounded-lg outline-none"
                />
            </div>

            </div>

            {/* Final Price Block */}
            <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
            <div className="text-xs text-gray-600">
                Harga Final
            </div>
            <div className="text-lg font-semibold text-blue-700">
                Rp {finalPrice.toLocaleString()}
            </div>
            </div>

        </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
        <div className="space-y-4">

            {/* Section Title */}
            <div className="text-base font-semibold">
            Media & Status Produk
            </div>

            {/* Gambar Produk */}
            <div>
                <label className="block mb-2 text-xs font-medium">
                Gambar Produk
                </label>

                {form.images.length > 0 ? (
                <div className="flex flex-col items-center gap-3">

                    {/* PREVIEW */}
                    <img
                    src={
                        form.images[currentImageIndex]?.file
                        ? URL.createObjectURL(form.images[currentImageIndex].file!)
                        : form.images[currentImageIndex]?.image_url
                        ? getOriginalUrl(form.images[currentImageIndex].image_url!)
                        : "https://via.placeholder.com/150"
                    }
                    className="object-cover w-40 h-40 border rounded-lg"
                    />

                    {/* NAVIGATION */}
                    <div className="flex items-center gap-3 text-sm">
                    <button
                        type="button"
                        onClick={() =>
                        setCurrentImageIndex((prev) =>
                            prev === 0 ? form.images.length - 1 : prev - 1
                        )
                        }
                        className="px-2 py-1 border rounded"
                    >
                        ←
                    </button>

                    <span>
                        {currentImageIndex + 1} / {form.images.length}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                        setCurrentImageIndex((prev) =>
                            prev === form.images.length - 1 ? 0 : prev + 1
                        )
                        }
                        className="px-2 py-1 border rounded"
                    >
                        →
                    </button>
                    </div>

                    {/* LINK LAMA (READONLY) */}
                    {form.images[currentImageIndex]?.image_url && (
                    <div className="w-full text-xs text-gray-500 break-all">
                        {form.images[currentImageIndex].image_url}
                    </div>
                    )}

                    {/* FILE UPLOAD */}
                    <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (!e.target.files?.[0]) return;

                        const updated = [...form.images];
                        updated[currentImageIndex].file = e.target.files[0];

                        handleChange("images", updated);
                    }}
                    className="text-xs"
                    />

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 mt-2">

                    <button
                        type="button"
                        onClick={async () => {
                            const image = form.images[currentImageIndex];

                            if (!confirm("Hapus gambar ini?")) return;

                            try {

                                if (image.id) {
                                await deleteProductImage(image.id);
                                }

                                // hapus dari state
                                const updated = [...form.images];
                                updated.splice(currentImageIndex, 1);

                                handleChange("images", updated);

                                setCurrentImageIndex((prev) => {
                                if (updated.length === 0) return 0;
                                if (prev >= updated.length) return updated.length - 1;
                                return prev;
                                });

                            } catch (err) {
                                console.error("Delete image failed:", err);
                                alert("Gagal menghapus gambar");
                            }
                        }}
                        className="px-3 py-1 text-xs text-white bg-red-500 rounded"
                    >
                        Hapus
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                        const updated = [
                            ...form.images,
                            { image_url: "", file: null },
                        ];
                        handleChange("images", updated);
                        setCurrentImageIndex(updated.length - 1);
                        }}
                        className="px-3 py-1 text-xs text-white bg-blue-600 rounded"
                    >
                        + Tambah Gambar
                    </button>

                    </div>
                </div>
                ) : (
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center w-40 h-40 text-xs text-gray-400 border rounded-lg">
                    Tidak ada gambar
                    </div>

                    <button
                    type="button"
                    onClick={() => {
                        handleChange("images", [
                        { image_url: "", file: null },
                        ]);
                        setCurrentImageIndex(0);
                    }}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg"
                    >
                    + Tambah Gambar
                    </button>
                </div>
                )}
            </div>

            {/* Status */}
            <div>
            <label className="block mb-2 text-xs font-medium">
                Status Produk
            </label>

            <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                    handleChange("is_active", e.target.checked)
                    }
                />
                Aktif
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={form.is_popular}
                    onChange={(e) =>
                    handleChange("is_popular", e.target.checked)
                    }
                />
                Popular
                </label>
            </div>
            </div>

        </div>
        )}

        </div>
                
        {/* ================= */}
        {/* STEP NAVIGATION */}
        {/* ================= */}

        <div className="flex items-center justify-between mt-4">

            {/* Kiri */}
            <div>
                {step > 1 && (
                <button
                    onClick={prevStep}
                    className="px-3 py-1.5 border rounded-lg"
                >
                    Sebelumnya
                </button>
                )}
            </div>

            {/* Kanan */}
            <div>
                {step < 3 && (
                <button
                    onClick={nextStep}
                    disabled={
                    (step === 1 && !isStep1Valid) ||
                    (step === 2 && !isStep2Valid)
                    }
                    className={`px-3 py-1.5 rounded-lg text-white ${
                    ((step === 1 && isStep1Valid) ||
                    (step === 2 && isStep2Valid))
                        ? "bg-blue-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Selanjutnya
                </button>
                )}
            </div>

        </div>

        {/* Garis */}
        <div className="mt-6 border-t"></div>

        {/* ===================== */}
        {/* FIXED ACTION BUTTONS */}
        {/* ===================== */}

        <div className="flex justify-end gap-3 pt-6">

        <button
            onClick={onClose}
            className="px-3 py-1.5 border rounded-lg"
        >
            Batal
        </button>

        <button
            onClick={() => onSubmit(form)}
            className="px-3 py-1.5 text-white bg-blue-600 rounded-lg"
        >
            Simpan
        </button>

        </div>

      </div>
    </div>
    </div>
  );
}