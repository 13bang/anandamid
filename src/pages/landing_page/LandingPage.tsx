import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const getPaginationNumbers = () => {
  const maxVisible = 5; // jumlah nomor yang ditampilkan
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(currentPage - half, 1);
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - maxVisible + 1, 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

  const getFinalPrice = (product: any) => {
    const normal = Number(product.price_normal || 0);
    const discount = Number(product.price_discount || 0);
    return normal - discount;
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page = 1) => {
  try {
    setLoading(true);

    const res = await getProducts({
      page,
      limit: 12,
    });

    setProducts(res.data || []);
    setTotalPages(res.last_page || 1); // ✅ FIX DISINI
  } catch (err) {
    console.error("Gagal fetch products", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO */}
      <section className="px-6 py-20 text-center bg-white">
        <h1 className="mb-4 text-4xl font-bold">
          Alat Elektronik
        </h1>
        <p className="max-w-xl mx-auto text-gray-600">
          Alat Elektronik terlengkap di DIY
        </p>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-6 py-12 mx-auto max-w-7xl">
        
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada produk tersedia
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="overflow-hidden transition bg-white shadow-md cursor-pointer rounded-2xl hover:shadow-xl"
              >
                
                {/* IMAGE */}
                <div className="bg-gray-100 aspect-square">
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h3 className="mb-2 text-sm font-semibold line-clamp-2">
                    {product.name}
                  </h3>

                    <div>
                    {product.price_discount ? (
                        <>
                        <p className="text-sm text-gray-400 line-through">
                            Rp {Number(product.price_normal).toLocaleString()}
                        </p>
                        <p className="text-lg font-bold text-red-600">
                            Rp {(Number(product.price_normal) - Number(product.price_discount)).toLocaleString()}
                        </p>
                        </>
                    ) : (
                        <p className="text-lg font-bold text-red-600">
                        Rp {Number(product.price_normal).toLocaleString()}
                        </p>
                    )}
                    </div>
                </div>
              </div>
            ))}
            
          </div>
        )}
      </section>

        {/* PAGINATION */}
        <div className="flex items-center justify-center mt-10 space-x-2">

        {/* PREV BUTTON */}
        <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
            ←
        </button>

        {/* FIRST PAGE + DOTS */}
        {currentPage > 3 && (
            <>
            <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-2 bg-gray-200 rounded-lg"
            >
                1
            </button>
            <span>...</span>
            </>
        )}

        {/* MIDDLE PAGES */}
        {getPaginationNumbers().map((pageNumber) => (
            <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`px-3 py-2 rounded-lg ${
                currentPage === pageNumber
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
            >
            {pageNumber}
            </button>
        ))}

        {/* LAST PAGE + DOTS */}
        {currentPage < totalPages - 2 && (
            <>
            <span>...</span>
            <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-2 bg-gray-200 rounded-lg"
            >
                {totalPages}
            </button>
            </>
        )}

        {/* NEXT BUTTON */}
        <button
            onClick={() =>
            setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
            )
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
            →
        </button>
        </div>

    </div>
  );
}