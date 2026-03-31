import { useEffect, useState } from "react";
import React from "react";
import Swal from "sweetalert2";

import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../services/brandService";

import BrandModalForm from "../../components/brandModalForm";

import { getProducts } from "../../services/productService";

import { assignProductsToBrand, removeProductFromBrand } from "../../services/productBrandService";

import {
  TrashIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function BrandSection() {
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editingBrand, setEditingBrand] = useState<any>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE}${url}`;
  };

  const fetchBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  const fetchProducts = async () => {
    const res = await getProducts({ limit: 1000 });
    setProducts(res.data);
  };

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  const openEditModal = (brand: any) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setSelectedProducts(brand.products?.map((p: any) => p.id) || []);
    setIsEditOpen(true);
  };

  return (
    <div className="mb-6">

      {/* HEADER */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg font-semibold"
        >
          + Tambah Brand
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-x-auto">
        <table className="min-w-full text-xs table-fixed">
          <thead className="text-gray-600 bg-gray-50">
            <tr>
              <th className="px-3 py-2 w-[80px]">Logo</th>
              <th className="px-3 py-2 text-left">Nama</th>
              <th className="px-3 py-2 text-center">Jumlah Produk</th>
              <th className="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((b) => (
                <React.Fragment key={b.id}>

                {/* PARENT */}
                <tr
                    className="bg-white border-t cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(b.id)}
                >
                <td className="px-3 py-2">
                    {b.image_url ? (
                        <img
                            src={getImageUrl(b.image_url)}
                            className="w-10 h-10 object-contain border rounded cursor-pointer hover:scale-105 transition"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                setPreviewImage(getImageUrl(b.image_url));
                            }}
                        />
                    ) : (
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                        N/A
                    </div>
                    )}
                </td>

                <td className="px-3 py-2 font-medium">{b.name}</td>

                <td className="px-3 py-2 text-center">
                    {b.products?.length || 0}
                </td>

                <td className="px-3 py-2">
                    <div className="flex justify-center gap-4">
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(b);
                        }}
                        className="flex items-center gap-1 text-primary font-semibold"
                    >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        Edit
                    </button>

                    <button
                        onClick={async (e) => {
                        e.stopPropagation();

                        const confirm = await Swal.fire({
                            title: "Hapus Brand?",
                            text: b.name,
                            icon: "warning",
                            showCancelButton: true,
                        });

                        if (confirm.isConfirmed) {
                            await deleteBrand(b.id);
                            fetchBrands();
                        }
                        }}
                        className="flex items-center gap-1 text-red-600"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Hapus
                    </button>
                    </div>
                </td>
                </tr>

                {/* CHILD PRODUCTS */}
                <tr>
                <td colSpan={4} className="p-0">
                    <div
                    className={`overflow-hidden transition-all ${
                        expandedIds.includes(b.id) ? "max-h-96" : "max-h-0"
                    }`}
                    >
                    <table className="w-full">
                        <tbody>
                        {b.products?.map((p: any) => (
                            <tr key={p.id} className="border-t">
                                <td className="w-[80px]"></td>

                                <td className="px-3 py-2 pl-8">
                                    └ {p.name}
                                </td>

                                <td className="text-center text-xs text-gray-400">
                                    produk
                                </td>

                                <td className="text-center">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();

                                            const confirm = await Swal.fire({
                                            title: "Hapus dari brand?",
                                            text: p.name,
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: "Ya, hapus",
                                            cancelButtonText: "Batal",
                                            });

                                            if (!confirm.isConfirmed) return;

                                            try {
                                            await removeProductFromBrand(p.id);

                                            await Swal.fire({
                                                icon: "success",
                                                title: "Berhasil",
                                                text: "Produk berhasil dilepas dari brand",
                                                timer: 1500,
                                                showConfirmButton: false,
                                            });

                                            fetchBrands();
                                            fetchProducts();
                                            } catch (err) {
                                            console.error(err);

                                            await Swal.fire({
                                                icon: "error",
                                                title: "Gagal",
                                                text: "Gagal menghapus produk dari brand",
                                            });
                                            }
                                        }}
                                        className="text-red-500 text-xs"
                                        >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </td>
                </tr>

            </React.Fragment>
            ))}
        </tbody>
        </table>
    </div>

        {/* MODAL CREATE */}
        {isCreateOpen && (
            <BrandModalForm
            title="Tambah Brand"
            brandName={brandName}
            setBrandName={setBrandName}
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            setImageFile={setImageFile}
            onClose={() => setIsCreateOpen(false)}
            onSubmit={async () => {
                const res = await createBrand({
                name: brandName,
                image: imageFile,
                });

                await assignProductsToBrand(res.data.id, selectedProducts);

                fetchBrands();
                fetchProducts();

                setIsCreateOpen(false);
                setBrandName("");
                setSelectedProducts([]);
                setImageFile(null);
            }}
            />
        )}

        {/* MODAL EDIT */}
        {isEditOpen && (
            <BrandModalForm
            title="Edit Brand"
            brandName={brandName}
            setBrandName={setBrandName}
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            setImageFile={setImageFile}
            onClose={() => setIsEditOpen(false)}
            onSubmit={async () => {
                await updateBrand(editingBrand.id, {
                name: brandName,
                image: imageFile,
                });

                await assignProductsToBrand(editingBrand.id, selectedProducts);

                fetchBrands();
                fetchProducts();

                setIsEditOpen(false);
            }}
            />
        )}

        {/* IMAGE PREVIEW MODAL */}
        {previewImage && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setPreviewImage(null)}
        >
            <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
            >
            <img
                src={previewImage}
                className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />

            {/* CLOSE BUTTON */}
            <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-3 -right-3 bg-white rounded-full px-2 py-1 text-xs shadow"
            >
                ✕
            </button>
            </div>
        </div>
        )}

    </div>
    
  );
}