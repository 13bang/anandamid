import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBrands } from "../services/brandService";

const getInitial = (brand: string) => {
  return brand
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function OfficialBrandSection() {
  const [brands, setBrands] = useState<any[]>([]);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

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

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector(".brand-card") as HTMLElement;
    if (!card) return;

    // Gap disesuaikan dengan gap-[10px] di JSX
    const gap = 10;
    const cardWidth = card.getBoundingClientRect().width;
    const step = cardWidth + gap;

    const current = Math.round(el.scrollLeft / step);
    const next = dir === "right" ? current + 1 : current - 1;

    el.scrollTo({
      left: next * step,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white mt-4 py-6 border-y border-gray-200">
      {/* Tambahkan 2xl:max-w-screen-2xl agar container melebar ke 1600px */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0">

        <h2 className="mb-6 text-xl sm:text-2xl md:text-3xl font-semibold font-cocogoose text-gray-800">
          Official Brand
        </h2>

        <div className="relative">

          {/* LEFT */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[100] p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>

          {/* RIGHT */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-[100] p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* SCROLL */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-[2px]"
          >
            <div className="flex gap-[10px] w-full">
              {brands.map((brand) => {
                const imagePath = brand.image_url;
                const hasError = imageError[brand.id];

                return (
                  <div
                    key={brand.id}
                    className="
                      brand-card shrink-0 h-[100px] sm:h-[120px] flex items-center justify-center 
                      bg-white border border-gray-200 rounded-md hover:shadow-sm transition
                      w-[140px] 
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
                        className="h-14 sm:h-20 max-w-[80%] object-contain"
                        onError={() =>
                          setImageError(prev => ({
                            ...prev,
                            [brand.id]: true
                          }))
                        }
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-700">
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