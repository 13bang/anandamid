import { useEffect, useState, useRef } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/adminCategoryService";
import { getBanners } from "../../services/bannerService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeSearch, setActiveSearch] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    if (searchQuery !== null) {
      setActiveSearch(searchQuery);
      setSearchParams({}, { replace: true }); 
    }
  }, [searchQuery]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const fetchPopularProducts = async () => {
  try {
    const res = await getProducts({
      is_popular: true,
      limit: 10,
    });

    setPopularProducts(res.data || []);
  } catch (err) {
    console.error("Gagal fetch popular products", err);
  }
};

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  const heroBanner = banners.find(b => b.slot === "hero");
  const bannerLeft = banners.find(b => b.slot === "banner-after-kategori-left");
  const bannerCenter = banners.find(b => b.slot === "banner-after-kategori-center");
  const bannerRight = banners.find(b => b.slot === "banner-after-kategori-right");

  // const getFinalPrice = (product: any) => {
  //   const normal = Number(product.price_normal || 0);
  //   const discount = Number(product.price_discount || 0);
  //   return normal - discount;
  // };

  useEffect(() => {
    fetchPopularProducts();
    fetchCategories();
    fetchBanners();
  }, []);

  // reset ketika search berubah
useEffect(() => {
  setCurrentPage(1);
  setProducts([]);
}, [activeSearch]);

useEffect(() => {
  fetchProducts(currentPage);
}, [currentPage, activeSearch]);

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

    const params: any = {
      page,
      limit: 12,
    };

    if (activeSearch) {
      params.search = activeSearch;
    }

    const res = await getProducts(params);
    const newProducts = res.data || [];

    if (page === 1) {
      setProducts(newProducts);
    } else {
      setProducts((prev) => [...prev, ...newProducts]);
    }

    setTotalPages(res.last_page || 1);
  } catch (err) {
    console.error("Gagal fetch products", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white">

    {/* ================= HERO BANNER ================= */}
    <section className="w-full bg-primary py-8">
      <div className="px-10 mx-auto max-w-[1600px]">
        {heroBanner && (
          <div className="overflow-hidden rounded-md">
            <img
              src={`http://localhost:3000${heroBanner.image_url}`}
              className="object-cover w-full"
            />
          </div>
        )}
      </div>
    </section>

      {/* ================= CATEGORY ================= */}
      <section className="relative z-20 px-8 mx-auto -mt-2 sm:-mt-6 md:-mt-10 lg:-mt-12 w-full">
        <div className="p-5 bg-white shadow-xl rounded-md">
          <h2 className="mb-4 text-lg font-semibold">Kategori</h2>

          <div className="flex overflow-x-auto">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center min-w-[90px] cursor-pointer group"
              >
                <div className="flex items-center justify-center w-16 h-16 transition bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white">
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

      {/* ================= BOTTOM PROMO BANNERS ================= */}
      <section className="w-full px-8 pb-10 pt-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {bannerLeft && (
            <div className="aspect-[4/2] overflow-hidden">
              <img
                src={`http://localhost:3000${bannerLeft.image_url}`}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {bannerCenter && (
            <div className="aspect-[4/2] overflow-hidden">
              <img
                src={`http://localhost:3000${bannerCenter.image_url}`}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {bannerRight && (
            <div className="aspect-[4/2] overflow-hidden">
              <img
                src={`http://localhost:3000${bannerRight.image_url}`}
                className="object-cover w-full h-full"
              />
            </div>
          )}

        </div>
      </section>

      {/* ================= POPULAR PRODUCT ================= */}
      <section className="w-full px-8 pb-10">

        <div className="relative p-6 bg-white rounded-md shadow-[0_0_15px_rgba(0,0,0,0.1)]">
          
          <h2 className="mb-6 text-lg font-semibold">Produk Populer</h2>

          {/* BUTTON LEFT */}
          <button
            onClick={scrollLeft}
            className="absolute -left-5 top-1/2 -translate-y-1/2 
            z-20 p-3 bg-white shadow-md rounded-full 
            hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>

          {/* BUTTON RIGHT */}
          <button
            onClick={scrollRight}
            className="absolute -right-5 top-1/2 -translate-y-1/2 
            z-20 p-3 bg-white shadow-md rounded-full 
            hover:bg-gray-100 transition"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {popularProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[calc((100%-5rem)/6)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= PRODUCT ================= */}
      <section className="w-full px-8 pb-10">

        <h2 className="mb-4 text-lg font-semibold text-center border-b-4 border-b-blue-500 pb-2">
          Rekomendasi
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* BUTTON MUAT LEBIH BANYAK */}
        {currentPage < totalPages && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={loading}
              className="px-10 py-3 text-sm font-semibold text-blue-600 transition border-2 border-blue-600 rounded-md hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-blue-600 rounded-md animate-spin"></div>
                  Memuat...
                </div>
              ) : (
                "Muat Lebih Banyak"
              )}
            </button>
          </div>
        )}

      </section>

    </div>
  );
}