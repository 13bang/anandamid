import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface ProductRowProps {
  product: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
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
}: ProductRowProps) {
  const finalPrice = product.price_normal - (product.price_discount ?? 0);

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
        <img
          src={product.thumbnail_url || "/images/product-placeholder.png"}
          alt={product.name}
          onClick={() =>
            onImageClick(product.thumbnail_url || "/images/product-placeholder.png")
          }
          className="object-cover w-8 h-8 rounded cursor-pointer hover:opacity-80"
        />
      </td>
      <td className="px-3 py-2 font-medium">{product.name}</td>
      <td className="px-3 py-2 text-center">{product.stock}</td>
      <td className="px-2 py-2 whitespace-nowrap">
        Rp {Number(product.price_normal).toLocaleString()}
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
        Rp {Number(product.price_discount ?? 0).toLocaleString()}
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
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
