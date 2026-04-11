import { useState } from "react";
import ProductRow from "./ProductRow";
import api from "../../../services/api";
import { updateAdminProduct } from "../../../services/adminProductService";

import Swal from "sweetalert2";
import { AlertCircle, Tag, AlertTriangle, Trash2 } from "lucide-react";

interface ProductTableProps {
  products: any[];
  total: number;
  page: number;
  lastPage: number;
  limit: number;
  duplicateCount: number;
  showDuplicateOnly: boolean;
  onToggleDuplicateFilter: () => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onToggle: (id: string, field: "is_active" | "is_popular", currentValue: boolean) => void;
  onEdit: (product: any) => void;
  onImageClick: (url: string) => void;
  onSearch: (query: string) => void;
  onRefetch: () => void;
  noCategoryCount: number; 
  showNoCategoryOnly: boolean; 
  onToggleNoCategoryFilter: () => void; 
}

export default function ProductTable({
  products,
  total,
  page,
  lastPage,
  limit,
  duplicateCount,
  showDuplicateOnly,
  onToggleDuplicateFilter,
  onPageChange,
  onLimitChange,
  onToggle,
  onEdit,
  onImageClick,
  onSearch,
  onRefetch,
  noCategoryCount,
  showNoCategoryOnly,
  onToggleNoCategoryFilter,
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

  const handleInlineUpdate = async (id: string, updates: any) => {
    try {
      await api.put(`/admin/products/${id}`, updates);
      onRefetch(); 
    } catch (error) {
      console.error("Gagal update produk:", error);
      Swal.fire("Error", "Gagal memperbarui data", "error");
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await Swal.fire({
      title: "Hapus Produk Terpilih?",
      html: `
        <div style="font-size:14px">
          Anda akan menghapus <b>${selectedIds.length}</b> produk.
          <br/><br/>
          <span style="color:#dc2626;font-weight:500">
            Data yang dihapus tidak bisa dikembalikan.
          </span>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);

      Swal.fire({
        title: "Menghapus...",
        text: "Sedang menghapus produk",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await api.delete("/admin/products/bulk", {
        data: { ids: selectedIds },
      });

      setSelectedIds([]);

      Swal.fire(
        "Berhasil",
        `${selectedIds.length} produk berhasil dihapus`,
        "success"
      );

      onRefetch();

    } catch (error) {
      console.error("Bulk delete error:", error);

      Swal.fire(
        "Error",
        "Terjadi kesalahan saat menghapus produk",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteDuplicate = async () => {
    if (!products.length) return;

    const result = await Swal.fire({
      title: "Hapus Produk Duplikat?",
      html: `
        <div style="text-align:left;font-size:14px">
          Tindakan ini akan:
          <ul style="margin-top:8px">
            <li>• Menghapus produk dengan tanggal <b>create / update lebih lama</b></li>
            <li>• Jika waktunya sama, sistem akan <b>menghapus salah satu secara random</b></li>
          </ul>
          <br/>
          <b>Data yang dihapus tidak bisa dikembalikan.</b>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);

      const groups: Record<string, any[]> = {};

      products.forEach((p) => {
        const key = p.duplicate_group || p.sku_seller;

        if (!groups[key]) {
          groups[key] = [];
        }

        groups[key].push(p);
      });

      const idsToDelete: string[] = [];

      Object.values(groups).forEach((group) => {
        if (group.length <= 1) return;

        group.sort((a, b) => {
          const aDate = new Date(a.updated_at || a.created_at).getTime();
          const bDate = new Date(b.updated_at || b.created_at).getTime();

          return bDate - aDate;
        });

        const keep = group[0];
        const duplicates = group.slice(1);

        duplicates.forEach((p) => idsToDelete.push(p.id));
      });

      if (!idsToDelete.length) {
        Swal.fire("Info", "Tidak ada duplicate yang bisa dihapus", "info");
        return;
      }

      await api.delete("/admin/products/bulk", {
        data: { ids: idsToDelete },
      });

      Swal.fire(
        "Berhasil",
        `${idsToDelete.length} produk duplikat berhasil dihapus`,
        "success"
      );

      onRefetch();
    } catch (err) {
      console.error("Delete duplicate error:", err);

      console.log("DUPLICATE PRODUCTS:", products);

const groups: Record<string, any[]> = {};

products.forEach((p) => {
  const key = p.duplicate_group;

  if (!groups[key]) {
    groups[key] = [];
  }

  groups[key].push(p);
});

console.log("GROUPS:", groups);

const idsToDelete: string[] = [];

Object.values(groups).forEach((group) => {
  if (group.length <= 1) return;

  const sorted = group.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime()
  );

  const toDelete = sorted.slice(1);

  toDelete.forEach((p) => idsToDelete.push(p.id));
});

console.log("IDS TO DELETE:", idsToDelete);

      Swal.fire(
        "Error",
        "Terjadi kesalahan saat menghapus duplicate",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

return (
    <div className="overflow-hidden bg-white border border-gray-200 shadow rounded-2xl">
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          {/* ACTION BAR BULK DELETE TETAP SAMA */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 bg-red-50 border-b">
              <span className="text-sm text-red-700">
                {selectedIds.length} produk dipilih
              </span>

              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Hapus
              </button>
            </div>
          )}

        <table className="min-w-[900px] text-xs table-auto">
          <thead className="bg-white">
            <tr className="border-b">
              <th colSpan={10} className="px-4 py-3 bg-white">
                <div className="flex items-center justify-between">
                  
                  <div className="flex items-center gap-3"> {/* Container Alert */}
                    
                    {duplicateCount > 0 && (
                      <div className="flex items-center gap-2">
                        
                        <button
                          onClick={onToggleDuplicateFilter}
                          className={`group flex items-center gap-0 hover:gap-2 px-2 py-2 text-xs rounded-full transition-all duration-300 ${
                            showDuplicateOnly ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          <AlertCircle size={18} />
                          <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[200px]">
                            {duplicateCount} Duplicate Produk
                          </span>
                        </button>

                        <button
                          onClick={handleDeleteDuplicate}
                          disabled={isDeleting}
                          className="flex items-center gap-1 px-2 py-2 text-xs text-white bg-red-600 rounded-full hover:bg-red-700 disabled:opacity-50"
                          title="Hapus Duplicate"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    )}

                    {/* ALERT NO CATEGORY (Baru) */}
                    {noCategoryCount > 0 && (
                      <button
                        onClick={onToggleNoCategoryFilter}
                        className={`group flex items-center gap-0 hover:gap-2 px-2 py-2 text-xs rounded-full transition-all duration-300 ${
                          showNoCategoryOnly 
                            ? "bg-amber-600 text-white" 
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        <Tag size={18} />
                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[200px]">
                          {noCategoryCount} Belum Ada Kategori
                        </span>
                      </button>
                    )}
                  </div>

                  {/* SEARCH */}
                  <input
                    type="text"
                    placeholder="Cari..."
                    className="w-40 sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => onSearch(e.target.value)}
                  />
                  
                </div>
              </th>
            </tr>

            {/* Column Header */}
            <tr className="border-b bg-gray-50">
              <th className="px-3 py-2 text-center sticky left-0 bg-white z-10">
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
                  onInlineUpdate={handleInlineUpdate}
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
                      {[10, 30, 50, 100].map((num) => (
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