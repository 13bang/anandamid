import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroupings } from "../services/groupingService";
import { getProducts } from "../services/productService";
import ProductCard from "./ProductCard"; // Pastikan path ini benar
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function GroupingProductSlider() {
  const [groupings, setGroupings] = useState<any[]>([]);

  useEffect(() => {
    fetchGroupings();
  }, []);

  const fetchGroupings = async () => {
    try {
      const allGroupings = await getGroupings();

      // Helper untuk ngambil ID kategori berdasarkan nama grouping
      const getGroupCatIds = (groupName: string) => {
        const group = allGroupings.find((g: any) => g.name === groupName);
        return group ? group.children.map((c: any) => c.id) : [];
      };

      // Helper untuk nyari ID kategori spesifik (kayak SSD & HDD)
      const getCatIdByName = (catName: string) => {
        for (const g of allGroupings) {
          const cat = g.children.find((c: any) => c.name === catName);
          if (cat) return cat.id;
        }
        return null;
      };

      const ssdId = getCatIdByName("SSD");
      const hddId = getCatIdByName("HDD");

      const komponenPeripheralIds = [
        ...getGroupCatIds("Komponen Komputer"),
        ...getGroupCatIds("Peripheral & I/O"),
        ssdId,
        hddId,
      ].filter(Boolean); 

      const sectionsData = [
        {
          id: "komponen",
          title: "Komponen & Peripheral",
          queryGroup: "Komponen & Peripheral", 
          catIds: [...new Set(komponenPeripheralIds)], 
        },
        {
          id: "monitor",
          title: "Monitor Display",
          queryGroup: "Monitor & Display",
          catIds: getGroupCatIds("Monitor & Display"),
        },
        {
          id: "laptop",
          title: "Laptop",
          queryGroup: "Laptop",
          catIds: getGroupCatIds("Laptop"),
        },
        {
          id: "printer",
          title: "Printer & Scanner",
          queryGroup: "Printer & Scanner",
          catIds: getGroupCatIds("Printer & Scanner"),
        },
        {
          id: "pc",
          title: "PC Desktop & AIO",
          queryGroup: "Dekstop & PC", 
          catIds: getGroupCatIds("Dekstop & PC"),
        },
      ];

      const result = await Promise.all(
        sectionsData.map(async (section) => {
          if (section.catIds.length === 0) return { ...section, products: [] };

          const productsRes = await getProducts({
            category_ids: section.catIds.join(","),
            limit: 10,
          });

          return {
            ...section,
            products: productsRes.data || [],
          };
        })
      );

      setGroupings(result.filter((s) => s.products.length > 0));
    } catch (err) {
      console.error("Gagal fetch grouping", err);
    }
  };

  return (
    <>
      {groupings.map((group) => (
        <SliderSection 
          key={group.id} 
          title={group.title} 
          queryGroup={group.queryGroup} 
          products={group.products} 
        />
      ))}
    </>
  );
}

/* ================= SLIDER PER GROUP ================= */
function SliderSection({ title, queryGroup, products }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // --- STATE & REF UNTUK DRAG LOGIC ---
  const [isSwiping, setIsSwiping] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product-grouping?grouping=${encodeURIComponent(queryGroup)}`);
  };

  const getScrollAmount = () => {
    if (!scrollRef.current) return 0;
    const card = scrollRef.current.querySelector(".product-slide") as HTMLElement;
    const gap = window.innerWidth >= 768 ? 24 : 16; 
    return card ? card.offsetWidth + gap : 0;
  };

  const scrollLeftAction = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const isStart = container.scrollLeft <= 5;

    if (isStart) {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    }
  };

  const scrollRightAction = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;

    if (isEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    }
  };

  // --- FUNGSI DRAG ---
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    
    dragDistance.current = 0;

    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    startX.current = pageX;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const walk = (pageX - startX.current) * 1.5; 
    
    dragDistance.current = Math.abs(walk); 

    if (dragDistance.current > 5 && !isSwiping) {
      setIsSwiping(true);
    }

    scrollRef.current.scrollLeft = scrollLeftStart.current - walk; 
  };

  const handleDragEnd = () => { 
    isDragging.current = false; 
    setIsSwiping(false); 
  };

  // Mencegah card kepencet / pindah halaman kalau user niatnya geser
  const handleClickCapture = (e: React.MouseEvent) => {
    if (dragDistance.current > 10) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // --- Efek Auto-Slide (Dimatikan saat hover atau swiping) ---
  useEffect(() => {
    if (isHovered || isSwiping || !products || products.length === 0) return; 

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;

      const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;

      if (isEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
      }
    }, 3000); 

    return () => clearInterval(timer);
  }, [isHovered, isSwiping, products]);

  // Jika produk kosong, jangan render slider-nya
  if (!products || products.length === 0) return null;

  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0">
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          <div className="mb-6">
            <div className="inline-flex bg-primary6 px-8 py-3 rounded-2xl shadow-lg transform">
              <h2 className="text-xl md:text-2xl lg:text-2xl font-bold text-white">
                {title}
              </h2>
            </div>
          </div>

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
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onClickCapture={handleClickCapture}
            className={`
              flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4
              cursor-grab active:cursor-grabbing touch-pan-y
              ${isSwiping ? "scroll-auto snap-none" : "scroll-smooth snap-x snap-mandatory"}
            `}
          >
            {/* DAFTAR PRODUK */}
            {products.map((product: any) => (
              <div
                key={product.id}
                className="
                  product-slide flex-shrink-0 snap-start select-none
                  w-[calc(50%-8px)]     /* <-- Ngepas 2 card di Mobile */
                  sm:w-[180px]
                  md:w-[210px]
                  lg:w-[230px]
                  xl:w-[236px]
                  2xl:w-[246px] 
                "
              >
                <div className={isSwiping ? "pointer-events-none select-none" : ""}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}

            {/* CARD LIHAT SEMUA */}
            <div
              className="
                product-slide flex-shrink-0 snap-start select-none
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
                className={`h-full min-h-[280px] bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100 flex flex-col items-center justify-center p-4 md:p-6 text-center hover:shadow-lg transition-all cursor-pointer group ${
                  isSwiping ? "pointer-events-none select-none" : ""
                }`}
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