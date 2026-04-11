import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBrands } from "../services/brandService";
import { useNavigate } from "react-router-dom";

const getInitial = (brand: string) => {
  return brand
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function OfficialBrandSection() {
  const navigate = useNavigate(); 
  const [brands, setBrands] = useState<any[]>([]);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };

    fetchBrands();
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector(".brand-card") as HTMLElement;
    if (!card) return;

    const gap = 10;
    // Tetap pakai getBoundingClientRect untuk menangkap koma/desimal
    const step = card.getBoundingClientRect().width + gap;
    
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const currentScroll = el.scrollLeft;
    
    const isAtEnd = Math.ceil(currentScroll) >= maxScrollLeft - 5; 
    const isAtStart = currentScroll <= 5;

    // Menghitung index kartu yang sedang aktif saat ini
    const currentIndex = Math.round(currentScroll / step);

    if (dir === "right") {
      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Melompat presisi ke posisi absolut index berikutnya
        el.scrollTo({ left: (currentIndex + 1) * step, behavior: "smooth" });
      }
    } else {
      if (isAtStart) {
        el.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        // Melompat presisi ke posisi absolut index sebelumnya
        el.scrollTo({ left: (currentIndex - 1) * step, behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    if (brands.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      scroll("right");
    }, 3000);

    return () => clearInterval(timer);
  }, [brands.length, isHovered, scroll]);

  return (
    <section className="w-full bg-white mt-4 py-6 border-y border-gray-200">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0">
        <h2 className="mb-6 text-xl sm:text-2xl md:text-3xl font-semibold font-cocogoose text-gray-800">
          Official Brand
        </h2>

        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* LEFT */}
          <button
            onClick={() => scroll("left")}
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

          {/* RIGHT */}
          <button
            onClick={() => scroll("right")}
            className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-[100] 
            w-12 h-12 items-center justify-center 
            bg-white/80 backdrop-blur-md border border-gray-200 
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
            rounded-full text-gray-800 
            transition-all duration-500 ease-out
            ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}
            hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/20 active:scale-90`}
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          {/* SCROLL CONTAINER: Ditambah snap-x dan snap-mandatory */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-[2px] snap-x snap-mandatory"
          >
            <div className="flex gap-[10px] w-full">
              {brands.map((brand) => {
                const imagePath = brand.image_url;
                const hasError = imageError[brand.id];

                return (
                  <div
                    key={brand.id}
                    onClick={() => navigate(`/product-katalog?brand=${brand.id}`)}
                    className="
                      brand-card snap-start shrink-0 h-[100px] sm:h-[120px] flex items-center justify-center 
                      bg-white border border-gray-200 rounded-md hover:shadow-sm transition
                      cursor-pointer
                      w-[calc((100%-10px)/2)]
                      sm:w-[calc((100%-20px)/3)]
                      lg:w-[calc((100%-30px)/4)]
                      2xl:w-[calc((100%-40px)/5)]
                    "
                  >
                    {imagePath && !hasError ? (
                      <img
                        src={
                          imagePath.startsWith("http")
                            ? imagePath
                            : `${import.meta.env.VITE_API_BASE}${imagePath}`
                        }
                        alt={brand.name}
                        className="h-14 sm:h-20 max-w-[80%] object-contain pointer-events-none"
                        onError={() =>
                          setImageError(prev => ({
                            ...prev,
                            [brand.id]: true
                          }))
                        }
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-700 pointer-events-none">
                        <div className="text-lg font-bold">
                          {getInitial(brand.name)}
                        </div>
                        <div className="text-[10px] opacity-70 text-center px-1">
                          {brand.name}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}