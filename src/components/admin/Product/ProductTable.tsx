import { useState } from "react";
import ProductRow from "./ProductRow";
import api from "../../../services/api";

interface ProductTableProps {
  products: any[];
  total: number;
  page: number;
  lastPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onToggle: (id: string, field: "is_active" | "is_popular", currentValue: boolean) => void;
  onEdit: (product: any) => void;
  onImageClick: (url: string) => void;
  onSearch: (query: string) => void;
  onRefetch: () => void;
}

export default function ProductTable({
  products,
  total,
  page,
  lastPage,
  limit,
  onPageChange,
  onLimitChange,
  onToggle,
  onEdit,
  onImageClick,
  onSearch,
  onRefetch,
}: ProductTableProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - 3);
    let end = Math.min(lastPage, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = confirm(
      `Yakin mau hapus ${selectedIds.length} produk?`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      await api.delete("/admin/products/bulk", {
        data: { ids: selectedIds },
      });

      setSelectedIds([]);

      onRefetch();

    } catch (error) {
      console.error("Bulk delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 shadow rounded-2xl">
      <div className="overflow-x-auto">
        {/* ACTION BAR */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 text-sm border-b bg-red-50">
            <span className="font-medium">
              {selectedIds.length} produk dipilih
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1 border rounded-md hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Hapus Terpilih
              </button>
            </div>
          </div>
        )}

        <table className="min-w-full text-xs table-auto">
          <thead className="bg-white">

            {/* Search Row */}
            <tr className="border-b">
              <th colSpan={10} className="px-4 py-3 bg-white">
                <div className="flex justify-end">
                  <input
                    type="text"
                    placeholder="Cari..."
                    className="w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => onSearch(e.target.value)}
                  />
                </div>
              </th>
            </tr>

            {/* Column Header */}
            <tr className="border-b bg-gray-50">
              <th className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === products.length &&
                    products.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-3 py-2 text-left">Gambar</th>
              <th className="px-3 py-2 text-left w-[35%]">Nama</th>
              <th className="px-3 py-2 text-center">Stok</th>
              <th className="px-3 py-2 text-left">Harga Normal</th>
              <th className="px-3 py-2 text-left">Diskon</th>
              <th className="px-3 py-2 text-left">Harga Final</th>
              <th className="px-3 py-2 text-center">Aktif</th>
              <th className="px-3 py-2 text-center">Populer</th>
              <th className="px-3 py-2 text-center">Edit</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-4 text-center">
                  Tidak ada produk
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.includes(product.id)}
                  onSelect={handleSelect}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onImageClick={onImageClick}
                />
              ))
            )}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={10} className="px-4 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span>Show</span>
                    <select
                      value={limit}
                      onChange={(e) => onLimitChange(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded-md"
                    >
                      {[10, 20, 30, 40, 50].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <button disabled={page === 1} onClick={() => onPageChange(1)} className="px-2 disabled:opacity-30">
                      {"<<"}
                    </button>
                    <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-2 disabled:opacity-30">
                      {"<"}
                    </button>

                    {getPageNumbers().map((num) => (
                      <button
                        key={num}
                        onClick={() => onPageChange(num)}
                        className={`px-2 ${
                          page === num
                            ? "font-semibold text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    {lastPage > 5 && page + 2 < lastPage && (
                      <span className="px-2">...</span>
                    )}

                    <button disabled={page === lastPage} onClick={() => onPageChange(page + 1)} className="px-2 disabled:opacity-30">
                      {">"}
                    </button>
                    <button disabled={page === lastPage} onClick={() => onPageChange(lastPage)} className="px-2 disabled:opacity-30">
                      {">>"}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}