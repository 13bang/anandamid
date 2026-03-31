import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories } from "../../services/adminCategoryService";
import { getBanners } from "../../services/bannerService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import LoadMoreButton from "../../components/LoadMoreButton";
import CategoryProductSection from "../../components/CategoryProductSection";
import GlassParticlesBackground from "../../components/GlassParticleBackground";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import LandingCategorySection from "../../components/LandingCategorySection";
import { OfficialBrandSection } from "../../components/OfficialBrand";
import { getGroupings } from "../../services/groupingService";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}

export default function LandingPage() {
  const scrollPositionRef = useRef(0);
  const shouldRestoreScroll = useRef(false);
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

  const scrollLeft = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const card = container.querySelector(".product-slide") as HTMLElement;

    if (!card) return;

    const gap = 16;
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: -cardWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const card = container.querySelector(".product-slide") as HTMLElement;

    if (!card) return;

    const gap = 16; // gap-4
    const cardWidth = card.offsetWidth + gap;

    container.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    });
  };

  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [searchProducts, setSearchProducts] = useState<any[]>([]);
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

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    isDragging.current = true;

    startX.current = e.clientX;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;

    const walk = (e.clientX - startX.current) * 1.5;

    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const isMobile = useIsMobile();
  const [banners, setBanners] = useState<any[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const heroBanners = banners.filter((b) => b.slot === "hero");
  const bannerPromoMobile = banners.find((b) => b.slot === "banner-after-category-mobile")
  const bannerPromoDesktop = banners.find((b) => b.slot === "banner-after-category")

  // const bannerAfterKategori = banners.find((b) => b.slot === "banner-after-kategori");
  // const bannerAfterPopularLeft = banners.find((b) => b.slot === "banner-after-popular-left");
  const bannerAfterPopularCenters = banners.filter(
    (b) => b.slot === "banner-after-popular-center"
  );
  // const bannerAfterPopularRight = banners.find((b) => b.slot === "banner-after-popular-right");
  // const bannerAfterPopularMobileTop = banners.find((b) => b.slot === "banner-after-popular-mobile-top");
  // const bannerAfterPopularMobileBottom = banners.find((b) => b.slot === "banner-after-popular-mobile-bottom");

  const [currentHero, setCurrentHero] = useState(0);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);

    if (heroBanners.length <= 1) return;

    autoSlideRef.current = setInterval(() => {
      setCurrentHero((prev) => prev + 1);
    }, 4000);
  };

  useEffect(() => {
    startAutoSlide();

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [heroBanners]);

  const nextHero = () => {
    setCurrentHero((prev) => (prev + 1) % heroBanners.length);
    startAutoSlide(); // reset timer
  };

  const prevHero = () => {
    setCurrentHero(
      (prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1)
    );
    startAutoSlide(); // reset timer
  };

  useEffect(() => {
    if (currentHero === heroBanners.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentHero(0);
      }, 700);
    } else {
      setIsTransitioning(true);
    }
  }, [currentHero]);

  // 1. Array untuk render
  const displayBanners = useMemo(() => {
    if (bannerAfterPopularCenters.length > 1) {
      return [
        bannerAfterPopularCenters[bannerAfterPopularCenters.length - 1],
        ...bannerAfterPopularCenters,
        bannerAfterPopularCenters[0]
      ];
    }
    return bannerAfterPopularCenters;
  }, [bannerAfterPopularCenters]);

  // 2. State & Ref
  const [currentCenter, setCurrentCenter] = useState(1);
  const [isCenterTransitioning, setIsCenterTransitioning] = useState(true);
  const autoCenterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 3. Fungsi Navigasi
  const moveCenter = useCallback((index: number) => {
    setIsCenterTransitioning(true);
    setCurrentCenter(index);
  }, []);

  // 4. Logic Auto Slide
  const stopCenterAutoSlide = useCallback(() => {
    if (autoCenterRef.current) {
      clearInterval(autoCenterRef.current);
      autoCenterRef.current = null;
    }
  }, []);

  const startCenterAutoSlide = useCallback(() => {
    stopCenterAutoSlide();
    if (bannerAfterPopularCenters.length <= 1) return;

    autoCenterRef.current = setInterval(() => {
      moveCenter(currentCenter + 1);
    }, 4000);
  }, [currentCenter, bannerAfterPopularCenters.length, moveCenter, stopCenterAutoSlide]);

  useEffect(() => {
    startCenterAutoSlide();
    return () => stopCenterAutoSlide();
  }, [startCenterAutoSlide, stopCenterAutoSlide]);

  // 5. Logika Teleportasi
  useEffect(() => {
    if (bannerAfterPopularCenters.length <= 1) return;

    if (currentCenter === displayBanners.length - 1) {
      const timer = setTimeout(() => {
        setIsCenterTransitioning(false);
        setCurrentCenter(1);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (currentCenter === 0) {
      const timer = setTimeout(() => {
        setIsCenterTransitioning(false);
        setCurrentCenter(displayBanners.length - 2);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentCenter, displayBanners.length, bannerAfterPopularCenters.length]);

  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE}${url}`;
  };

  const handleLoadMore = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
    shouldRestoreScroll.current = true;

    setCurrentPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!shouldRestoreScroll.current) return;

    window.scrollTo({
      top: scrollPositionRef.current,
    });

    shouldRestoreScroll.current = false;
  }, [products]);

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

  useEffect(() => {
    const stopDragging = () => {
      isDragging.current = false;
    };

    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
    };
  }, []);

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
      setBanners(res || []);
    } catch (err) {
      console.error("Gagal fetch banner", err);
    } finally {
      setLoadingBanners(false);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const params: any = {
        page,
        limit: isMobile ? 16 : 15,
        sort: 'recommend', 
      };

      if (activeSearch) {
        params.search = activeSearch;
        delete params.sort; 
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

  const displayedProducts =
    currentPage === 1
      ? isMobile
        ? products.slice(0, 16)
        : products.slice(0, 15)
      : products;

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

  const [groupings, setGroupings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getGroupings();
      console.log("GROUPINGS API:", data);
      setGroupings(data);
    };

    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* ================= HERO BANNER ================= */}
      <section className="w-full bg-white">

        {loadingBanners ? (

          <div className="w-full aspect-[16/5] shimmer"></div>

        ) : heroBanners.length > 0 && (

          <div className="relative w-full overflow-hidden group">

            <div className="relative w-full aspect-[16/5] overflow-hidden">

              {/* SLIDER TRACK */}
              <div
                className="flex w-full h-full"
                style={{
                  transform: `translateX(-${currentHero * 100}%)`,
                  transition: isTransitioning ? "transform 700ms ease-in-out" : "none"
                }}
              >
                {[...heroBanners, heroBanners[0]].map((banner, i) => (
                  <img
                    key={i}
                    src={getImageUrl(banner.image_url)}
                    className="w-full h-full flex-shrink-0 object-cover object-top"
                    alt="Hero Banner"
                  />
                ))}
              </div>

              {/* CHEVRON LEFT */}
              <button
                onClick={prevHero}
                className="
                  absolute left-3 md:left-6 top-1/2 -translate-y-1/2
                  bg-black/40 hover:bg-black/60
                  text-white
                  p-2 md:p-3
                  rounded-full backdrop-blur
                  transition-all duration-300
                  opacity-0 -translate-x-4
                  group-hover:opacity-100 group-hover:translate-x-0
                "
              >
                <ChevronLeft size={20} className="md:w-[26px] md:h-[26px]" />
              </button>

              {/* CHEVRON RIGHT */}
              <button
                onClick={nextHero}
                className="
                  absolute right-3 md:right-6 top-1/2 -translate-y-1/2
                  bg-black/40 hover:bg-black/60
                  text-white
                  p-2 md:p-3
                  rounded-full backdrop-blur
                  transition-all duration-300
                  opacity-0 translate-x-4
                  group-hover:opacity-100 group-hover:translate-x-0
                "
              >
                <ChevronRight size={20} className="md:w-[26px] md:h-[26px]" />
              </button>

            </div>

          </div>

        )}

      </section>

      {/* ================= CATEGORY ================= */}
      <LandingCategorySection
        groupings={groupings}
        getImageUrl={getImageUrl}
      />

      {/* ================= PROMO BANNER ================= */}
      {/* <section className="w-full bg-white py-8 border-gray-200 border-b-[1px]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0"> */}

          {/* DESKTOP / TABLET */}
          {/* {bannerPromoDesktop && (
            <div className="hidden sm:block overflow-hidden">
              <img
                src={getImageUrl(bannerPromoDesktop.image_url)}
                className="w-full h-auto object-cover"
                alt="Promo Banner"
              />
            </div>
          )} */}

          {/* MOBILE */}
          {/* {bannerPromoMobile && (
            <div className="sm:hidden overflow-hidden">
              <img
                src={getImageUrl(bannerPromoMobile.image_url)}
                className="w-full h-auto object-cover"
                alt="Promo Banner Mobile"
              />
            </div>
          )}
        </div>
      </section> */}

      {/* ================= BANNER BRAND ================= */}
      <section className="w-full pb-10 pt-10 bg-white border-gray-200 border-b-[1px] relative overflow-hidden"> 
        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-6xl">

            {/* VIEWPORT */}
            <div className="overflow-hidden w-full">
              <div
                className="flex"
                style={{
                  transition: isCenterTransitioning ? "transform 500ms ease-in-out" : "none",
                  transform: `translateX(calc(-${currentCenter * 70}% + 15%))`
                }}
              >
                {displayBanners.map((banner, i) => {
                  const isActive = i === currentCenter;

                  return (
                    <div key={`${banner.id}-${i}`} className="flex-shrink-0 w-[70%] px-2 sm:px-4">
                      <div 
                        className={`
                          w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[416px] 
                          rounded-md overflow-hidden shadow-lg 
                          ${isCenterTransitioning ? "transition-all duration-500" : "transition-none"}
                          ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-40"} 
                        `}
                      >
                        <img
                          src={getImageUrl(banner.image_url)}
                          className="w-full h-full object-cover"
                          alt="Banner"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BUTTONS */}
            {bannerAfterPopularCenters.length > 1 && (
              <>
                <button
                  onClick={() => moveCenter(currentCenter - 1)} 
                  className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-md transition-all"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={() => moveCenter(currentCenter + 1)}
                  className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-md transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

          </div>
        </div>
      </section>

      {/* ================= POPULAR PRODUCT ================= */}
      <section className="py-6 md:py-10 bg-white border-y border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">

          <div className="relative">

            <h2
              className="text-xl md:text-3xl lg:text-4xl font-semibold font-cocogoose text-center
              bg-gray-800 text-transparent bg-clip-text inline-block"
            >
              Produk Populer
            </h2>

            {/* BUTTON LEFT */}
            <button
              onClick={scrollLeft}
              className="
              hidden md:flex
              absolute left-1 md:-left-5 top-1/2 -translate-y-1/2 
              z-[100] p-3 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft size={20} />
            </button>

            {/* BUTTON RIGHT */}
            <button
              onClick={scrollRight}
              className="
              hidden md:flex
              absolute right-1 md:-right-5 top-1/2 -translate-y-1/2 
              z-[100] p-3 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
            >
              <ChevronRight size={20} />
            </button>

            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="
              flex gap-6 overflow-x-auto scrollbar-hide
              scroll-smooth snap-x snap-mandatory
              cursor-grab active:cursor-grabbing
              "
            >
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="
                  product-slide
                  flex-shrink-0 snap-start py-4 select-none
                  w-[47%]
                  sm:w-[180px]
                  md:w-[210px]
                  lg:w-[230px]
                  xl:w-[236px]
                  "
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <OfficialBrandSection />

      {/* ================= PRODUCT ================= */}
      <section className="w-full bg-white mt-4 border-gray-200 border-y pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pb-10">

          <h2
            className="mb-6 text-2xl md:text-3xl lg:text-4xl 
                      font-semibold font-cocogoose
                      bg-gray-800
                      text-transparent bg-clip-text
                      text-center">
            Rekomendasi
          </h2>

          <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-5
          gap-3 sm:gap-4
          ">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {loading &&
              Array.from({ length: isMobile ? 16 : 15 }).map((_, i) => (
                <ProductCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {/* ================= TARGET INFINITE SCROLL ================= */}
          <LoadMoreButton
            loading={loading}
            hasMore={currentPage < totalPages}
            onLoadMore={handleLoadMore}
          />
        </div>
      </section>
    </div>
  );
}