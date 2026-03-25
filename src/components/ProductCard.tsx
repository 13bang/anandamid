  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { FaWhatsapp } from "react-icons/fa6";
  import type { Product } from "../types/product";

  interface Props {
    product: Product;
    layout?: "grid" | "list";
    from?: "landing" | "katalog" | "categories";
    category?: string;
  }


  const WHATSAPP_NUMBER = "62895375706990";

  const ProductCard: React.FC<Props> = ({
    product,
    layout = "grid",
    from,
    category
  }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
      
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

      const finalPrice = hasDiscount ? normal - discountValue : normal;

      const thumb = product.images?.[0]?.thumbnail_url;
      const original = product.images?.[0]?.image_url;

      const imagePath =
        thumb?.startsWith("/uploads")
          ? thumb
          : original?.startsWith("/uploads")
          ? original
          : null;

      const imageSrc = imagePath
        ? imagePath.startsWith("http")
          ? imagePath
          : `${import.meta.env.VITE_API_BASE}${imagePath}`
        : "/icon-anandam.svg";

    return (
      <div
        onClick={() =>
          navigate(`/product-katalog/${product.id}`, {
            state: {
              from,
              category: product.category?.name,
            },
          })
        }
        className={`
          relative
          rounded-lg
          bg-white/80
          backdrop-blur-md
          border border-gray-800/20
          cursor-pointer
          transition-all duration-300

          ${layout === "grid"
            ? "flex flex-col"
            : "flex flex-row gap-4 p-3 items-start"}
        `}
      >
        {/* IMAGE */}
        <div
          className={`
          relative overflow-hidden bg-white
          ${layout === "grid"
            ? "w-full aspect-square rounded-t-lg"
            : "w-24 h-24 md:w-28 md:h-28 rounded-lg flex-shrink-0"}
          `}
        >

          {/* Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}

          <img
            src={imageSrc}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`
              w-full h-full object-cover
              transition-all duration-300 ease-in-out
              ${imageLoaded ? "opacity-100" : "opacity-0"}
              ${!isOutOfStock ? "hover:scale-110" : ""}
              ${isOutOfStock ? "opacity-40 grayscale" : ""}
            `}
            onError={(e) => {   
              const filename = product.thumbnail_url?.split("/").pop();

              if (filename && !e.currentTarget.src.includes("original")) {
                e.currentTarget.src =
                  `${import.meta.env.VITE_API_BASE}/uploads/products/original/${filename}`;
                return;
              }

              e.currentTarget.src = "/icon-anandam.svg";
              setImageLoaded(true);
            }}
          />

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gray-500 text-white text-xs font-bold px-4 py-1 rounded-3xl tracking-wider">
                HABIS
              </span>
            </div>
          )}

        </div>

        {/* CONTENT */}
        <div
          className={`
          flex
          ${layout === "grid"
            ? "flex-col justify-between p-2 sm:p-3 flex-1"
            : "flex flex-col flex-1 justify-between"}
          `}
        >
          <div className="flex flex-col gap-1 flex-1">
            <h3
              className={`font-semibold leading-snug hover:text-primary ${
                layout === "grid"
                  ? "text-[12px] sm:text-xs md:text-sm line-clamp-2 h-[35px]"
                  : "text-[14px] md:text-lg"
              }`}
            >
              {product.name}
            </h3>

            {layout === "list" && product.sku_seller && (
              <span className="text-sm text-gray-500">
                {product.sku_seller}
              </span>
            )}
          </div>

          {/* PRICE WRAPPER */}
          <div
            className={
              layout === "grid"
                ? "mt-auto pt-2 flex items-end justify-between"
                : "flex items-center justify-between mt-2"
            }
          >

            {/* LEFT SIDE (DISCOUNT + PRICE) */}
            <div className="flex flex-col">

              {hasDiscount ? (
                <div className="flex items-center gap-2 h-[18px]">
                  <span className="text-[11px] md:text-xs text-gray-400 line-through">
                    Rp {normal.toLocaleString()}
                  </span>

                  <span className="text-[10px] sm:text-xs font-semibold text-red-600 bg-red-100 px-[6px] sm:px-2 py-[1px] sm:py-[2px] rounded-full">
                    {discountPercent}%
                  </span>
                </div>
              ) : layout === "grid" ? (
                <div className="h-[18px]" />
              ) : null}

              <p
                className={`font-bold text-primary ${
                  layout === "grid"
                    ? "text-[14px] sm:text-base md:text-lg"
                    : "text-sm md:text-base line-clamp-2"
                }`}
              >
                Rp {finalPrice.toLocaleString()}
              </p>

            </div>

            {/* WHATSAPP BUTTON */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="
              bg-green-500
              hover:bg-green-600
              text-white
              p-[6px] sm:p-2
              rounded-full
              transition
              flex items-center justify-center
              "
            >
              <FaWhatsapp className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
            </a>

          </div>

        </div>
      </div>
    );
  };

  export default ProductCard;