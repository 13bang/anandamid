import { useEffect, useState } from "react";
import {
  getAdminProducts,
  updateAdminProduct,
} from "../services/adminProductService";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
//   const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (currentPage: number) => {
    try {
      const result = await getAdminProducts({
        page: currentPage,
        limit: 10,
      });


      setProducts(result.data);
    //   setTotal(result.total);
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

      fetchProducts(page); // refresh halaman sekarang
    } catch (err) {
      console.error("Gagal update product", err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold">Admin Product Dashboard</h1>
      {/* <p className="mb-6 text-sm text-gray-500">
        Total Product: {total}
      </p> */}

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="text-sm bg-gray-100">
            <tr>
              <th className="p-3 text-left">Gambar</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Harga Normal</th>
              <th className="p-3 text-left">Diskon</th>
              <th className="p-3 text-left">Harga Final</th>
              <th className="p-3 text-center">Aktif</th>
              <th className="p-3 text-center">Populer</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const finalPrice =
                product.price_normal -
                (product.price_discount ?? 0);

              return (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    <img
                      src="/images/product-placeholder.png"
                      alt="product"
                      className="object-cover w-16 h-16 rounded"
                    />
                  </td>

                  <td className="p-3 font-medium">
                    {product.name}
                  </td>

                  <td className="p-3">
                    Rp {Number(product.price_normal).toLocaleString()}
                  </td>

                  <td className="p-3">
                    Rp{" "}
                    {Number(product.price_discount ?? 0).toLocaleString()}
                  </td>

                  <td className="p-3 font-bold text-green-600">
                    Rp {Number(finalPrice).toLocaleString()}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(
                          product.id,
                          "is_active",
                          product.is_active
                        )
                      }
                      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                        product.is_active
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          product.is_active
                            ? "translate-x-6"
                            : ""
                        }`}
                      />
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(
                          product.id,
                          "is_popular",
                          product.is_popular
                        )
                      }
                      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                        product.is_popular
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          product.is_popular
                            ? "translate-x-6"
                            : ""
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="mt-4">Tidak ada produk</p>
        )}

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
