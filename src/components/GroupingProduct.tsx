import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroupings } from "../services/groupingService";
import { getProducts } from "../services/productService";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function GroupingProductSlider() {
  const [groupings, setGroupings] = useState<any[]>([]);

  const allowedGroupingNames = ["Gaming", "Dekstop & PC", "Laptop"];

  useEffect(() => {
    fetchGroupings();
  }, []);

  const fetchGroupings = async () => {
    try {
      const res = await getGroupings();

      const filtered = res.filter((g: any) =>
        allowedGroupingNames.includes(g.name)
      );

      // ambil produk per grouping
      const result = await Promise.all(
        filtered.map(async (group: any) => {
          const categoryIds = group.children.map((c: any) => c.id);

          const productsRes = await getProducts({
            category_ids: categoryIds.join(","),
            limit: 10,
          });

          return {
            ...group,
            products: productsRes.data || [],
          };
        })
      );

      setGroupings(result);
    } catch (err) {
      console.error("Gagal fetch grouping", err);
    }
  };

  return (
    <>
      {groupings.map((group) => (
        <SliderSection key={group.id} title={group.name} products={group.products} />
      ))}
    </>
  );
}

/* ================= SLIDER PER GROUP ================= */
function SliderSection({ title, products }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product-grouping?grouping=${encodeURIComponent(title)}`);
  };

  // Dinamis: Ambil ukuran geser 1 card beserta gap-nya
  const getScrollAmount = () => {
    if (!scrollRef.current) return 0;
    const card = scrollRef.current.querySelector(".product-slide") as HTMLElement;
    // gap-4 = 16px (mobile), md:gap-6 = 24px (desktop)
    const gap = window.innerWidth >= 768 ? 24 : 16; 
    return card ? card.offsetWidth + gap : 0;
  };

  const scrollLeftAction = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    const isStart = container.scrollLeft <= 5;

    if (isStart) {
      // Kalau di paling kiri → lompat ke kanan
      container.scrollTo({
        left: container.scrollWidth,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    }
  };

  const scrollRightAction = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    const isEnd =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 5;

    if (isEnd) {
      // Kalau di paling kanan → balik ke kiri
      container.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    }
  };

  // Efek untuk Auto-Slide
  useEffect(() => {
    if (isHovered) return; // Berhenti sementara kalau lagi di-hover

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;

      // Cek apakah sudah mentok paling kanan (dikasih toleransi 5px untuk pembulatan pixel)
      const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;

      if (isEnd) {
        // Balik ke kiri (awal)
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Lanjut geser 1 card ke kanan
        container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
      }
    }, 3000); // <-- Auto slide tiap 3 detik

    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className="py-6 md:py-10 bg-white border-y border-gray-200 mt-4">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0">
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-left mb-4">
            {title}
          </h2>

          {/* LEFT BUTTON */}
          <button
            onClick={scrollLeftAction}
            className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-[100] 
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
            onClick={scrollRightAction}
            className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-[100] 
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

          {/* SLIDER CONTAINER */}
          <div
            ref={scrollRef}
            className="
              flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide
              scroll-smooth snap-x snap-mandatory pb-4
            "
          >
            {/* DAFTAR PRODUK */}
            {products.map((product: any) => (
              <div
                key={product.id}
                className="
                  product-slide flex-shrink-0 snap-start
                  w-[calc(50%-8px)]     /* <-- Ngepas 2 card di Mobile */
                  sm:w-[180px]
                  md:w-[210px]
                  lg:w-[230px]
                  xl:w-[236px]
                  2xl:w-[246px] 
                "
              >
                <ProductCard product={product} />
              </div>
            ))}

            {/* CARD LIHAT SEMUA (DESAIN BEDA) */}
            <div
              className="
                product-slide flex-shrink-0 snap-start
                w-[calc(50%-8px)]
                sm:w-[180px]
                md:w-[210px]
                lg:w-[230px]
                xl:w-[236px]
                2xl:w-[246px] 
              "
            >
              <div
                onClick={handleNavigate}
                className="h-full min-h-[280px] bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100 flex flex-col items-center justify-center p-4 md:p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
              >
                
                {/* ICON */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-md flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ArrowRight size={26} />
                </div>

                {/* TITLE */}
                <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                  Lihat Semua
                </h3>

                {/* DESC */}
                <p className="text-xs md:text-sm text-gray-500 mb-4 line-clamp-2">
                  Jelajahi lebih banyak produk promo {title}
                </p>

                {/* BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate();
                  }}
                  className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-full w-full mt-auto transition-all duration-300 hover:bg-white hover:text-black border border-primary"
                >
                  Eksplor
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}