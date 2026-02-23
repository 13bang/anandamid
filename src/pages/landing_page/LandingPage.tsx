import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/adminCategoryService";
import { getBanners } from "../../services/bannerService";

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

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
    fetchCategories();
    fetchBanners();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (err) {
      console.error("Gagal fetch kategori", err);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      setBanners(res);
    } catch (err) {
      console.error("Gagal fetch banner", err);
    }
  };

  const fetchProducts = async (page = 1) => {
  try {
    setLoading(true);

    const res = await getProducts({
      page,
      limit: 12,
    });

    setProducts(res.data || []);
    setTotalPages(res.last_page || 1); 
  } catch (err) {
    console.error("Gagal fetch products", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= BANNER ================= */}
      <section className="px-6 pt-6 mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white shadow rounded-xl">
          {banners.length > 0 && (
            <img
              src={`http://localhost:3000${banners[0].image_url}`}
              alt="banner"
              className="object-cover w-full h-[350px]"
            />
          )}
        </div>
      </section>


      {/* ================= CATEGORY ================= */}
      <section className="px-6 py-6 mx-auto max-w-7xl">
        <div className="p-5 bg-white shadow rounded-xl">
          <h2 className="mb-4 text-lg font-semibold">Kategori</h2>

          <div className="flex gap-4 overflow-x-auto">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center min-w-[90px] cursor-pointer group"
              >
                <div className="flex items-center justify-center w-16 h-16 transition bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white">
                  {cat.name.charAt(0)}
                </div>
                <span className="mt-2 text-xs text-center">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= PRODUCT ================= */}
      <section className="px-6 pb-10 mx-auto max-w-7xl">

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="overflow-hidden transition bg-white shadow cursor-pointer rounded-xl hover:shadow-xl"
            >
              <div className="bg-gray-100 aspect-square">
                <img
                  src={product.thumbnail_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="p-3">
                <h3 className="mb-1 text-xs font-medium line-clamp-2">
                  {product.name}
                </h3>

                {product.price_discount ? (
                  <>
                    <p className="text-xs text-gray-400 line-through">
                      Rp {Number(product.price_normal).toLocaleString()}
                    </p>
                    <p className="text-sm font-bold text-red-600">
                      Rp {(Number(product.price_normal) - Number(product.price_discount)).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-red-600">
                    Rp {Number(product.price_normal).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}