import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../services/productService";
import { FaWhatsapp, FaSearchPlus, FaBan } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const WHATSAPP_NUMBER = "62895375706990";

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showModal, setShowModal] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const specRef = useRef<HTMLDivElement>(null);

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

  const [showFullSpec, setShowFullSpec] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setLoadingRelated(true);

    try {
      const data = await getProductById(id!);
      setProduct(data);

      const related = await getProductsByCategory(data.category.name);

      const filtered = related
        .filter((p: Product) => p.id !== data.id)
        .slice(0, 30);

      setRelatedProducts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingRelated(false);
    }
  };

  const fetchRelatedProducts = async () => {
    setLoadingRelated(true);

    const data = await getProductsByCategory(product!.category.name);

    const filtered = data
      .filter((p: Product) => p.id !== product!.id)
      .slice(0, 30);

    setRelatedProducts(filtered);

    setLoadingRelated(false);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const card = container.querySelector(".product-item");

    if (!card) return;

    const cardWidth = card.clientWidth + 24; // gap-6 = 24px
    const index = Math.round(container.scrollLeft / cardWidth);

    setCurrentIndex(index);
  };

  const maxDots = 5;

  const totalSlides = relatedProducts.length;
  const dotCount = Math.min(maxDots, totalSlides);

  const getActiveDot = () => {
    if (totalSlides <= maxDots) return currentIndex;

    const ratio = totalSlides / maxDots;
    return Math.floor(currentIndex / ratio);
  };

  if (loading)
    return (
      <div className="max-w-7xl px-8 py-10 mx-auto">
        <div className="grid grid-cols-12 gap-10">

          {/* IMAGE */}
          <div className="col-span-4">
            <div className="aspect-square rounded-lg shimmer"></div>

            <div className="flex gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded shimmer"></div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="col-span-8 space-y-6">

            <div className="space-y-3">
              <div className="h-4 w-32 shimmer"></div>
              <div className="h-8 w-3/4 shimmer"></div>
            </div>

            <div className="space-y-2">
              <div className="h-6 w-40 shimmer"></div>
              <div className="h-10 w-56 shimmer"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-40 shimmer"></div>
              <div className="h-4 w-32 shimmer"></div>
              <div className="h-4 w-36 shimmer"></div>
            </div>

            <div className="flex gap-4 pt-4">
              <div className="h-11 w-40 shimmer rounded"></div>
              <div className="h-11 w-56 shimmer rounded"></div>
            </div>

            <div className="pt-6 space-y-4">
              <div className="h-6 w-40 shimmer"></div>

              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 w-full shimmer"></div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
    if (!product) return <div className="p-10">Product not found</div>;

    const warrantyDisplay =
      !product.warranty ||
      product.warranty === "-" ||
      String(product.warranty).trim() === ""
        ? "-"
        : product.warranty;

    const normalPrice = Number(product.price_normal) || 0;
    const discountPrice = Number(product.price_discount) || 0;

    const finalPrice =
      discountPrice > 0 ? normalPrice - discountPrice : normalPrice;

    const isOutOfStock = Number(product.stock) === 0;

    const productLink = window.location.href;

    const whatsappMessage = `Hai, saya ingin memesan produk berikut:

    Nama Produk: ${product.name}
    Jumlah: ${quantity}
    Harga Satuan: Rp ${finalPrice.toLocaleString()}
    Link Produk: ${productLink}

    Mohon informasi ketersediaan dan total pembayarannya.
    Terima kasih.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

  return (
    <>
        {/* ================= BREADCRUMB ================= */}
        <div className="w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Produk Katalog", path: "/product-katalog" },
                ...(product?.category?.name
                  ? [
                      {
                        label: product.category.name,
                        path: `/product-katalog?category=${product.category.name}`,
                      },
                    ]
                  : []),
                {
                  label: product.name,
                },
              ]}
            />
          </div>
        </div>

        {/* ================= CONTENT WRAPPER ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-10 bg-white">

          {/* ================= TOP SECTION ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ================= IMAGE ================= */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">

              <div
                className="relative overflow-hidden border rounded-lg aspect-square group lg:cursor-zoom-in"
                onMouseEnter={() => {
                  if (window.innerWidth >= 1024) setIsZooming(true);
                }}
                onMouseLeave={() => {
                  if (window.innerWidth >= 1024) setIsZooming(false);
                }}
                onMouseMove={(e) => {
                  if (window.innerWidth < 1024) return;

                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setShowModal(true);
                  }
                }}
              >
                <img
                  src={
                    product.images[activeImage]?.image_url?.startsWith("http")
                      ? product.images[activeImage]?.image_url
                      : `${import.meta.env.VITE_API_BASE}${product.images[activeImage]?.image_url}`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200 ease-out"
                  style={{
                    transform: isZooming ? "scale(2)" : "scale(1)",
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />

                {/* SEARCH ICON */}
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white 
                  p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 
                  transition hidden lg:block"
                >
                  <FaSearchPlus size={18} />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="flex mt-4 gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <img
                    key={img.id}
                    src={
                      img.image_url?.startsWith("http")
                        ? img.image_url
                        : `${import.meta.env.VITE_API_BASE}${img.image_url}`
                    }
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 object-cover border rounded cursor-pointer ${
                      activeImage === index
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>

              {showModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                  onClick={() => setShowModal(false)}
                >
                  <img
                    src={
                      product.images[activeImage]?.image_url?.startsWith("http")
                        ? product.images[activeImage]?.image_url
                        : `${import.meta.env.VITE_API_BASE}${product.images[activeImage]?.image_url}`
                    }
                    alt={product.name}
                    className="max-w-[95%] max-h-[90%] object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* ================= INFO ================= */}
            <div className="lg:col-span-8 space-y-6">

              {/* TITLE */}
              <div>
                <p className="mb-2 text-sm text-gray-600 font-semibold">
                  {product.category.name}
                </p>

                <h1 className="text-lg lg:text-3xl font-semibold leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* PRICE */}
              <div>
                {discountPrice > 0 ? (
                  <>
                    <p className="text-sm text-gray-400 line-through">
                      Rp {normalPrice.toLocaleString()}
                    </p>

                    <p className="text-2xl lg:text-3xl font-bold text-primary">
                      Rp {finalPrice.toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl lg:text-3xl font-bold text-primary">
                    Rp {normalPrice.toLocaleString()}
                  </p>
                )}
              </div>

              {/* META */}
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  SKU: <span className="font-medium">{product.sku_seller}</span>
                </div>

                <div>
                  Stock: <span className="font-medium">{product.stock}</span>
                </div>

                <div>
                  Warranty: <span className="font-medium">{warrantyDisplay}</span>
                </div>
              </div>

              {/* ================= ORDER SECTION ================= */}
              <div className="pt-2">

                <div className="flex items-center gap-3">

                  {/* QTY */}
                  <div
                    className={`bg-gray-100 flex items-center border rounded h-[44px] ${
                      isOutOfStock ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <button
                      onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                      className="px-4 text-lg"
                    >
                      -
                    </button>

                    <span className="px-6 font-medium">{quantity}</span>

                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-4 text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* WHATSAPP */}
                  {isOutOfStock ? (
                    <button
                      disabled
                      className="h-[44px] flex items-center gap-2 px-6 font-semibold text-white bg-red-600 rounded-md cursor-not-allowed"
                    >
                      <FaBan size={18} />
                      Habis
                    </button>
                  ) : (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 lg:flex-none h-[44px] flex items-center justify-center gap-2 
                      px-4 lg:px-6 text-sm lg:text-base font-semibold text-white 
                      bg-green-600 rounded-md hover:bg-green-700 transition"
                    >
                      <FaWhatsapp className="text-base lg:text-lg" />
                      Pesan via WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* ================= TAB SECTION ================= */}
              <div className="pt-6">

                {/* TAB HEADER */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-6 lg:px-8 py-3 text-sm font-medium ${
                      activeTab === "description"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`}
                  >
                    Description
                  </button>

                  <button
                    onClick={() => setActiveTab("review")}
                    className={`px-6 lg:px-8 py-3 text-sm font-medium ${
                      activeTab === "review"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`}
                  >
                    Review
                  </button>
                </div>

                {/* TAB CONTENT */}
                <div className="py-6">

                  {activeTab === "description" && (
                    <div ref={specRef}>

                      {/* SPECIFICATIONS */}
                      <h3 className="mb-4 text-base font-semibold">
                        Specifications
                      </h3>

                      <div className="space-y-2 text-sm text-gray-700">
                        {(showFullSpec
                          ? product.specifications
                          : product.specifications?.slice(0, 10)
                        )?.map((spec, index) => (
                          <div key={index}>{spec.trim()}</div>
                        ))}
                      </div>

                    </div>
                  )}

                  {activeTab === "review" && (
                    <div className="text-sm text-gray-500">
                      <p>Belum ada review.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>

      </div>

      {/* ================= RELATED PRODUCT ================= */}
      <section className="w-full pb-16 mt-14 border border-t-2">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-6">

          <div className="relative">

            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
              Produk Serupa
            </h2>

            {/* BUTTON LEFT */}
            <button onClick={() => scroll("left")}
              className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 
              z-20 p-2 lg:p-3 bg-white shadow-md rounded-full 
              hidden md:flex
              hover:bg-gray-100 transition"
            >
              <ChevronLeft size={20} />
            </button>

            {/* BUTTON RIGHT */}
            <button onClick={() => scroll("right")}
              className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 
              z-20 p-2 lg:p-3 bg-white shadow-md rounded-full 
              hidden md:flex
              hover:bg-gray-100 transition"
            >
              <ChevronRight size={20} />
            </button>

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="
              flex gap-6
              overflow-x-auto
              scrollbar-hide
              scroll-smooth
              snap-x snap-mandatory
              py-2
              "
            >
              {loadingRelated ? (
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="
                    product-item
                    flex-shrink-0
                    snap-start
                    py-4
                    w-[47%]
                    sm:w-[180px]
                    md:w-[210px]
                    lg:w-[230px]
                    xl:w-[236px]
                    "
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : (
                relatedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="
                    product-item
                    flex-shrink-0
                    snap-start
                    py-4
                    w-[47%]
                    sm:w-[180px]
                    md:w-[210px]
                    lg:w-[230px]
                    xl:w-[236px]
                    "
                  >
                    <ProductCard product={item} />
                  </div>
                ))
              )}
            </div>

            {/* DOT INDICATOR */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              {Array.from({ length: dotCount }).map((_, index) => {
                const activeDot = getActiveDot();

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!scrollRef.current) return;

                      const container = scrollRef.current;
                      const card = container.querySelector(".product-item");
                      if (!card) return;

                      const cardWidth = card.clientWidth + 24;

                      const targetIndex = Math.floor(
                        (index / dotCount) * totalSlides
                      );

                      container.scrollTo({
                        left: targetIndex * cardWidth,
                        behavior: "smooth",
                      });
                    }}
                    className={`h-2 w-2 rounded-full transition-all ${
                      activeDot === index
                        ? "bg-black w-4"
                        : "bg-gray-300"
                    }`}
                  />
                );
              })}
            </div>

          </div>
        </div>

      </section>
    </>
  );
}