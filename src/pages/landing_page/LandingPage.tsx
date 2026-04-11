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
import GroupingProductSlider from "../../components/GroupingProduct";
import PopularProduct from "../../components/PopularProduct";
import { getTikTokLiveStatus } from "../../services/tiktokService";

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

    // Ubah gap jadi 24 karena menggunakan gap-6
    const gap = 24; 
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

    // Ubah gap jadi 24 karena menggunakan gap-6
    const gap = 24; 
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

  const [isHovered, setIsHovered] = useState(false);

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
      setGroupings(data);
    };

    fetch();
  }, []);

  const [showLiveModal, setShowLiveModal] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const isDraggingModal = useRef(false);
  const hasDragged = useRef(false); 
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDownModal = (e: React.MouseEvent) => {
    if (!modalRef.current) return;

    isDraggingModal.current = true;
    hasDragged.current = false; 

    const rect = modalRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMoveModal = (e: MouseEvent) => {
    if (!isDraggingModal.current || !modalRef.current) return;

    hasDragged.current = true; 

    modalRef.current.style.left = `${e.clientX - offset.current.x}px`;
    modalRef.current.style.top = `${e.clientY - offset.current.y}px`;
  };

  const handleMouseUpModal = () => {
    isDraggingModal.current = false;
    setTimeout(() => {
      hasDragged.current = false;
    }, 50);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMoveModal);
    window.addEventListener("mouseup", handleMouseUpModal);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveModal);
      window.removeEventListener("mouseup", handleMouseUpModal);
    };
  }, []);

  const handleLiveClick = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault(); 
    }
  };

  // State untuk status live sesungguhnya
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkTikTokLiveStatus = async () => {
      try {
        const res = await getTikTokLiveStatus();
        setIsLive(res.is_live);
      } catch (err) {
        console.error("Gagal cek status live:", err);
        setIsLive(false);
      }
    };

    checkTikTokLiveStatus();

    const interval = setInterval(checkTikTokLiveStatus, 10000);

    return () => clearInterval(interval);
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
          {/* Ubah max-w-6xl menjadi 2xl:max-w-screen-2xl agar bisa melebar sampai 1600px */}
          <div 
            className="relative w-full max-w-7xl 2xl:max-w-screen-2xl group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            {/* VIEWPORT */}
            <div className="overflow-hidden w-full">
              <div
                className="flex"
                style={{
                  transition: isCenterTransitioning ? "transform 500ms ease-in-out" : "none",
                  /* Kalkulasi di bawah disesuaikan:
                    - Mobile/Tablet: Slide lebar 70%, offset 15% agar center.
                    - Desktop (2xl): Slide tetap 80%, offset 10% agar lebih penuh ke samping.
                  */
                  transform: isMobile 
                    ? `translateX(calc(-${currentCenter * 70}% + 15%))` 
                    : `translateX(calc(-${currentCenter * 80}% + 10%))`
                }}
              >
                {displayBanners.map((banner, i) => {
                  const isActive = i === currentCenter;

                  return (
                    /* Lebar div pembungkus diperbesar dari 70% ke 80% untuk Desktop */
                    <div key={`${banner.id}-${i}`} className="flex-shrink-0 w-[70%] md:w-[80%] px-2 sm:px-4">
                      <div 
                        className={`
                          /* Tinggi banner ditingkatkan untuk layar 2xl */
                          w-full h-[180px] sm:h-[240px] md:h-[350px] lg:h-[450px] 2xl:h-[550px]
                          rounded-xl overflow-hidden shadow-lg 
                          ${isCenterTransitioning ? "transition-all duration-500" : "transition-none"}
                          ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-40"} 
                        `}
                      >
                        <img
                          src={getImageUrl(banner.image_url)}
                          className="w-full h-full object-cover"
                          alt="Banner Brand"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BUTTONS - Disesuaikan posisinya agar tidak tertutup gambar yang membesar */}
            {bannerAfterPopularCenters.length > 1 && (
              <>
                {/* LEFT BUTTON */}
                <button
                  onClick={() => moveCenter(currentCenter - 1)}
                  className={`hidden md:flex absolute left-4 2xl:left-10 top-1/2 -translate-y-1/2 z-[100] 
                  w-12 h-12 items-center justify-center 
                  bg-white/80 backdrop-blur-md border border-gray-200 
                  shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                  rounded-full text-gray-800 
                  transition-all duration-500 ease-out
                  ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}
                  hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/20 active:scale-90`}
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>

                {/* RIGHT BUTTON */}
                <button
                  onClick={() => moveCenter(currentCenter + 1)}
                  className={`hidden md:flex absolute right-4 2xl:right-10 top-1/2 -translate-y-1/2 z-[100] 
                  w-12 h-12 items-center justify-center 
                  bg-white/80 backdrop-blur-md border border-gray-200 
                  shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                  rounded-full text-gray-800 
                  transition-all duration-500 ease-out
                  ${isHovered ? "opacity-100 translate-x-0 delay-75" : "opacity-0 translate-x-12"}
                  hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/20 active:scale-90`}
                >
                  <ChevronRight size={24} strokeWidth={2.5} />
                </button>
              </>
            )}

          </div>
        </div>
      </section>

      <PopularProduct popularProducts={popularProducts} />

      <OfficialBrandSection />

      <GroupingProductSlider/>

      {/* ================= PRODUCT ================= */}
      <section className="w-full bg-white mt-4 border-gray-200 border-y pt-6">
        {/* Ubah max-w-7xl jadi bisa melar ke screen-2xl (1536px) di layar gede */}
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0 pb-10">

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
          2xl:grid-cols-6 
          gap-3 sm:gap-4
          ">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {loading &&
              // Update skeleton limitnya juga biar rapi
              Array.from({ length: isMobile ? 16 : 18 }).map((_, i) => (
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

      {/* Modal Tiktok */}
      {showLiveModal && isLive && (
        <div
          ref={modalRef}
          onMouseDown={handleMouseDownModal}
          className="
            fixed z-[9999]
            w-[220px] sm:w-[260px]
            bg-black rounded-xl overflow-hidden shadow-2xl
            cursor-move
          "
          style={{
            top: "100px",
            left: "20px",
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Biar gak memicu klik ke parent
              setShowLiveModal(false);
            }}
            className="absolute top-1 right-1 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded"
          >
            ✕
          </button>

          {/* CONTENT */}
          <a
            href="https://www.tiktok.com/@anandamidstore/live" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLiveClick}
            className="select-none block" 
            draggable="false" 
          >
            <div className="relative pointer-events-none">
              <img
                src="/public/tiktoklive.svg"
                className="w-full h-[140px] object-cover"
                alt="Live Thumbnail"
              />

              {/* LIVE BADGE */}
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                LIVE
              </div>

            </div>

            <div className="p-2 text-white text-sm pointer-events-none">
              🔴 Live sekarang di TikTok
            </div>
          </a>
        </div>
      )}

    </div>
  );
}