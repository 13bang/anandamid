import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  image_url?: string;
  parent_id?: string;
}

interface Grouping {
  id: string;
  name: string;
  image_url?: string;
  children: Category[];
}

interface Props {
  groupings: Grouping[];
  getImageUrl: (url?: string) => string;
}

export default function LandingCategorySection({
  groupings,
  getImageUrl,
}: Props) {
  const navigate = useNavigate();
  const categoryScrollRef = useRef<HTMLDivElement>(null);

const filteredGroupings = groupings || [];

  const scrollCategory = (direction: "left" | "right") => {
    const container = categoryScrollRef.current;
    if (!container) return;

    const flexWrapper = container.firstElementChild as HTMLElement;
    if (!flexWrapper) return;

    const cards = flexWrapper.children;
    if (cards.length < 2) return;

    const columnsPerPage = 5;

    const firstCard = cards[0] as HTMLElement;
    const secondCard = cards[2] as HTMLElement;

    const cardDistance =
      secondCard.offsetLeft - firstCard.offsetLeft;

    const scrollAmount = cardDistance * columnsPerPage;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const container = categoryScrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();

    const container = categoryScrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [groupings]);

  return (
    <section className="relative w-full">

      {/* BACKGROUND PUTIH FULL */}
      <div className="absolute inset-0 bg-white z-0"></div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        
        <div className="p-4 sm:p-6">

          <div className="relative">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold font-cocogoose">
                Kategori
              </h2>
            </div>

            {/* LEFT */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCategory("left")}
                className="
                  hidden md:flex
                  absolute -left-10 top-1/2 -translate-y-1/2
                  z-20
                  p-2 bg-white shadow-md rounded-full
                "
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* RIGHT */}
            {canScrollRight && (
              <button
                onClick={() => scrollCategory("right")}
                className="
                  hidden md:flex
                  absolute -right-10 top-1/2 -translate-y-1/2
                  z-20
                  p-2 bg-white shadow-md rounded-full
                "
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* SCROLL */}
            <div className="overflow-hidden">
              <div
                ref={categoryScrollRef}
                className="overflow-x-auto scroll-smooth scrollbar-hide"
              >
                <div
                  className="
                    grid grid-rows-2 grid-flow-col
                    auto-cols-[calc((100%_-_9*14px)/10)]
                    gap-x-[14px] gap-y-4
                    w-full
                  "
                >

                  {filteredGroupings.map((group) => (
                    <div
                      key={group.id}
                      onClick={() =>
                        navigate(`/product-grouping?grouping=${group.name}`)
                      }
                      className="
                        flex flex-col items-center
                        w-[75px]
                        sm:w-[100px]
                        md:w-[110px]
                        cursor-pointer group
                      "
                    >
                      <div
                        className="
                          w-16 h-16
                          sm:w-20 sm:h-20
                          md:w-24 md:h-24
                          rounded-xl
                          overflow-visible
                          bg-white
                          border border-gray-200
                        "
                      >
                        {group.image_url ? (
                          <img
                            src={getImageUrl(group.image_url)}
                            alt={group.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-sm font-semibold text-gray-500">
                            {group.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <span className="mt-2 text-xs sm:text-xs text-center font-medium">
                        {group.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}