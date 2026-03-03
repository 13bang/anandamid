import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function CategoryProductSection({
  title,
  titleClass,
  products,
}: {
  title: string;
  titleClass?: string;
  products: any[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const firstCard = scrollRef.current.children[0] as HTMLElement;
    if (!firstCard) return;

    const gap = 16;
    const cardWidth = firstCard.offsetWidth + gap;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full px-8 pb-10">
      <div className="relative p-6 bg-white rounded-md shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <h2 className={`mb-6 ${titleClass || "text-3xl font-semibold"}`}>
          {title}
        </h2>

        <button
          onClick={() => scroll("left")}
          className="absolute -left-5 top-1/2 -translate-y-1/2 
          z-20 p-3 bg-white shadow-md rounded-full"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-5 top-1/2 -translate-y-1/2 
          z-20 p-3 bg-white shadow-md rounded-full"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {products.map((product) => (
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
  );
}