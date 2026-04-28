import { useState, useEffect, useRef } from "react";
import { getOriginalUrl } from "../../imageHelper";
import { deleteProductImage } from "../../../services/adminProductImageService";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Pastikan lucide-react terinstall

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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      initialData?.images
        ?.sort((a: any, b: any) => a.sort_order - b.sort_order) // Pastikan terurut saat awal load
        .map((img: any) => ({
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

  // --- STATE UNTUK DRAG AND DROP GAMBAR ---
  const [draggedImgIndex, setDraggedImgIndex] = useState<number | null>(null);

  useEffect(() => {
    setForm(getInitialForm());
    setStep(1);
    setErrors({});
  }, [initialData, mode]);

  const finalPrice = Math.max(
    0,
    form.price_normal - form.price_discount
  );

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!form.category_id) {
        newErrors.category_id = "Kategori wajib dipilih";
        isValid = false;
      }
      if (!form.name.trim()) {
        newErrors.name = "Nama produk wajib diisi";
        isValid = false;
      }
      if (form.stock === null || form.stock === undefined || form.stock < 0 || String(form.stock) === "") {
        newErrors.stock = "Stock wajib diisi dengan benar";
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!form.price_normal || form.price_normal <= 0) {
        newErrors.price_normal = "Harga normal wajib diisi";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSimpan = () => {
    const newErrors: Record<string, string> = {};
    let firstErrorStep = null;

    if (!form.category_id) { newErrors.category_id = "Kategori wajib dipilih"; firstErrorStep = firstErrorStep || 1; }
    if (!form.name.trim()) { newErrors.name = "Nama produk wajib diisi"; firstErrorStep = firstErrorStep || 1; }
    if (form.stock === null || form.stock === undefined || form.stock < 0 || String(form.stock) === "") { newErrors.stock = "Stock wajib diisi dengan benar"; firstErrorStep = firstErrorStep || 1; }
    if (!form.price_normal || form.price_normal <= 0) { newErrors.price_normal = "Harga normal wajib diisi"; firstErrorStep = firstErrorStep || 2; }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (firstErrorStep) setStep(firstErrorStep);
      return;
    }

    // MAPPING SORT ORDER SEBELUM SUBMIT
    const finalPayload = {
      ...form,
      images: form.images.map((img: any, index: number) => ({
        ...img,
        sort_order: index, // Set otomatis berdasarkan urutan array
      })),
    };

    onSubmit(finalPayload);
  };

  const formatRupiah = (value: number | string) => {
    if (!value) return "";
    return Number(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const newFile = e.target.files[0];
    const updated = [...form.images, { image_url: "", file: newFile }];
    
    handleChange("images", updated);
    setCurrentImageIndex(updated.length - 1); 
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- FUNGSI GESER MANUAL (TOMBOL) ---
  const moveImage = (direction: "left" | "right") => {
    if (form.images.length <= 1) return;
    
    const newIndex = direction === "left" ? currentImageIndex - 1 : currentImageIndex + 1;
    if (newIndex < 0 || newIndex >= form.images.length) return;

    const updatedImages = [...form.images];
    // Tukar posisi
    const temp = updatedImages[currentImageIndex];
    updatedImages[currentImageIndex] = updatedImages[newIndex];
    updatedImages[newIndex] = temp;

    handleChange("images", updatedImages);
    setCurrentImageIndex(newIndex);
  };

  // --- FUNGSI DRAG AND DROP ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImgIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedImgIndex === null || draggedImgIndex === targetIndex) return;

    const updatedImages = [...form.images];
    // Hapus item dari posisi lama
    const [draggedItem] = updatedImages.splice(draggedImgIndex, 1);
    // Masukkan ke posisi baru
    updatedImages.splice(targetIndex, 0, draggedItem);

    handleChange("images", updatedImages);
    setCurrentImageIndex(targetIndex); // Fokus ke gambar yang baru dipindah
    setDraggedImgIndex(null);
  };

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

          <div className="text-lg font-semibold">
            Informasi Dasar Produk
          </div>

          {/* Kategori */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="mt-1 text-xs font-medium text-red-500">{errors.category_id}</p>}
          </div>

          {/* Nama Produk */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Deskripsi Produk
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* PC SPEC SECTION */}
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
                  onChange={(e) => handleChange("socket_type", e.target.value)}
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
                  onChange={(e) => handleChange("ram_type", e.target.value)}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pb-2">

              {/* SKU Seller */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  SKU Seller
                </label>
                <input
                  type="text"
                  value={form.sku_seller}
                  onChange={(e) => handleChange("sku_seller", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                Harga Normal <span className="text-red-500">*</span>
              </label>
              <div className={`flex overflow-hidden border rounded-lg ${errors.price_normal ? 'border-red-500' : 'border-gray-300'}`}>
                <div className="flex items-center px-3 text-xs bg-gray-100">
                  Rp
                </div>
                <input
                  type="text"
                  value={formatRupiah(form.price_normal || "")}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("price_normal", parseRupiah(val));
                  }}
                  className="w-full px-3 py-1.5 text-sm outline-none"
                />
              </div>
              {errors.price_normal && <p className="mt-1 text-xs font-medium text-red-500">{errors.price_normal}</p>}
            </div>

            {/* Harga Diskon */}
            <div>
              <label className="block mb-1 text-xs font-medium">
                Harga Diskon
              </label>
              <div className="flex overflow-hidden border border-gray-300 rounded-lg">
                <div className="flex items-center px-3 text-xs bg-gray-100">
                  Rp
                </div>
                <input
                  type="text"
                  value={formatRupiah(form.price_discount || "")}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("price_discount", parseRupiah(val));
                  }}
                  className="w-full px-3 py-1.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block mb-1 text-xs font-medium">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.stock !== null ? form.stock : ""}
                onChange={(e) =>
                  handleChange(
                    "stock",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className={`w-full px-3 py-1.5 text-sm border rounded-lg outline-none ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stock && <p className="mt-1 text-xs font-medium text-red-500">{errors.stock}</p>}
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
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-2 text-lg font-semibold border-b border-gray-100">
            Media & Status Produk
          </div>

          {/* ===================== */}
          {/* BAGIAN GAMBAR (MEDIA) */}
          {/* ===================== */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Galeri Produk
              </label>
              {form.images.length > 1 && (
                <span className="text-xs text-gray-400 italic">
                  *Drag thumbnail untuk mengubah urutan
                </span>
              )}
            </div>

            {/* Input File Tersembunyi */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {form.images.length > 0 ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                {/* PREVIEW GAMBAR UTAMA */}
                <div className="relative flex justify-center mb-4 bg-white border border-gray-200 rounded-lg shadow-sm aspect-video group overflow-hidden">
                  
                  {/* Tombol Geser Kiri */}
                  {currentImageIndex > 0 && (
                    <button 
                      type="button"
                      onClick={() => moveImage("left")}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}

                  <img
                    src={
                      form.images[currentImageIndex]?.file
                        ? URL.createObjectURL(form.images[currentImageIndex].file!)
                        : form.images[currentImageIndex]?.image_url
                        ? getOriginalUrl(form.images[currentImageIndex].image_url!)
                        : "https://via.placeholder.com/300"
                    }
                    className="object-contain w-full h-full rounded-lg"
                    alt="Preview Produk"
                  />

                  {/* Tombol Geser Kanan */}
                  {currentImageIndex < form.images.length - 1 && (
                    <button 
                      type="button"
                      onClick={() => moveImage("right")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  )}
                  
                  {/* Tombol Hapus Gambar Aktif */}
                  <button
                    type="button"
                    onClick={async () => {
                      const image = form.images[currentImageIndex];
                      if (!confirm("Hapus gambar ini?")) return;
                      try {
                        if (image.id) {
                          await deleteProductImage(image.id);
                        }
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
                    className="absolute top-2 right-2 p-2 text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 transition"
                    title="Hapus Gambar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Indikator Urutan */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded font-medium tracking-widest">
                    {currentImageIndex + 1} / {form.images.length}
                  </div>
                </div>

                {/* THUMBNAIL NAVIGATOR & TOMBOL TAMBAH (WITH DRAG & DROP) */}
                <div className="flex items-center gap-3 overflow-x-auto py-2 px-4">
                  {form.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      draggable // Menyalakan fungsi drag HTML5
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg transition-all cursor-grab active:cursor-grabbing ${
                        currentImageIndex === idx
                          ? "ring-2 ring-blue-500 ring-offset-2 scale-105"
                          : "opacity-70 hover:opacity-100"
                      } ${draggedImgIndex === idx ? "opacity-30 border-2 border-dashed border-gray-400" : ""}`}
                    >
                      <div className="w-full h-full overflow-hidden rounded-lg pointer-events-none">
                        <img
                          src={
                            img.file
                              ? URL.createObjectURL(img.file)
                              : img.image_url
                              ? getOriginalUrl(img.image_url)
                              : "https://via.placeholder.com/150"
                          }
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </button>
                  ))}

                  {/* Tombol Tambah Gambar */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center flex-shrink-0 w-16 h-16 transition-colors bg-white border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 group"
                  >
                    <span className="text-2xl text-gray-400 group-hover:text-blue-500">+</span>
                  </button>
                </div>
              </div>
            ) : (
              // Tampilan saat kosong (Belum ada gambar)
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 transition-colors bg-gray-50 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 group"
              >
                <div className="p-3 mb-3 bg-white rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Klik untuk unggah gambar
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>
            )}
          </div>

          {/* ===================== */}
          {/* BAGIAN STATUS (TOGGLE) */}
          {/* ===================== */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block mb-4 text-sm font-medium text-gray-700">
              Pengaturan Status
            </label>

            <div className="flex flex-col gap-4">
              
              {/* Toggle Aktif */}
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-800">Status Aktif</div>
                  <div className="text-xs text-gray-500">Produk akan ditampilkan ke pembeli</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("is_active", !form.is_active)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    form.is_active ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      form.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle Popular */}
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-800">Produk Populer</div>
                  <div className="text-xs text-gray-500">Tampilkan produk ini di halaman utama (Trending)</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("is_popular", !form.is_popular)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    form.is_popular ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      form.is_popular ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

        </div>
        )}

        </div>
                
        {/* ================= */}
        {/* STEP NAVIGATION */}
        {/* ================= */}

        <div className="flex items-center justify-between mt-4">
          <div>
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Sebelumnya
              </button>
            )}
          </div>

          <div>
            {step < 3 && (
              <button
                onClick={nextStep}
                className="px-3 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Selanjutnya
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 border-t"></div>

        {/* ===================== */}
        {/* FIXED ACTION BUTTONS */}
        {/* ===================== */}

        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            onClick={handleSimpan}
            className="px-4 py-1.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Simpan
          </button>
        </div>

      </div>
    </div>
    </div>
  );
}