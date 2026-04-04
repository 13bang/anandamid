import { useState, useEffect } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { getThumbnailUrl } from "../../imageHelper";

interface ProductRowProps {
  product: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
  // Tambahkan callback untuk update inline
  onInlineUpdate: (id: string, updates: any) => Promise<void>; 
  onToggle: (id: string, field: "is_active" | "is_popular", currentValue: boolean) => void;
  onEdit: (product: any) => void;
  onImageClick: (url: string) => void;
}

export default function ProductRow({
  product,
  onToggle,
  onEdit,
  onImageClick,
  isSelected,
  onSelect,
  onInlineUpdate,
}: ProductRowProps) {
  // State untuk melacak kolom mana yang sedang diedit
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);

  const finalPrice = product.price_normal - (product.price_discount ?? 0);

  // Fungsi untuk handle ketika user menekan Enter atau Blur (keluar dari input)
  const handleBlur = async (field: string) => {
    if (tempValue !== product[field]) {
      await onInlineUpdate(product.id, { [field]: tempValue });
    }
    setEditingField(null);
  };

  const startEditing = (field: string, value: any) => {
    setEditingField(field);
    setTempValue(value);
  };

  const renderInlineInput = (field: string) => (
    <input
      autoFocus
      type="text"
      className="w-full px-1 py-1 border border-blue-500 rounded focus:outline-none"
      value={
        field === "price_normal" || field === "price_discount"
          ? formatRupiah(tempValue || "")
          : tempValue
      }
      onChange={(e) => {
        const val = e.target.value;

        if (field === "price_normal" || field === "price_discount") {
          const numeric = parseRupiah(val);
          setTempValue(numeric);
        } else {
          setTempValue(val);
        }
      }}
      onBlur={() => handleBlur(field)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBlur(field);
        if (e.key === "Escape") setEditingField(null);
      }}
    />
  );

  const formatRupiah = (value: number | string) => {
    if (!value) return "";
    return Number(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  return (
    <tr className="transition bg-white border-b border-gray-100 hover:bg-gray-50">
      <td className="px-3 py-2 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
        />
      </td>
      <td className="px-3 py-2">
        {(() => {
          const thumbnail =
            product.thumbnail_url ||
            product.images?.[0]?.thumbnail_url ||
            product.images?.[0]?.image_url;

          return thumbnail ? (
            <img
              src={getThumbnailUrl(thumbnail)}
              alt={product.name}
              width={32}
              height={32}
              onClick={(e) => {
                const img = e.target as HTMLImageElement;
                onImageClick(img.src);
              }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                const filename = thumbnail.split("/").pop();
                const fallback = `${import.meta.env.VITE_API_BASE}/uploads/products/original/${filename}`;

                console.log("IMAGE FAILED:", getThumbnailUrl(thumbnail));
                console.log("FALLBACK USED:", fallback);

                img.src = fallback;
              }}
              className="object-cover w-8 h-8 rounded cursor-pointer hover:opacity-80"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 text-xs text-gray-400 bg-gray-100 rounded">
              —
            </div>
          );
        })()}
      </td>
      {/* KOLOM NAMA */}
      <td 
        className="px-3 py-2 font-medium cursor-pointer hover:bg-blue-50"
        onClick={() => startEditing("name", product.name)}
      >
        {editingField === "name" ? (
          renderInlineInput("name")
        ) : (
          <div className="flex items-center">
            {product.name}
            {product.is_duplicate && <span className="ml-2 text-[10px] px-2 py-1 bg-red-500 text-white rounded-md">DUP!</span>}
          </div>
        )}
      </td>

      {/* KOLOM STOK */}
      <td 
        className="px-3 py-2 text-center cursor-pointer hover:bg-blue-50"
        onClick={() => startEditing("stock", product.stock)}
      >
        {editingField === "stock" ? (
          renderInlineInput("stock")
        ) : (
          product.stock
        )}
      </td>

      {/* KOLOM HARGA NORMAL */}
      <td 
        className="px-2 py-2 whitespace-nowrap cursor-pointer hover:bg-blue-50"
        onClick={() => startEditing("price_normal", product.price_normal)}
      >
        {editingField === "price_normal" ? (
          renderInlineInput("price_normal")
        ) : (
          `Rp ${Number(product.price_normal).toLocaleString()}`
        )}
      </td>

      {/* KOLOM DISKON */}
      <td 
        className="px-2 py-2 whitespace-nowrap cursor-pointer hover:bg-blue-50"
        onClick={() => startEditing("price_discount", product.price_discount)}
      >
        {editingField === "price_discount" ? (
          renderInlineInput("price_discount")
        ) : (
          `Rp ${Number(product.price_discount ?? 0).toLocaleString()}`
        )}
      </td>

      {/* HARGA FINAL (Otomatis, tidak perlu edit) */}
      <td className="px-2 py-2 whitespace-nowrap bg-gray-50 font-bold">
        Rp {Number(finalPrice).toLocaleString()}
      </td>
      <td className="px-3 py-2 text-center">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onToggle(product.id, "is_active", product.is_active)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
              product.is_active ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                product.is_active ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </td>
      <td className="px-3 py-2 text-center">
        
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onToggle(product.id, "is_popular", product.is_popular)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
            product.is_popular ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            product.is_popular ? "translate-x-5" : ""
          }`}
          />
        </button>
      </div>
    </td>
      <td className="px-3 py-2 text-center">
        <button
          onClick={() => onEdit(product)}
          className="flex items-center justify-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowTopRightOnSquareIcon className="w-4 h-4" strokeWidth={2.5} />
          <span>Ubah</span>
        </button>
      </td>
    </tr>
  );
}
