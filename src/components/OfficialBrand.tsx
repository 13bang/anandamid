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
  "Acer": "/brands/acer.svg",
  "ADATA": "/brands/adata.svg",
  "AMD": "/brands/amd.svg",
  "AOC": "/brands/aoc.svg",
  "APC": "/brands/apc.svg",
  "Arctic": "/brands/arctic.svg",
  "ASRock": "/brands/asrock.svg",
  "ASUS": "/brands/asus.svg",
  "Belden": "/brands/belden.svg",
  "Blueprint": "/brands/blueprint.svg",
  "Brother": "/brands/brother.svg",
  "Canon": "/brands/canon.svg",
  "CommScope": "/brands/commscope.svg",
  "Cooler Master": "/brands/coolermaster.svg",
  "Corsair": "/brands/corsair.svg",
  "DeepCool": "/brands/deepcool.svg",
  "Dell": "/brands/dell.svg",
  "D-Link": "/brands/dlink.svg",
  "Epson": "/brands/epson.svg",
  "Fantech": "/brands/fantech.svg",
  "FSP": "/brands/fsp.svg",
  "Gigabyte": "/brands/gigabyte.svg",
  "G.Skill": "/brands/gskill.svg",
  "Hikvision": "/brands/hikvision.svg",
  "HP": "/brands/hp.svg",
  "ICA": "/brands/ica.svg",
  "Intel": "/brands/intel.svg",
  "Kaspersky": "/brands/kaspersky.svg",
  "Kingston": "/brands/kingston.svg",
  "Kingston Fury": "/brands/kingston-fury.svg",
  "Lenovo": "/brands/lenovo.svg",
  "Lexar": "/brands/lexar.svg",
  "LG": "/brands/lg.svg",
  "Logitech": "/brands/logitech.svg",
  "Matsunaga": "/brands/matsunaga.svg",
  "Microsoft": "/brands/microsoft.svg",
  "Mikrotik": "/brands/mikrotik.svg",
  "MSI": "/brands/msi.svg",
  "Orico": "/brands/orico.svg",
  "PowerColor": "/brands/powercolor.svg",
  "Prolink": "/brands/prolink.svg",
  "QNAP": "/brands/qnap.svg",
  "Rexus": "/brands/rexus.svg",
  "Ruijie": "/brands/ruijie.svg",
  "SanDisk": "/brands/sandisk.svg",
  "Samsung": "/brands/samsung.svg",
  "Sapphire": "/brands/sapphire.svg",
  "Seagate": "/brands/seagate.svg",
  "Solution": "/brands/solution.svg",
  "SteelSeries": "/brands/steelseries.svg",
  "TeamGroup": "/brands/teamgroup.svg",
  "Tenda": "/brands/tenda.svg",
  "Thermal Grizzly": "/brands/thermal-grizzly.svg",
  "Toshiba": "/brands/toshiba.svg",
  "TP-Link": "/brands/tplink.svg",
  "Transcend": "/brands/transcend.svg",
  "Ubiquiti": "/brands/ubiquiti.svg",
  "Ugreen": "/brands/ugreen.svg",
  "Vascolink": "/brands/vascolink.svg",
  "VBR": "/brands/vbr.svg",
  "Vention": "/brands/vention.svg",
  "V-Gen": "/brands/vgen.svg",
  "WD": "/brands/wd.svg",
  "Xiaomi": "/brands/xiaomi.svg",
  "Zotac": "/brands/zotac.svg"
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

    const card = el.querySelector(".brand-card") as HTMLElement;
    if (!card) return;

    const gap = 10;

    // 🔥 pakai boundingClientRect (lebih akurat dari offsetWidth)
    const cardWidth = card.getBoundingClientRect().width;

    const step = cardWidth + gap;

    // 🔥 pakai ROUND biar ga numpuk error
    const current = Math.round(el.scrollLeft / step);

    const next = dir === "right" ? current + 1 : current - 1;

    el.scrollTo({
      left: next * step,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white mt-4 py-6 border-y border-gray-200">
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
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-[5px]"
          >
            <div className="flex gap-[10px] w-full">

              {brands.map((brand) => {
                const imagePath = BRAND_LOCAL_MAP[brand];
                const hasError = imageError[brand];

                return (
                  <div
                    key={brand}
                    className="brand-card shrink-0 h-[120px] flex items-center justify-center bg-white border border-gray-200 rounded-md hover:shadow-sm transition"
                    style={{
                      width: `calc((100% - 30px) / 4)`
                    }}
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