  import { useEffect, useState } from "react";
  import {
    getAdminProducts,
    updateAdminProduct,
    createAdminProduct,
    getAdminProductById,
  } from "../../services/adminProductService";

  import { 
    createProductImages,
    deleteProductImage, 
  } from "../../services/adminProductImageService";

  import {
    getCategories,
  } from "../../services/adminCategoryService";

  import ProductTable from "../../components/admin/Product/ProductTable";
  import ProductWizard from "../../components/admin/Product/ProductWizard";

  export default function ProductPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [limit, setLimit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
      fetchProducts(page, search);
    }, [page, limit, search]);

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


    const fetchProducts = async (currentPage: number, searchQuery = "") => {
      try {
        const result = await getAdminProducts({
          page: currentPage,
          limit,
          search: searchQuery,
        });

        setProducts(result.data);
        setTotal(result.total);
        setLastPage(result.last_page);
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

        fetchProducts(page);
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
          Buat Product
        </button>
      </div>

          {/* TABEL */}
          <ProductTable
            products={products}
            total={total}
            page={page}
            lastPage={lastPage}
            limit={limit}
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
            onRefetch={() => fetchProducts(page, search)} 
          />
          
          {isModalOpen && (
            <ProductWizard
              mode={selectedProduct ? "edit" : "create"}
              categories={categories}
              initialData={selectedProduct}
              onClose={() => setIsModalOpen(false)}
              onSubmit={async (data) => {
                try {
                  const { image_urls, ...productData } = data;

                  // =========================
                  // CREATE MODE
                  // =========================
                  if (!selectedProduct) {
                    const product = await createAdminProduct(productData);

                    if (image_urls?.length > 0) {
                      await createProductImages({
                        product_id: product.id,
                        image_urls,
                      });
                    }

                    setSuccessMessage("Product berhasil ditambahkan");
                  }

                  // =========================
                  // EDIT MODE
                  // =========================
                  else {
                  await updateAdminProduct(selectedProduct.id, productData);

                  if (selectedProduct.images?.length > 0) {
                    for (const img of selectedProduct.images) {
                      await deleteProductImage(img.id);
                    }
                  }

                  if (image_urls?.length > 0) {
                    await createProductImages({
                      product_id: selectedProduct.id,
                      image_urls,
                    });
                  }

                  setSuccessMessage("Product berhasil diperbarui");
                }

                  setIsModalOpen(false);
                  fetchProducts(page, search);

                } catch (err) {
                  console.error("Gagal simpan product", err);
                }
              }}
            />
          )}

          {successMessage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setSuccessMessage(null)}
            >
              <div
                className="w-full max-w-sm p-6 bg-white shadow-lg rounded-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 text-lg font-semibold text-center">
                  {successMessage}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
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
              {/* Tombol Close */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute text-2xl text-black top-2 right-2"
              >
                ✕
              </button>

              {/* Gambar Besar */}
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
