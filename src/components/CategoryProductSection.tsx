import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function CategoryProductSection({
  title,
  titleClass,
  products,
}: {
  title?: string;
  titleClass?: string;
  products: any[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const firstCard = container.querySelector(".product-item") as HTMLElement;
    if (!firstCard) return;

    const gap = 16; // gap-4 = 1rem = 16px
    const cardWidth = firstCard.offsetWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full px-8 pb-10">
      <div 
      className="relative p-6 rounded-3xl
      bg-primary5/40 backdrop-blur-sm border border-white/90 shadow-[0_0_25px_rgba(0,0,0,0.15)]">
        
        {title && (
          <h2
            className={`mb-6 text-center ${
              titleClass ||
              "text-4xl font-semibold font-stretchpro bg-gray-500 bg-clip-text inline-block text-gray-800"
            }`}
          >
            {title}
          </h2>
        )}

        {/* LEFT BUTTON */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-5 top-1/2 -translate-y-1/2 
                     z-20 p-3 bg-white shadow-md rounded-full 
                     hover:bg-gray-100 transition"
        >
          <ChevronLeft size={20} />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-5 top-1/2 -translate-y-1/2 
                     z-20 p-3 bg-white shadow-md rounded-full 
                     hover:bg-gray-100 transition"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 py-4 px-1 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-item flex-shrink-0 w-[calc((100%-5rem)/6)] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}