import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import type { Product } from "../types/product";

interface Props {
  product: Product;
}

const WHATSAPP_NUMBER = "62895375706990";

const ProductCard: React.FC<Props> = ({ product }) => {
    
  const navigate = useNavigate();

  const productLink = `${window.location.origin}/product-katalog/${product.id}`;

    const message = `Hai, saya ingin bertanya mengenai produk berikut:

    Nama Produk: ${product.name}
    Link Produk: ${productLink}

    Terima kasih.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const hasDiscount =
        product.price_discount &&
        Number(product.price_discount) > 0 &&
        Number(product.price_normal) > 0;

    const discountPercent = hasDiscount
        ? Math.round(
            (Number(product.price_discount) /
                Number(product.price_normal)) *
                100
            )
        : 0;

  return (
    <div
      onClick={() => navigate(`/product-katalog/${product.id}`)}
      className="relative flex flex-col bg-white rounded-md 
           shadow-lg border border-black/20
           cursor-pointer h-[260px]"
    >
      {/* IMAGE */}
      <div className="h-40 bg-white rounded-t-md overflow-hidden flex items-center justify-center">
        <img
          src={
            product.thumbnail_url
              ? product.thumbnail_url.startsWith("http")
                ? product.thumbnail_url
                : `http://localhost:3000${product.thumbnail_url}`
              : "/icon-anandam.svg"
          }
          alt={product.name}
          className="max-h-36 w-auto object-contain transition-transform duration-300 ease-in-out hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/icon-anandam.svg";
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-1 p-3">
        <div className="flex flex-col gap-1">
            <h3 className="text-xs font-medium line-clamp-2 min-h-[32px]">
                {product.name}
            </h3>

            {hasDiscount && (
                <div
                    className="relative w-fit text-white text-[10px] font-bold"
                    style={{
                    clipPath:
                        "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
                    background: "#dc2626",
                    padding: "4px 12px 4px 10px",
                    }}
                >
                    Save {discountPercent}%
                </div>
            )}
        </div>

        <div>
          {product.price_discount ? (
            <>
              <p className="text-xs text-gray-400 line-through">
                Rp {Number(product.price_normal).toLocaleString()}
              </p>
              <p className="text-sm font-bold text-red-600">
                Rp{" "}
                {(
                  Number(product.price_normal) -
                  Number(product.price_discount)
                ).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-sm font-bold text-red-600">
              Rp {Number(product.price_normal).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* WHATSAPP BUTTON */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition"
      >
        <FaWhatsapp size={18} />
      </a>
    </div>
  );
};

export default ProductCard;