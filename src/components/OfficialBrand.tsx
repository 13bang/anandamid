import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  "Acer","ADATA","AMD","AOC","APC","Arctic","ASRock","ASUS","Belden","Blueprint",
  "Brother","Canon","CommScope","Cooler Master","Corsair","DeepCool","Dell","D-Link",
  "Epson","Fantech","FSP","Gigabyte","G.Skill","Hikvision","HP","ICA","Intel",
  "Kaspersky","Kingston","Kingston Fury","Lenovo","Lexar","LG","Logitech","Matsunaga",
  "Microsoft","Mikrotik","MSI","Orico","PowerColor","Prolink","QNAP","Rexus","Ruijie",
  "SanDisk","Samsung","Sapphire","Seagate","Solution","SteelSeries","TeamGroup","Tenda",
  "Thermal Grizzly","Toshiba","TP-Link","Transcend","Ubiquiti","Ugreen","Vascolink",
  "VBR","Vention","V-Gen","WD","Xiaomi","Zotac"
];

const BRAND_LOCAL_MAP: Record<string, string> = {
  "ASUS": "/brands/asus.png",
  "MSI": "/brands/msi.png",
  "Intel": "/brands/intel.png",
  "AMD": "/brands/amd.svg",
  "Acer": "/brands/acer.svg",
  "ADATA": "/brands/adata.svg",
  "Dell": "/brands/dell.png",
  "Lenovo": "/brands/lenovo.png",
  "Samsung": "/public/brands/samsung.svg"
};

const getInitial = (brand: string) => {
  return brand
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function OfficialBrandSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector("div") as HTMLElement;
    if (!card) return;

    const scrollAmount = card.offsetWidth * 5;

    el.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white mt-4 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">

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
          <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4">

              {brands.map((brand) => {
                const imagePath = BRAND_LOCAL_MAP[brand];
                const hasError = imageError[brand];

                return (
                  <div
                    key={brand}
                    className="min-w-[calc((100%-32px)/3)] h-[80px] flex items-center justify-center bg-white shrink-0"
                  >
                    {imagePath && !hasError ? (
                      <img
                        src={imagePath}
                        alt={brand}
                        className="h-20 max-w-full object-contain"
                        onError={() =>
                          setImageError(prev => ({
                            ...prev,
                            [brand]: true
                          }))
                        }
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-700">
                        <div className="text-lg font-bold">
                          {getInitial(brand)}
                        </div>
                        <div className="text-[10px] opacity-70 text-center px-1">
                          {brand}
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