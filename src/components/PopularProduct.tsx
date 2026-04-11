import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

interface PopularProductSliderProps {
  popularProducts: any[];
}

export default function PopularProduct({ popularProducts }: PopularProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Fungsi kalkulasi jarak scroll
  const getScrollAmount = () => {
    if (!scrollRef.current) return 0;
    const card = scrollRef.current.querySelector(".product-slide") as HTMLElement;
    const gap = window.innerWidth >= 768 ? 24 : 16;
    return card ? card.offsetWidth + gap : 0;
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    if (container.scrollLeft <= 5) {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;
    if (isEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    }
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/product-katalog?sort=popular");
  };

  // Auto Slide Logic
  useEffect(() => {
    if (isHovered || popularProducts.length === 0) return;

    const interval = setInterval(() => {
      scrollRight();
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, popularProducts]);

  // Drag to Scroll Logic
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

  const handleMouseUp = () => { isDragging.current = false; };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (popularProducts.length === 0) return null;

  return (
    <section className="py-6 md:py-10 bg-white border-y border-gray-200 mt-4">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold font-cocogoose text-center bg-gray-800 text-transparent bg-clip-text inline-block mb-6">
            Produk Populer
          </h2>

          {/* BUTTON LEFT */}
          <button
            onClick={scrollLeft}
            className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-[100] 
            w-12 h-12 items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full text-gray-800 transition-all duration-500 ease-out
            ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}
            hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/20 active:scale-90`}
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          {/* BUTTON RIGHT */}
          <button
            onClick={scrollRight}
            className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-[100] 
            w-12 h-12 items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full text-gray-800 transition-all duration-500 ease-out
            ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}
            hover:bg-primary hover:text-white hover:scale-110 hover:shadow-primary/20 active:scale-90`}
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { isDragging.current = false; }}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          >
            {popularProducts.map((product) => (
                <div
                    key={product.id}
                    className="product-slide flex-shrink-0 snap-start py-4 select-none w-[47%] sm:w-[180px] md:w-[210px] lg:w-[230px] xl:w-[236px] 2xl:w-[246px]"
                >
                    <ProductCard product={product} />
                </div>
            ))}

            {/* CARD LIHAT SEMUA */}
            <div
              className="product-slide flex-shrink-0 snap-start py-4 select-none w-[47%] sm:w-[180px] md:w-[210px] lg:w-[230px] xl:w-[236px] 2xl:w-[246px]"
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
                  Jelajahi lebih banyak produk populer
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