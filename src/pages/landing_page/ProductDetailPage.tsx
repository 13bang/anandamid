import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, getProductsByCategory, getProducts } from "../../services/productService";
import { FaWhatsapp, FaSearchPlus, FaBan, FaCheckCircle } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, ShoppingCart, X, Check, ShoppingBag, ArrowRight } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/product";
import Breadcrumb from "../../components/Breadcrumb";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import { addToCart } from "../../services/cartService";
import Swal from "sweetalert2";
import AuthModal from "../../components/Navbar/AuthModal";

export default function ProductDetailPage() {
  const [loadingRelated, setLoadingRelated] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "review">("description");

  const [quantity, setQuantity] = useState(1);
  const [selectedVariasi, setSelectedVariasi] = useState<string>("");

  const WHATSAPP_NUMBER = "6281228134747";

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showModal, setShowModal] = useState(false);
  
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setLoadingRelated(true);
    try {
      const data = await getProductById(id!);
      setProduct(data);
      if (data.variasi && data.variasi.length > 0) {
        setSelectedVariasi(data.variasi[0]);
      }
      
      let related = [];
      if (data.category && data.category.name) {
        related = await getProductsByCategory(data.category.name);
      } else {
        const response = await getProducts(); 
        
        const allProducts = Array.isArray(response) ? response : (response.data || []);
        
        related = [...allProducts].sort(() => 0.5 - Math.random());
      }

      if (Array.isArray(related)) {
        const filtered = related.filter((p: Product) => p.id !== data.id).slice(0, 30);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error("Gagal mengambil data produk:", err);
    } finally {
      setLoading(false);
      setLoadingRelated(false);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector(".product-item");
    if (!card) return;
    
    const gap = window.innerWidth >= 1024 ? 24 : 16;
    const cardWidth = card.clientWidth + gap;
    const index = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstCard = container.querySelector(".product-item") as HTMLElement;
    if (!firstCard) return;
    
    const gap = window.innerWidth >= 1024 ? 24 : 16; 
    const cardWidth = firstCard.offsetWidth + gap;
    
    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;

    // CEK LOGIN DULU
    const token = localStorage.getItem("user_token");
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity,
        variasi: selectedVariasi || undefined,
      });
      setShowSuccessModal(true); 
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err?.response?.data?.message || "Gagal menambahkan ke keranjang",
      });
    }
  };

  // ==========================================
  // SKELETON LOADING UI DIMULAI DI SINI
  // ==========================================
  if (loading) {
    return (
      <div className="w-full bg-white animate-fadeIn">
        {/* Breadcrumb Skeleton */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="w-48 h-5 rounded bg-gray-200 shimmer"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-10">
            
            {/* 1. SECTION GAMBAR SKELETON */}
            <div className="lg:col-span-7 order-1">
              <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:items-start">
                <div className="flex lg:flex-col gap-3 overflow-x-hidden w-full lg:w-24 flex-shrink-0 lg:h-[500px]">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg flex-shrink-0 bg-gray-200 shimmer"></div>
                  ))}
                </div>
                <div className="w-full max-w-lg aspect-square rounded-xl mx-auto bg-gray-200 shimmer"></div>
              </div>
            </div>

            {/* 2. SECTION INFO PRODUK SKELETON */}
            <div className="lg:col-span-5 order-2 lg:row-span-2">
              <div className="lg:border lg:border-gray-200 lg:rounded-2xl lg:p-8 lg:shadow-sm bg-white py-2 lg:py-0 space-y-6">
                
                {/* Tags */}
                <div className="flex gap-2 mt-6 lg:mt-0">
                  <div className="w-20 h-6 rounded bg-gray-200 shimmer"></div>
                  <div className="w-24 h-6 rounded bg-gray-200 shimmer"></div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div className="w-full h-8 rounded bg-gray-200 shimmer"></div>
                  <div className="w-3/4 h-8 rounded bg-gray-200 shimmer"></div>
                </div>

                {/* Price */}
                <div className="w-1/2 h-10 rounded bg-gray-200 shimmer mt-4"></div>

                {/* SKU & Stock */}
                <div className="space-y-3 pb-6 border-b border-gray-100">
                  <div className="w-40 h-4 rounded bg-gray-200 shimmer"></div>
                  <div className="w-56 h-4 rounded bg-gray-200 shimmer"></div>
                  <div className="w-48 h-4 rounded bg-gray-200 shimmer"></div>
                </div>

                {/* Variations */}
                <div className="space-y-3">
                  <div className="w-24 h-4 rounded bg-gray-200 shimmer"></div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-20 h-10 rounded-lg bg-gray-200 shimmer"></div>
                    ))}
                  </div>
                </div>

                {/* Qty & Button */}
                <div className="flex gap-3 lg:gap-4 mt-6">
                  <div className="w-28 lg:w-32 h-12 rounded-lg bg-gray-200 shimmer"></div>
                  <div className="flex-1 h-12 rounded-lg bg-gray-200 shimmer"></div>
                </div>

                {/* Extra Info */}
                <div className="space-y-4 border-t border-gray-100 mt-6 pt-6">
                  <div className="w-full h-12 rounded bg-gray-200 shimmer"></div>
                  <div className="w-full h-12 rounded bg-gray-200 shimmer"></div>
                </div>

              </div>
            </div>

            {/* 3. SECTION DESKRIPSI SKELETON */}
            <div className="lg:col-span-7 order-3 lg:pt-8 mt-4 lg:mt-0">
              <div className="flex gap-6 border-b mb-6 pb-4">
                <div className="w-32 h-6 rounded bg-gray-200 shimmer"></div>
                <div className="w-24 h-6 rounded bg-gray-200 shimmer"></div>
              </div>
              <div className="space-y-3">
                <div className="w-full h-4 rounded bg-gray-200 shimmer"></div>
                <div className="w-full h-4 rounded bg-gray-200 shimmer"></div>
                <div className="w-5/6 h-4 rounded bg-gray-200 shimmer"></div>
                <div className="w-3/4 h-4 rounded bg-gray-200 shimmer"></div>
                <div className="w-4/5 h-4 rounded bg-gray-200 shimmer"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
  // ==========================================
  // AKHIR DARI SKELETON LOADING UI
  // ==========================================
  if (!product) return <div className="p-10 text-center font-semibold text-gray-500">Product not found</div>;

  const normalPrice = Number(product.price_normal) || 0;
  const discountPrice = Number(product.price_discount) || 0;
  const finalPrice = discountPrice > 0 ? normalPrice - discountPrice : normalPrice;
  const isOutOfStock = Number(product.stock) === 0;
  const productLink = window.location.href;
  const variasiText = selectedVariasi ? `Variasi: ${selectedVariasi}\n    ` : "";

  const whatsappMessage = `Hai, saya ingin memesan produk berikut:
    Nama Produk: ${product.name}
    ${variasiText}Jumlah: ${quantity}
    Harga Satuan: Rp ${finalPrice.toLocaleString()}
    Link Produk: ${productLink}
    Mohon informasi ketersediaan.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white">
        {/* Supaya di HP kalau breadcrumbnya panjang bisa digeser tanpa ngerusak layout */}
        <div className="max-w-7xl px-4 lg:px-2 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Produk Katalog", path: "/product-katalog" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-10">
          
          {/* ================= 1. SECTION GAMBAR ================= */}
          <div className="lg:col-span-7 order-1">
            <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:items-start">
              {/* THUMBNAILS - Tambah properti snap agar di scroll di HP lebih enak/berhenti per gambar */}
              <div className="
                flex lg:flex-col gap-3 
                overflow-x-auto lg:overflow-y-auto 
                pb-2 lg:pb-0 
                scrollbar-hide 
                w-full lg:w-24 
                flex-shrink-0
                lg:h-[500px]   
                snap-x snap-mandatory
              ">
                {product.images.map((img, index) => (
                  <img
                    key={img.id}
                    src={img.image_url?.startsWith("http") ? img.image_url : `${import.meta.env.VITE_API_BASE}${img.image_url}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 object-cover border-2 rounded-lg cursor-pointer transition-all flex-shrink-0 snap-center ${
                      activeImage === index ? "border-primary" : "border-gray-200 hover:border-primary/50"
                    }`}
                    alt={`Thumbnail ${index + 1}`}
                  />
                ))}
              </div>

              {/* MAIN IMAGE */}
              <div
                className="w-full max-w-lg relative overflow-hidden border border-gray-100 rounded-xl aspect-square mx-auto bg-[#f9f9f9] group lg:cursor-zoom-in"
                onMouseEnter={() => window.innerWidth >= 1024 && setIsZooming(true)}
                onMouseLeave={() => window.innerWidth >= 1024 && setIsZooming(false)}
                onMouseMove={(e) => {
                  if (window.innerWidth < 1024) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  setZoomPosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                  });
                }}
              >
                <img
                  src={product.images[activeImage]?.image_url?.startsWith("http") 
                    ? product.images[activeImage]?.image_url 
                    : `${import.meta.env.VITE_API_BASE}${product.images[activeImage]?.image_url}`}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{
                    transform: isZooming ? "scale(2)" : "scale(1)",
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
                <button onClick={() => setShowModal(true)} className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition hidden lg:block text-primary">
                  <FaSearchPlus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ================= 2. SECTION INFO PRODUK ================= */}
          <div className="lg:col-span-5 order-2 lg:row-span-2">
            <div className="lg:sticky lg:top-36 bg-white py-2 lg:py-0">
              
              {/* BADGES & CATEGORY */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {product.category?.name && (
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {product.category.name}
                  </span>
                )}
                {product.brand?.name && (
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {product.brand.name}
                  </span>
                )}
                {/* Stock Status Badge */}
                {isOutOfStock ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-full border border-red-100">
                    <FaBan size={10} /> Stok Habis
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full border border-green-100">
                    <FaCheckCircle size={10} /> Tersedia
                  </span>
                )}
              </div>

              {/* TITLE & PRICE SECTION */}
              <div className="space-y-3 mb-8">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex flex-col gap-1">
                  {discountPrice > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl lg:text-3xl font-bold text-primary">
                          Rp {finalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-lg text-gray-400 line-through">
                        Rp {normalPrice.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl lg:text-3xl font-bold text-primary">
                      Rp {normalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* QUICK SPECS */}
              <div className="mb-6 space-y-3 text-xs lg:text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-medium text-gray-900">
                    {product.sku_seller || "-"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Garansi</span>
                  <span className="font-medium text-gray-900">
                    {product.warranty || "Garansi Toko"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Sisa Stok</span>
                  <span className={`font-semibold ${
                    Number(product.stock) < 5 ? "text-orange-500" : "text-gray-900"
                  }`}>
                    {product.stock} Unit
                  </span>
                </div>
              </div>

              {/* VARIATIONS */}
              {product.variasi && product.variasi.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-900">Pilih Variasi</p>
                    <p className="text-[10px] text-gray-400 italic">*Wajib dipilih</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variasi.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariasi(v)}
                        className={`min-w-[70px] lg:min-w-[80px] px-3 py-2 lg:px-4 lg:py-2.5 text-xs font-bold rounded-xl border-2 transition-all duration-200 ${
                          selectedVariasi === v 
                          ? "bg-primary/5 border-primary text-primary shadow-sm" 
                          : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION AREA */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between gap-3 lg:gap-4">
                  
                  {/* Counter - disesuaikan di HP agar tak makan banyak space */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <button 
                      onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} 
                      disabled={quantity <= 1 || isOutOfStock}
                      className="w-8 h-10 lg:w-9 lg:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
                    >
                      -
                    </button>

                    <span className="w-8 lg:w-10 text-center text-xs lg:text-sm font-semibold text-gray-900">
                      {isOutOfStock ? 0 : quantity}
                    </span>

                    <button 
                      onClick={() => setQuantity(q => q < Number(product.stock) ? q + 1 : q)} 
                      disabled={quantity >= Number(product.stock) || isOutOfStock}
                      className="w-8 h-10 lg:w-9 lg:h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Add To Cart - text dipertahankan tampil, tp ukurannya responsive */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 h-10 lg:h-12 font-bold rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${
                      isOutOfStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-sm active:scale-95"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    <span className="text-[13px] lg:text-base whitespace-nowrap">Tambah Keranjang</span>
                  </button>
                </div>

                {/* WA BUTTON */}
                {isOutOfStock ? (
                  <button className="w-full h-12 lg:h-14 bg-gray-100 text-gray-400 text-xs lg:text-base font-bold rounded-xl lg:rounded-2xl border border-gray-200 cursor-not-allowed uppercase tracking-wider">
                    Produk Tidak Tersedia
                  </button>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full h-12 lg:h-14 text-xs lg:text-base bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] uppercase tracking-wider
                              hover:brightness-110 hover:shadow-md hover:shadow-green-500/20"
                  >
                    <FaWhatsapp size={20} className="transition-transform duration-300 group-hover:scale-110 lg:w-[22px] lg:h-[22px]" />
                    Checkout via WhatsApp
                  </a>
                )}
              </div>

              {/* TRUST BADGES - grid cols menyesuaikan agar tidak kegencet di HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mt-6 lg:mt-8">
                <div className="flex items-center gap-4 p-3 lg:p-4 bg-white border border-gray-100 rounded-xl sm:border-transparent sm:rounded-none">
                  <Truck className="text-primary flex-shrink-0" size={22} />
                  <div>
                    <p className="text-xs lg:text-sm font-semibold text-gray-900">Gratis Ongkir</p>
                    <p className="text-[10px] lg:text-xs text-gray-500">Area DIY & Sekitarnya</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 lg:p-4 rounded-xl border border-gray-100 bg-white">
                  <ShieldCheck className="text-primary flex-shrink-0" size={22} />
                  <div>
                    <p className="text-xs lg:text-sm font-semibold text-gray-900">100% Original</p>
                    <p className="text-[10px] lg:text-xs text-gray-500">Garansi Resmi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 3. SECTION DESKRIPSI & REVIEW ================= */}
          <div className="lg:col-span-7 order-3 lg:pt-8 mt-4 lg:mt-0">
            <div className="flex gap-6 lg:gap-8 border-b mb-6 overflow-x-auto scrollbar-hide whitespace-nowrap">
              <button 
                onClick={() => setActiveTab("description")}
                className={`pb-4 text-xs lg:text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "description" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-primary/70"}`}
              >
                Tentang Produk
              </button>
              <button 
                onClick={() => setActiveTab("review")}
                className={`pb-4 text-xs lg:text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "review" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-primary/70"}`}
              >
                Review
              </button>
            </div>

            {activeTab === "description" ? (
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm lg:text-base">
                 <h3 className="text-base lg:text-lg font-bold text-gray-900">Specifications</h3>
                 <div className="space-y-2">
                    {product.specifications?.map((spec, index) => (
                      <p key={index}>• {spec.trim()}</p>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 italic text-sm lg:text-base">Belum ada review untuk produk ini.</div>
            )}
          </div>

        </div>
      </div>

      {/* ================= RELATED PRODUCT ================= */}
      <section className="w-full pb-10 lg:pb-16 mt-10 lg:mt-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-10">
          <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* JUDUL DINAMIS BERDASARKAN KATEGORI */}
            <h2 className="text-xl lg:text-3xl font-bold mb-2 lg:mb-4 text-gray-900">
              {product.category?.name ? "Produk Serupa" : "Mungkin Anda Tertarik"}
            </h2>
            
            {/* LEFT BUTTON */}
            <button
              onClick={() => scroll("left")}
              className={`hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 
              w-12 h-12 items-center justify-center 
              bg-white/80 backdrop-blur-md border border-gray-200 
              shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
              rounded-full text-gray-800 
              transition-all duration-500 ease-out
              ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}
              hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/20 active:scale-90`}
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={() => scroll("right")}
              className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 
              w-12 h-12 items-center justify-center 
              bg-white/80 backdrop-blur-md border border-gray-200 
              shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
              rounded-full text-gray-800 
              transition-all duration-500 ease-out
              ${isHovered ? "opacity-100 translate-x-0 delay-75" : "opacity-0 translate-x-12"}
              hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/20 active:scale-90`}
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>

            <div ref={scrollRef} onScroll={handleScroll} className="flex gap-2 sm:gap-3 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-4">
              {loadingRelated ? (
                [...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="product-item flex-shrink-0 snap-start w-[60%] sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-96px)/5)]"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : (
                relatedProducts.map((item) => (
                  <div 
                    key={item.id} 
                    className="product-item flex-shrink-0 snap-start 
                    w-[calc((100%-12px)/2)] 
                    sm:w-[calc((100%-16px)/2)] 
                    md:w-[calc((100%-32px)/3)] 
                    lg:w-[calc((100%-96px)/5)]"
                  >
                    <ProductCard product={item} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL ZOOM (Sudah Diupdate ala Shopee) */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 p-4" 
          onClick={() => setShowModal(false)}
        >
          {/* Tombol Close */}
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-50 transition-colors"
          >
            &times;
          </button>

          {/* Gambar Utama */}
          <div 
            className="w-full max-w-4xl h-[50vh] lg:h-[65vh] flex items-center justify-center mb-6"
            onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak nutup modal
          >
            <img
              src={
                product.images[activeImage]?.image_url?.startsWith("http") 
                  ? product.images[activeImage]?.image_url 
                  : `${import.meta.env.VITE_API_BASE}${product.images[activeImage]?.image_url}`
              }
              className="max-w-full max-h-full object-contain shadow-2xl transition-all"
              alt="Zoomed Product"
            />
          </div>

          {/* List Thumbnail */}
          <div 
            className="flex gap-4 overflow-x-auto max-w-4xl w-full px-4 pb-4 scrollbar-hide justify-center"
            onClick={(e) => e.stopPropagation()} // Supaya klik area thumbnail tidak nutup modal
          >
            {product.images.map((img, index) => (
              <img
                key={img.id}
                src={
                  img.image_url?.startsWith("http") 
                    ? img.image_url 
                    : `${import.meta.env.VITE_API_BASE}${img.image_url}`
                }
                onClick={() => setActiveImage(index)}
                className={`w-14 h-14 lg:w-16 lg:h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer transition-all border-2 flex-shrink-0 ${
                  activeImage === index ? "border-primary opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-100"
                }`}
                alt={`Thumbnail Modal ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* MODAL BERHASIL TAMBAH KERANJANG */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white w-[calc(100%-2rem)] sm:w-full max-w-lg rounded-2xl lg:rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-5 lg:p-8">
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 lg:top-6 lg:right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-4 lg:mb-6 mt-1 lg:mt-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={20} className="lg:hidden" strokeWidth={3} />
                  <Check size={24} className="hidden lg:block" strokeWidth={3} />
                </div>
                <h3 className="text-lg lg:text-xl font-black text-gray-900">Berhasil ditambahkan</h3>
              </div>

              {/* Info Produk Card */}
              <div className="flex gap-4 lg:gap-5 p-4 lg:p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-6 lg:mb-8">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 p-2">
                  <img 
                    src={product.images[0]?.image_url?.startsWith("http") 
                      ? product.images[0]?.image_url 
                      : `${import.meta.env.VITE_API_BASE}${product.images[0]?.image_url}`} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Item baru</p>
                  <h4 className="text-sm lg:text-base font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 lg:gap-x-3 gap-y-1 text-[11px] lg:text-xs text-gray-500">
                    {selectedVariasi && (
                      <span className="flex items-center gap-1">
                        Variasi: <span className="font-semibold text-gray-700">{selectedVariasi}</span>
                      </span>
                    )}
                    <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                    <span className="flex items-center gap-1">
                      Kuantitas: <span className="font-semibold text-gray-700">{quantity}x</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <button
                  onClick={() => navigate("/cart")} 
                  className="flex-1 h-12 lg:h-14 bg-primary text-white text-sm lg:text-base font-bold rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 order-2 sm:order-1"
                >
                  <ShoppingBag size={18} />
                  Lihat Keranjang
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 h-12 lg:h-14 bg-white text-gray-600 text-sm lg:text-base font-bold rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all order-1 sm:order-2"
                >
                  Lanjut Belanja
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => {
          setIsAuthModalOpen(false);
          handleAddToCart();
        }}
      />

    </>
  );
}