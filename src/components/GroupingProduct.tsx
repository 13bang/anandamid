import { useEffect, useRef, useState } from "react";
import { getGroupings } from "../services/groupingService";
import { getProducts } from "../services/productService";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const scrollLeft = () => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.querySelector(".product-slide") as HTMLElement;
    if (!card) return;

    // Gunakan + 24 karena gap-6 adalah 24px
    scrollRef.current.scrollBy({
      left: -(card.offsetWidth + 24),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.querySelector(".product-slide") as HTMLElement;
    if (!card) return;

    // Gunakan + 24 karena gap-6 adalah 24px
    scrollRef.current.scrollBy({
      left: card.offsetWidth + 24,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6 md:py-10 bg-white border-y border-gray-200 mt-4">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="relative">

          <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-center mb-4">
            {title}
          </h2>

          {/* LEFT */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-1 md:-left-5 top-1/2 -translate-y-1/2 z-[100] p-3 bg-white shadow-md rounded-full"
          >
            <ChevronLeft size={20} />
          </button>

          {/* RIGHT */}
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-1 md:-right-5 top-1/2 -translate-y-1/2 z-[100] p-3 bg-white shadow-md rounded-full"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            className="
              flex gap-6 overflow-x-auto scrollbar-hide
              scroll-smooth snap-x snap-mandatory
            "
          >
            {products.map((product: any) => (
              <div
                key={product.id}
                className="
                    product-slide flex-shrink-0 snap-start py-4
                    w-[47%]
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
          </div>

        </div>
      </div>
    </section>
  );
}