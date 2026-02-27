import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../services/productService";
import { FaWhatsapp, FaSearchPlus } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/product";

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

// interface ProductDetail {
//   id: string;
//   name: string;
//   description: string;
//   description_raw: string;
//   notes: string[];
//   specifications: string[];
//   price_normal: string;
//   price_discount: string;
//   final_price: number;
//   stock: number;
//   sku_seller: string;
//   warranty: string;
//   category: {
//     name: string;
//   };
//   images: ProductImage[];
// }

export default function ProductDetailPage() {
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

  const CARD_TOTAL_WIDTH = 226;

  const scrollRight = () => {
    if (!scrollRef.current) return;

    const maxIndex = relatedProducts.length - 1;
    const newIndex = Math.min(currentIndex + 1, maxIndex);

    scrollRef.current.scrollTo({
      left: newIndex * CARD_TOTAL_WIDTH,
      behavior: "smooth",
    });

    setCurrentIndex(newIndex);
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;

    const newIndex = Math.max(currentIndex - 1, 0);

    scrollRef.current.scrollTo({
      left: newIndex * CARD_TOTAL_WIDTH,
      behavior: "smooth",
    });

    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const data = await getProductById(id!);
    setProduct(data);
    setLoading(false);
  };

  useEffect(() => {
    if (product) fetchRelatedProducts();
  }, [product]);

  const fetchRelatedProducts = async () => {
    const data = await getProductsByCategory(product!.category.name);

    const filtered = data.filter((p: Product) => p.id !== product!.id);

    setRelatedProducts(filtered);
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  const warrantyDisplay =
    !product.warranty ||
    product.warranty === "NaN" ||
    String(product.warranty).trim() === ""
      ? "-"
      : product.warranty;

  const normalPrice = Number(product.price_normal) || 0;
  const discountPrice = Number(product.price_discount) || 0;

  const finalPrice =
    discountPrice > 0 ? normalPrice - discountPrice : normalPrice;

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
    <div className="w-full px-8 py-10 mx-auto">

      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-12 gap-10">

        {/* IMAGE */}
        <div className="col-span-5">
          <div
            className="relative overflow-hidden border rounded-lg aspect-square group cursor-zoom-in"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setZoomPosition({ x, y });
            }}
          >
            <img
              src={product.images[activeImage]?.image_url}
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
                        transition"
            >
              <FaSearchPlus size={18} />
            </button>
          </div>

          {/* THUMBNAILS */}
          <div className="flex mt-4 space-x-3 overflow-x-auto">
            {product.images.map((img, index) => (
              <img
                key={img.id}
                src={img.image_url}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                  activeImage === index
                    ? "border-black"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="relative bg-white rounded-xl p-4 shadow-2xl 
                        w-full max-w-xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.images[activeImage]?.image_url}
                alt={product.name}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />

              {/* tombol close */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 bg-black/70 text-white 
                          w-8 h-8 rounded-full flex items-center justify-center 
                          hover:bg-black transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* INFO */}
        <div className="col-span-7 space-y-6">

          <div>
            <p className="mb-2 text-sm text-gray-500 font-semibold">
              {product.category.name}
            </p>

            <h1 className="text-3xl font-bold">
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

                <p className="text-3xl font-bold text-black">
                  Rp {finalPrice.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-black">
                Rp {normalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* META */}
          <div className="space-y-2 text-sm text-gray-600">
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
          <div className="pt-4">

            <div className="flex items-center gap-4">

              {/* QTY */}
              <div className="flex items-center border rounded h-[44px]">
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

              {/* WHATSAPP BUTTON */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[44px] flex items-center gap-2 px-6 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                <FaWhatsapp size={18} />
                Pesan via WhatsApp
              </a>

            </div>

          </div>

          {/* ================= TAB SECTION ================= */}
          <div className="pt-6">

            {/* TAB HEADER */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-8 py-3 text-sm font-medium ${
                  activeTab === "description"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
              >
                Description
              </button>

              <button
                onClick={() => setActiveTab("review")}
                className={`px-8 py-3 text-sm font-medium ${
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
                <div>
                  <h3 className="mb-4 text-base font-semibold">
                    Specifications
                  </h3>

                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                    {product.specifications?.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ol>
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

      {/* ================= RELATED PRODUCT ================= */}
      <section className="w-full px-8 pb-16 mt-16">

        <div className="relative p-6 bg-white rounded-md shadow-[0_0_15px_rgba(0,0,0,0.08)]">
          
          <h2 className="mb-6 text-lg font-semibold">
            Related Products
          </h2>

          {/* BUTTON LEFT */}
          <button
            onClick={scrollLeft}
            className="absolute -left-5 top-1/2 -translate-y-1/2 
            z-20 p-3 bg-white shadow-md rounded-full 
            hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>

          {/* BUTTON RIGHT */}
          <button
            onClick={scrollRight}
            className="absolute -right-5 top-1/2 -translate-y-1/2 
            z-20 p-3 bg-white shadow-md rounded-full 
            hover:bg-gray-100 transition"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            className="
              flex gap-4
              overflow-x-auto
              scroll-smooth
              scrollbar-hide
              cursor-grab
              active:cursor-grabbing
            "
          >
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[210px]"
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}