import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import type { Product } from "../types/product";

interface Props {
  product: Product;
}

const WHATSAPP_NUMBER = "62895375706990";

const ProductCard: React.FC<Props> = ({ product }) => {
    
  const isOutOfStock = Number(product.stock) === 0;

  const navigate = useNavigate();

  const productLink = `${window.location.origin}/product-katalog/${product.id}`;

    const message = `Hai, saya ingin bertanya mengenai produk berikut:

    Nama Produk: ${product.name}
    Link Produk: ${productLink}

    Terima kasih.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const normal = Number(product.price_normal);
    const discountValue = Number(product.price_discount);

    const hasDiscount = discountValue > 0;

    const discountPercent = hasDiscount
      ? ((discountValue / normal) * 100).toFixed(2)
      : "0";

    const imageSrc = product.thumbnail_url
      ? product.thumbnail_url.startsWith("http")
        ? product.thumbnail_url
        : `${import.meta.env.VITE_API_BASE}${product.thumbnail_url}`
      : "/icon-anandam.svg";

  return (
    <div
      onClick={() => navigate(`/product-katalog/${product.id}`)}
      className="
      relative flex flex-col
      rounded-3xl
      bg-white/80
      backdrop-blur-md
      border border-gray-800/20
      cursor-pointer
      shadow-lg
      "
    >
      {/* DISCOUNT BADGE */}
      {hasDiscount && (
        <div className="absolute top-0 right-0 z-10 w-16 h-16 overflow-hidden">
          <div className="
            absolute top-3 right-[-20px]
            rotate-45
            bg-red-500
            text-white
            text-[10px]
            font-bold
            w-24 text-center
            py-1
          ">
            {discountPercent}%
          </div>
        </div>
      )}

      {/* IMAGE */}
      <div className="relative w-full aspect-square rounded-t-3xl overflow-hidden bg-gradient-to-br from-white to-gray-100">
        <img
          src={imageSrc}
          alt={product.name}
          className={`
            w-full h-full object-cover
            transition-transform duration-300 ease-in-out
            ${!isOutOfStock ? "hover:scale-110" : ""}
            ${isOutOfStock ? "opacity-40 grayscale" : ""}
          `}
          onError={(e) => {
            e.currentTarget.src = "/icon-anandam.svg";
          }}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gray-500 text-white text-xs font-bold px-4 py-1 rounded-3xl tracking-wider shadow-md">
              HABIS
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1 p-3">
        
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium line-clamp-2 min-h-[32px]">
            {product.name}
          </h3>
        </div>

        {/* PRICE WRAPPER */}
        <div className="mt-2 min-h-[40px] flex flex-col justify-end">
          {product.price_discount ? (
            <>
              <p className="text-xs text-gray-400 line-through">
                Rp {Number(product.price_normal).toLocaleString()}
              </p>

              <p className="inline-block text-sm font-bold text-white bg-blue-600 px-2 py-0.5 rounded-2xl w-fit">
                Rp{" "}
                {(
                  Number(product.price_normal) -
                  Number(product.price_discount)
                ).toLocaleString()}
              </p>
            </>
          ) : (
            <>
              <div className="h-[14px]" />
              <p className="inline-block text-sm font-bold text-white bg-blue-600 px-2 py-0.5 rounded-2xl w-fit">
                Rp {Number(product.price_normal).toLocaleString()}
              </p>
            </>
          )}
        </div>

      </div>

      {/* WHATSAPP BUTTON */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="
        absolute bottom-3 right-3
        bg-green-500/90
        backdrop-blur
        hover:bg-green-600
        text-white
        p-2 rounded-full
        shadow-lg
        transition
        "
      >
        <FaWhatsapp size={18} />
      </a>
    </div>
  );
};

export default ProductCard;