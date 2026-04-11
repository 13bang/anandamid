import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../services/productService";
import { FaWhatsapp, FaSearchPlus, FaBan, FaCheckCircle } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/product";
import Breadcrumb from "../../components/Breadcrumb";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import { createPortal } from "react-dom";

export default function ProductDetailPage() {
  const [loadingRelated, setLoadingRelated] = useState(true);
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
      const related = await getProductsByCategory(data.category.name);
      const filtered = related.filter((p: Product) => p.id !== data.id).slice(0, 30);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error(err);
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
                  <div className="w-32 h-12 rounded-lg bg-gray-200 shimmer"></div>
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
      <div className="w-full bg-white">
        <div className="max-w-7xl px-4 lg:px-8 py-3">
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
        {/* Gunakan Grid dengan custom ordering untuk memindahkan elemen saat di Mobile vs Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-10">
          
          {/* ================= 1. SECTION GAMBAR ================= */}
          <div className="lg:col-span-7 order-1">
            <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:items-start">
              {/* THUMBNAILS */}
              <div className="
                flex lg:flex-col gap-3 
                overflow-x-auto lg:overflow-y-auto 
                pb-2 lg:pb-0 
                scrollbar-hide 
                w-full lg:w-24 
                flex-shrink-0
                lg:h-[500px]   
              ">
                {product.images.map((img, index) => (
                  <img
                    key={img.id}
                    src={img.image_url?.startsWith("http") ? img.image_url : `${import.meta.env.VITE_API_BASE}${img.image_url}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 object-cover border-2 rounded-lg cursor-pointer transition-all flex-shrink-0 ${
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
            <div className="lg:sticky lg:top-36 lg:border lg:border-gray-200 lg:rounded-2xl lg:p-8 lg:shadow-sm bg-white py-2 lg:py-0">
              
              {/* CATEGORY & BRAND TAGS */}
              <div className="flex flex-wrap gap-2 mb-3 lg:mb-4 mt-6">
                <span className="px-3 py-1 bg-blue-50 text-[10px] font-bold uppercase tracking-widest text-blue-600 rounded border border-blue-100">
                  {product.category.name}
                </span>
                {product.brand && (
                  <span className="px-3 py-1 bg-blue-50 text-[10px] font-bold uppercase tracking-widest text-blue-600 rounded border border-blue-100">
                    {product.brand.name}
                  </span>
                )}
              </div>

              {/* TITLE */}
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* PRICE */}
              <div className="mb-4 lg:mb-6">
                {discountPrice > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl lg:text-3xl font-bold text-primary">Rp {finalPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">Rp {normalPrice.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-2xl lg:text-3xl font-bold text-primary">Rp {normalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* SKU & STOCK */}
              <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-primary" />
                  <span>Sisa stok {product.stock}</span>
                </div>
                <div className="text-sm text-gray-500">
                  SKU: <span className="font-medium text-gray-900">{product.sku_seller}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Garansi: <span className="font-medium text-gray-900">{product.warranty || "-"}</span>
                </div>
              </div>

              {/* VARIATIONS */}
              {product.variasi && product.variasi.length > 0 && (
                <div className="mb-6 lg:mb-8">
                  <p className="text-xs font-bold uppercase mb-3 tracking-widest text-gray-700">Pilih Variasi:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variasi.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariasi(v)}
                        className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all ${
                          selectedVariasi === v ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QTY & ACTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 lg:gap-4">
                   <div className="flex items-center border border-gray-300 rounded-lg h-12">
                      <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-3 lg:px-4 text-xl text-black">-</button>
                      <span className="px-2 lg:px-4 font-bold w-10 lg:w-12 text-center text-gray-900">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-3 lg:px-4 text-xl text-black">+</button>
                   </div>
                   
                   {isOutOfStock ? (
                      <button disabled className="flex-1 h-12 bg-red-100 text-red-600 font-bold rounded-lg flex items-center justify-center gap-2 text-sm lg:text-base">
                        <FaBan /> Stok Habis
                      </button>
                   ) : (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex-1 h-12 bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 lg:gap-3 hover:opacity-90 transition shadow-lg shadow-green-500/30 text-sm lg:text-base">
                        <FaWhatsapp size={20} />
                        Chat via WhatsApp
                      </a>
                   )}
                </div>

                {/* EXTRA INFO */}
                <div className="pt-4 lg:pt-6 space-y-3 lg:space-y-4 border-t border-gray-100 mt-4 lg:mt-6 pb-6">
                  <div className="flex gap-3 lg:gap-4 items-start">
                      <Truck className="text-primary mt-1 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Gratis Ongkir DIY & Sekitarnya</p>
                        <p className="text-xs text-gray-500">S&K berlaku</p>
                      </div>
                  </div>

                  <div className="flex gap-3 lg:gap-4 items-start">
                      <ShieldCheck className="text-primary mt-1 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Jaminan Produk Original</p>
                        <p className="text-xs text-gray-500">100% produk asli & resmi</p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 3. SECTION DESKRIPSI & REVIEW ================= */}
          <div className="lg:col-span-7 order-3 lg:pt-8 mt-4 lg:mt-0">
            <div className="flex gap-6 lg:gap-8 border-b mb-6 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveTab("description")}
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "description" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-primary/70"}`}
              >
                Tentang Produk
              </button>
              <button 
                onClick={() => setActiveTab("review")}
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "review" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-primary/70"}`}
              >
                Review
              </button>
            </div>

            {activeTab === "description" ? (
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm lg:text-base">
                 <h3 className="text-lg font-bold text-gray-900">Specifications</h3>
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
            <h2 className="text-xl lg:text-3xl font-bold mb-2 lg:mb-4 text-gray-900">Produk Serupa</h2>
            
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

      {/* MODAL ZOOM */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4" 
          onClick={() => setShowModal(false)}
        >
          <img
            src={
              product.images[activeImage]?.image_url?.startsWith("http") 
                ? product.images[activeImage]?.image_url 
                : `${import.meta.env.VITE_API_BASE}${product.images[activeImage]?.image_url}`
            }
            className="max-w-full max-h-full object-contain shadow-2xl"
            alt="Zoomed Product"
          />
        </div>
      )}
    </>
  );
}