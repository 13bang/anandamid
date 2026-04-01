import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../services/productService";
import { FaWhatsapp, FaSearchPlus, FaBan, FaCheckCircle } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/product";
import Breadcrumb from "../../components/Breadcrumb";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";

export default function ProductDetailPage() {
  const [loadingRelated, setLoadingRelated] = useState(true);
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "review">("description");

  const [quantity, setQuantity] = useState(1);
  const [selectedVariasi, setSelectedVariasi] = useState<string>("");

  const WHATSAPP_NUMBER = "62895375706990";

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showModal, setShowModal] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

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
    const cardWidth = card.clientWidth + 24;
    const index = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstCard = container.querySelector(".product-item") as HTMLElement;
    if (!firstCard) return;
    const gap = 16;
    const cardWidth = firstCard.offsetWidth + gap;
    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

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
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Produk Katalog", path: "/product-katalog" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ================= LEFT COLUMN (IMAGE & DESC) ================= */}
          <div className="lg:col-span-7">
            
            {/* WRAPPER MAIN IMAGE & THUMBNAILS */}
            <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:items-start">
              
              {/* THUMBNAILS (Di kiri saat Desktop, di bawah saat Mobile) */}
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

            {/* DESCRIPTION & REVIEW */}
            <div className="mt-12 pt-8">
              <div className="flex gap-8 border-b mb-6">
                <button 
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "description" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-primary/70"}`}
                >
                  Tentang Produk
                </button>
                <button 
                  onClick={() => setActiveTab("review")}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "review" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-primary/70"}`}
                >
                  Review
                </button>
              </div>

              {activeTab === "description" ? (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                   <h3 className="text-lg font-bold text-gray-900">Specifications</h3>
                   <div className="space-y-1">
                      {product.specifications?.map((spec, index) => (
                        <p key={index} className="text-sm">• {spec.trim()}</p>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500 italic">Belum ada review untuk produk ini.</div>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN (PRODUCT INFO CARD) ================= */}
          <div className="lg:col-span-5">
            {/* Ubah top-24 menjadi top-32 agar navbar tidak tertabrak (bisa disesuaikan lagi jika kurang/lebih) */}
            <div className="lg:sticky lg:top-32 border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm bg-white">
            {/* CATEGORY & BRAND TAGS */}
            <div className="flex flex-wrap gap-2 mb-4">

              {/* CATEGORY */}
              <span className="px-3 py-1 bg-blue-50 text-[10px] font-bold uppercase tracking-widest text-blue-600 rounded border border-blue-100">
                {product.category.name}
              </span>

              {/* BRAND */}
              {product.brand && (
                <span className="px-3 py-1 bg-blue-50 text-[10px] font-bold uppercase tracking-widest text-blue-600 rounded border border-blue-100">
                  {product.brand.name}
                </span>
              )}

            </div>

              {/* TITLE */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 uppercase italic tracking-tighter">
                {product.name}
              </h1>

              {/* PRICE */}
              <div className="mb-6">
                {discountPrice > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-primary">Rp {finalPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 line-through">Rp {normalPrice.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-primary">Rp {normalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* SKU & STOCK */}
              <div className="space-y-3 mb-8 pb-8 border-b border-gray-100">
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
                <div className="mb-8">
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
                <div className="flex items-center gap-4">
                   <div className="flex items-center border border-gray-300 rounded-lg h-12">
                      <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-4 text-xl text-black">-</button>
                      <span className="px-4 font-bold w-12 text-center text-gray-900">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-4 text-xl text-black">+</button>
                   </div>
                   
                   {isOutOfStock ? (
                      <button disabled className="flex-1 h-12 bg-red-100 text-red-600 font-bold rounded-lg flex items-center justify-center gap-2">
                        <FaBan /> Stok Habis
                      </button>
                   ) : (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex-1 h-12 bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-3 hover:opacity-90 transition shadow-lg shadow-green-500/30">
                        <FaWhatsapp size={20} />
                        Tambah ke keranjang
                      </a>
                   )}
                </div>

                {/* EXTRA INFO */}
                <div className="pt-6 space-y-4 border-t border-gray-100 mt-6">
                   <div className="flex gap-4 items-start">
                      <Truck className="text-primary mt-1" size={20} />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Subsidi Pengiriman</p>
                        <p className="text-xs text-gray-500">Minimal Pembelian Rp 50.000,-</p>
                      </div>
                   </div>
                   <div className="flex gap-4 items-start">
                      <ShieldCheck className="text-primary mt-1" size={20} />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Garansi Sampai 1 Tahun</p>
                        <p className="text-xs text-gray-500">Dapatkan Garansi untuk Produk Tertentu</p>
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= RELATED PRODUCT ================= */}
      <section className="w-full pb-16 mt-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="relative">
            <h2 className="text-2xl font-bold mb-8 italic uppercase tracking-tighter text-gray-900">Produk Serupa</h2>
            
            <button onClick={() => scroll("left")} className="absolute -left-5 top-1/2 z-20 p-3 bg-white shadow-xl rounded-full hidden md:flex hover:scale-110 transition text-primary">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll("right")} className="absolute -right-5 top-1/2 z-20 p-3 bg-white shadow-xl rounded-full hidden md:flex hover:scale-110 transition text-primary">
              <ChevronRight size={24} />
            </button>

            <div ref={scrollRef} onScroll={handleScroll} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-4">
              {loadingRelated ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="product-item flex-shrink-0 w-[47%] md:w-[230px]"><ProductCardSkeleton /></div>
                ))
              ) : (
                relatedProducts.map((item) => (
                  <div key={item.id} className="product-item flex-shrink-0 snap-start w-[47%] md:w-[230px]">
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4" 
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