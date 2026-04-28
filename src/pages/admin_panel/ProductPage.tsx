import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // 🔥 1. Import Swal di sini
import {
  getAdminProducts,
  updateAdminProduct,
  createAdminProduct,
  getAdminProductById,
} from "../../services/adminProductService";

import { 
  createProductImages,
  updateProductImages,
  uploadProductImage,
} from "../../services/adminProductImageService";

import {
  getCategories,
} from "../../services/adminCategoryService";

import ProductTable from "../../components/admin/Product/ProductTable";
import ProductWizard from "../../components/admin/Product/ProductWizard";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 🔥 State successMessage dihapus karena udah pakai Swal
  
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [showDuplicateOnly, setShowDuplicateOnly] = useState(false);
  const [duplicateTotal, setDuplicateTotal] = useState(0);
  const [showNoCategoryOnly, setShowNoCategoryOnly] = useState(false);
  const [noCategoryTotal, setNoCategoryTotal] = useState(0);
  const noCategoryCount = noCategoryTotal;
  const duplicateCount = duplicateTotal;

  // ==========================================
  // STATE BARU UNTUK MENYIMPAN HASIL FILTER
  // ==========================================
  const [filterCategoryIds, setFilterCategoryIds] = useState<string[]>([]);
  const [filterBrandIds, setFilterBrandIds] = useState<string[]>([]);

  useEffect(() => {
    // Pastikan memanggil dengan parameter terbaru dari state filter
    fetchProducts(page, search, showDuplicateOnly, showNoCategoryOnly, filterCategoryIds, filterBrandIds);
  }, [page, limit, search, showDuplicateOnly, showNoCategoryOnly, filterCategoryIds, filterBrandIds]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await getCategories();

      if (Array.isArray(result)) {
        setCategories(result);
      }

      else if (Array.isArray(result?.data)) {
        setCategories(result.data);
      }

      else {
        setCategories([]);
      }

    } catch (err) {
      console.error("Gagal fetch kategori", err);
      setCategories([]);
    }
  };
  
  const fetchProducts = async (
    currentPage: number,
    searchQuery = search,
    onlyDuplicate = showDuplicateOnly,
    onlyNoCategory = showNoCategoryOnly,
    catIds = filterCategoryIds, 
    bndIds = filterBrandIds     
  ) => {
    try {
      const result = await getAdminProducts({
        page: currentPage,
        limit,
        search: searchQuery,
        only_duplicate: onlyDuplicate,
        only_no_category: onlyNoCategory, 
        // Backend menerima format string yang dipisah koma
        category_ids: catIds.length > 0 ? catIds.join(",") : undefined,
        brand: bndIds.length > 0 ? bndIds.join(",") : undefined,
      });

      setProducts(result.data);
      setTotal(result.total);
      setLastPage(result.last_page);
      setDuplicateTotal(result.duplicateTotal);
      setNoCategoryTotal(result.noCategoryTotal); 

    } catch (err) {
      console.error("Gagal fetch product", err);
    }
  };

  const handleToggle = async (
    id: string,
    field: "is_active" | "is_popular",
    currentValue: boolean
  ) => {
    try {
      await updateAdminProduct(id, {
        [field]: !currentValue,
      });

      fetchProducts(page, search, showDuplicateOnly, showNoCategoryOnly, filterCategoryIds, filterBrandIds);
    } catch (err) {
      console.error("Gagal update product", err);
    }
  };

  return (
  <div className="p-6 text-sm">
    
    {/* HEADER */}
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm font-bold text-black">
        Total Product: {total}
      </p>

      <button
        onClick={() => {
          setSelectedProduct(null);
          setIsModalOpen(true);
        }}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Buat Produk
      </button>
    </div>

        {/* TABEL */}
        <ProductTable
          products={products}
          total={total}
          page={page}
          lastPage={lastPage}
          limit={limit}
          duplicateCount={duplicateCount}
          showDuplicateOnly={showDuplicateOnly}
          onToggleDuplicateFilter={() => {
            setPage(1);
            setShowDuplicateOnly(prev => !prev);
          }}
          noCategoryCount={noCategoryCount}
          showNoCategoryOnly={showNoCategoryOnly}
          onToggleNoCategoryFilter={() => {
            setPage(1);
            setShowNoCategoryOnly(prev => !prev);
          }}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          onToggle={handleToggle}
          onEdit={async (product) => {
            try {
              const detail = await getAdminProductById(product.id); 

              setSelectedProduct(detail);
              setIsModalOpen(true);

            } catch (err) {
              console.error("Gagal fetch detail product", err);
            }
          }}
          onImageClick={setSelectedImage}
          onSearch={(query) => {
            setSearch(query);
            setPage(1);
          }}
          onRefetch={() => fetchProducts(page, search, showDuplicateOnly, showNoCategoryOnly, filterCategoryIds, filterBrandIds)} 
          
          // ==========================================
          // PASSING PROPS UNTUK FITUR FILTER
          // ==========================================
          availableCategories={categories}
          onFilterChange={(filters) => {
            setFilterCategoryIds(filters.category_ids);
            setFilterBrandIds(filters.brand_ids);
            setPage(1); // Reset ke halaman 1 setiap kali filter diubah
          }}
        />
        
        {isModalOpen && (
          <ProductWizard
            mode={selectedProduct ? "edit" : "create"}
            categories={categories}
            initialData={selectedProduct}
            onClose={() => setIsModalOpen(false)}
            onSubmit={async (data) => {
              try {
                const { images, ...productData } = data;

                // =========================
                // CREATE MODE
                // =========================
                if (!selectedProduct) {
                  const res = await createAdminProduct(productData);
                  const productId = res.product?.id || res.id;

                  // upload images
                  for (const img of images || []) {
                    if (img.file) {
                      const formData = new FormData();
                      formData.append("file", img.file);
                      formData.append("product_id", productId);

                      await uploadProductImage(formData);
                    }
                  }

                  // 🔥 2. Swal notification untuk Create
                  Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Product berhasil ditambahkan',
                    confirmButtonColor: '#2563EB', // Warna biru tailwind
                  });
                }

                // =========================
                // EDIT MODE
                // =========================
                else {
                  // Masukkan kembali `images` ke dalam payload update
                  const updatePayload = {
                    ...productData,
                    images: images.map((img: any) => ({
                      id: img.id,
                      sort_order: img.sort_order,
                    })),
                  };

                  // Kirim payload yang sudah lengkap ke backend
                  await updateAdminProduct(selectedProduct.id, updatePayload);

                  for (const img of images || []) {
                    // replace existing image
                    if (img.file && img.id) {
                      const formData = new FormData();
                      formData.append("file", img.file);

                      await updateProductImages(img.id, formData);
                    }

                    // new image
                    if (img.file && !img.id) {
                      const formData = new FormData();
                      formData.append("file", img.file);
                      formData.append("product_id", selectedProduct.id);

                      await uploadProductImage(formData);
                    }
                  }

                  // 🔥 3. Swal notification untuk Edit
                  Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Product berhasil diperbarui',
                    confirmButtonColor: '#2563EB',
                  });
                }

                setIsModalOpen(false);
                fetchProducts(page, search, showDuplicateOnly, showNoCategoryOnly, filterCategoryIds, filterBrandIds);

              } catch (err) {
                console.error("Gagal simpan product", err);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Terjadi kesalahan saat menyimpan produk!',
                  confirmButtonColor: '#EF4444', 
                });
              }
            }}
          />
        )}

        {products.length === 0 && (
          <p className="mt-4">Tidak ada produk</p>
        )}
        
        {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute text-2xl text-black top-2 right-2"
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}


      </div>
  );
}