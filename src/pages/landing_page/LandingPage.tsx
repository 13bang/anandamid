import { useEffect, useState, useRef, useCallback } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories, getParentCategories } from "../../services/adminCategoryService";
import { getBanners } from "../../services/bannerService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import LoadMoreButton from "../../components/LoadMoreButton";
import CategoryProductSection from "../../components/CategoryProductSection";
import GlassParticlesBackground from "../../components/GlassParticleBackground";

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
  }, [searchQuery, setSearchParams]);

  const [categories, setCategories] = useState<any[]>([]);

  const landingCategoryNames = [
    "Laptop",
    "Desktop PC",
    "PC AIO",
    "Prosesor",
    "Motherboard",
    "RAM",
    "SSD",
    "Hard Disk",
    "Monitor",
    "VGA / Graphic Card",
    "Keyboard & Mouse",
    "Printer & Scanner",
    "Modem & Router",
    "UPS & Stabilizer",
  ];

  const filteredCategories = landingCategoryNames
    .map((name) => categories.find((cat) => cat.name === name))
    .filter(Boolean);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategory = (direction: "left" | "right") => {
    if (!categoryScrollRef.current) return;

    const container = categoryScrollRef.current;

    // Ambil flex wrapper
    const flexWrapper = container.firstElementChild as HTMLElement;
    if (!flexWrapper) return;

    // Ambil card pertama
    const firstCard = flexWrapper.children[0] as HTMLElement;
    if (!firstCard) return;

    const gap = 8; // gap-2 = 0.5rem = 8px
    const cardWidth = firstCard.offsetWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const firstCard = container.children[0] as HTMLElement;
    if (!firstCard) return;

    const gap = 16; // karena kamu pakai gap-4 (1rem = 16px)
    const cardWidth = firstCard.offsetWidth + gap;

    container.scrollBy({
      left: -cardWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const firstCard = container.children[0] as HTMLElement;
    if (!firstCard) return;

    const gap = 16; // gap-4
    const cardWidth = firstCard.offsetWidth + gap;

    container.scrollBy({
      left: cardWidth,
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

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const [banners, setBanners] = useState<any[]>([]);

  const heroBanner = banners.find((b) => b.slot === "hero");
  // const bannerLeft = banners.find((b) => b.slot === "banner-after-kategori-left");
  // const bannerCenter = banners.find((b) => b.slot === "banner-after-kategori-center");
  // const bannerRight = banners.find((b) => b.slot === "banner-after-kategori-right");
  const bannerAfterKategori = banners.find((b) => b.slot === "banner-after-kategori");
  const bannerAfterPopularLeft = banners.find((b) => b.slot === "banner-after-popular-left");
  const bannerAfterPopularCenter = banners.find((b) => b.slot === "banner-after-popular-center");
  const bannerAfterPopularRight = banners.find((b) => b.slot === "banner-after-popular-right");

  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3030${url}`;
  };

  const handleLoadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchPopularProducts();
    fetchCategories();
    fetchBanners();
    fetchParentCategories();
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

  const [parentCategories, setParentCategories] = useState<any[]>([]);

  const fetchParentCategories = async () => {
    try {
      const data = await getParentCategories();
      setParentCategories(data || []);
    } catch (err) {
      console.error("Gagal fetch parent categories", err);
    }
  };

  const fetchProductsByParent = async (parentSlug: string) => {
    try {
      const res = await getProducts({
        parent: parentSlug,
        limit: 10,
      });

      return res.data || [];
    } catch (err) {
      console.error("Gagal fetch parent products", err);
      return [];
    }
  };

  const [parentProducts, setParentProducts] = useState<{
    [key: string]: any[];
  }>({});

  useEffect(() => {
    const fetchAllParentProducts = async () => {
      const result: any = {};

      for (const parent of parentCategories) {
        const products = await fetchProductsByParent(parent.code);
        result[parent.id] = products;
      }

      setParentProducts(result);
    };

    if (parentCategories.length > 0) {
      fetchAllParentProducts();
    }
  }, [parentCategories]);

  const SELECTED_PARENTS: Record<string, string> = {
    "Komputer & Laptop": "Kompputer & Laptop",
    "Komponen PC": "Kommponen PC",
    "Storage": "Storagge",
  };

  console.log("PARENT CATEGORIES:", parentCategories);

  return (
    <div className="min-h-screen">
      <GlassParticlesBackground />
      {/* ================= HERO BANNER ================= */}
      <section className="w-full">
        {heroBanner && (
          <div className="w-full">
            <img
              src={getImageUrl(heroBanner.image_url)}
              className="w-full h-auto object-cover"
              alt="Hero Banner"
            />
          </div>
        )}
      </section>

      {/* ================= CATEGORY ================= */}
      <section className="relative z-20 px-8 mx-auto -mt-2 sm:-mt-6 md:-mt-10 lg:-mt-12 w-full">
        <div className="relative p-6 bg-white shadow-xl rounded-3xl">
          <h2
            className="mb-6 text-4xl font-semibold font-stretchpro text-center
            bg-gradient-to-r from-gray-800 to-blue-700
            text-transparent bg-clip-text inline-block">
            Kaategori
          </h2>

          {/* BUTTON LEFT */}
          <button
            onClick={() => scrollCategory("left")}
            className="absolute -left-5 top-1/2 -translate-y-1/2 
                      z-20 p-3 bg-white shadow-md rounded-full 
                      hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>

          {/* BUTTON RIGHT */}
          <button
            onClick={() => scrollCategory("right")}
            className="absolute -right-5 top-1/2 -translate-y-1/2 
                      z-20 p-3 bg-white shadow-md rounded-full 
                      hover:bg-gray-100 transition"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={categoryScrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-2">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col items-center flex-shrink-0 
                            w-[calc((100%-3.5rem)/9)] cursor-pointer group"
                >
                  <div
                    className="w-24 h-24 rounded-xl overflow-hidden"
                  >
                    {cat.image_url ? (
                      <img
                        src={getImageUrl(cat.image_url)}
                        alt={cat.name}
                        className="w-full h-full object-cover 
                                  transition-transform duration-300 
                                  group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-lg font-semibold text-gray-500">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <span className="mt-3 text-sm text-center font-medium">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM PROMO BANNER ================= */}
      <section className="w-full px-8 pb-10 pt-10">
        <div className="flex justify-center">
          {(bannerAfterKategori) && (
            <div className="w-full max-w-[1600px] aspect-[8/3] overflow-hidden rounded-3xl shadow-lg">
              <img
                src={getImageUrl(bannerAfterKategori?.image_url)}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                alt="Promo Banner"
              />
            </div>
          )}
        </div>
      </section>

      {/* ================= POPULAR PRODUCT ================= */}
      <section className="w-full px-8 pb-10">
        <div
          className="
          relative p-6 rounded-3xl
          bg-primary5/40
          backdrop-blur-sm
          border border-white/90
          shadow-[0_0_25px_rgba(0,0,0,0.15)]
        "
        >
          <h2 
            className="mb-6 text-4xl font-semibold font-stretchpro text-center
            bg-gray-800
            text-transparent bg-clip-text inline-block">PProduk Populer
          </h2>
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
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          >
            {popularProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[calc((100%-5rem)/6)] snap-start py-4"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BANNER AFTER POPULAR ================= */}
      <section className="w-full px-8 pb-14 pt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {bannerAfterPopularLeft && (
            <div className="overflow-hidden shadow-md rounded-3xl group">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={getImageUrl(bannerAfterPopularLeft.image_url)}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  alt="Banner After Popular Left"
                />
              </div>
            </div>
          )}

          {bannerAfterPopularCenter && (
            <div className="overflow-hidden shadow-md rounded-3xl group">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={getImageUrl(bannerAfterPopularCenter.image_url)}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  alt="Banner After Popular Center"
                />
              </div>
            </div>
          )}

          {bannerAfterPopularRight && (
            <div className="overflow-hidden shadow-md rounded-3xl group">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={getImageUrl(bannerAfterPopularRight.image_url)}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  alt="Banner After Popular Right"
                />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ================= PARENT CATEGORY ================= */}
      {parentCategories
        .filter((parent) => SELECTED_PARENTS[parent.name])
        .map((parent) => (
          <CategoryProductSection
            key={parent.id}
            title={SELECTED_PARENTS[parent.name]}
            products={parentProducts[parent.id] || []}
          />
      ))}

      {/* ================= PRODUCT ================= */}
      <section className="w-full px-8 pb-10">

        <h2
          className="mb-6 text-4xl font-semibold font-stretchpro
                    bg-gray-800
                    text-transparent bg-clip-text
                    text-center">
          Rekomenddasi
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* ================= TARGET INFINITE SCROLL ================= */}
        <LoadMoreButton
          loading={loading}
          hasMore={currentPage < totalPages}
          onLoadMore={handleLoadMore}
        />

      </section>
    </div>
  );
}