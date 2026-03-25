import type { Category } from "../types/category";

interface Props {
  categories: Category[];
  categoryParam: string | null;
  searchCategory: string;
  setSearchCategory: (v: string) => void;

  selectedBrand: string[];
  setSelectedBrand: React.Dispatch<React.SetStateAction<string[]>>;
  searchBrand: string;
  setSearchBrand: (v: string) => void;

  brandList: string[];

  minPrice: number;
  maxPrice: number;
  setMinPrice: (v: number) => void;
  setMaxPrice: (v: number) => void;

  MIN: number;
  MAX: number;
  STEP: number;

  isPriceFiltered: boolean;

  resetProducts: () => void;

  setSearchParams: any;

  showCategory?: boolean;
}

export default function FilteringSidebar(props: Props) {
  const {
    categories,
    categoryParam,
    searchCategory,
    setSearchCategory,
    selectedBrand,
    setSelectedBrand,
    searchBrand,
    setSearchBrand,
    brandList,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    MIN,
    MAX,
    STEP,
    isPriceFiltered,
    resetProducts,
    setSearchParams,
    showCategory = true,
  } = props;

  return (
    <div className="col-span-3 h-fit space-y-8 pt-0 pb-6 px-6 rounded-2xl bg-white border border-gray-300">

      {/* CATEGORY */}
      {showCategory && (
        <div>
          <h2 className="mb-4 mt-4 text-xl font-bold">Category</h2>

          <input
            type="text"
            placeholder="Search"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="
              w-full border-b py-2 text-sm outline-none
              focus:outline-none
              focus:ring-0
            "
          />

          <ul className="space-y-3 max-h-64 overflow-y-auto text-sm pt-2">
            <li
              onClick={() => setSearchParams({})}
              className={!categoryParam ? "text-primary font-semibold cursor-pointer" : ""}
            >
              All
            </li>

            {categories
              .filter((cat) => cat.parent_id !== null)
              .filter((cat) =>
                cat.name.toLowerCase().includes(searchCategory.toLowerCase())
              )
              .map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.name })}
                  className="cursor-pointer hover:text-primary"
                >
                  {cat.name}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* BRAND */}
      <div>
        <h2 className="mb-4 mt-4 text-xl font-bold">Brand</h2>

        <input
          type="text"
          placeholder="Search"
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
          className="
            w-full border-b py-2 text-sm outline-none
            focus:outline-none
            focus:ring-0
          "
        />

        <ul className="space-y-2 max-h-64 overflow-y-auto pt-2">
          {brandList
            .filter((brand) =>
              brand.toLowerCase().includes(searchBrand.toLowerCase())
            )
            .map((brand) => {
              const checked = selectedBrand.includes(brand);

              return (
                <li
                  key={brand}
                  onClick={() => {
                    setSelectedBrand((prev) =>
                      prev.includes(brand)
                        ? prev.filter((b) => b !== brand)
                        : [...prev, brand]
                    );
                    resetProducts();
                  }}
                  className="cursor-pointer text-sm"
                >
                  {brand}
                </li>
              );
            })}
        </ul>
      </div>

        {/* ================= PRICE RANGE ================= */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Price</h2>

                {(isPriceFiltered) && (
                <button
                    onClick={() => {
                    setMinPrice(MIN);
                    setMaxPrice(MAX);
                    }}
                    className="text-xs text-red-500 hover:underline"
                >
                    Clear
                </button>
                )}
            </div>

            {/* SLIDER */}
            <div className="relative h-4 mb-4">

                {/* Base Line */}
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-[2px] bg-gray-300" />
                </div>

                {/* Active Line */}
                <div
                    className="absolute inset-0 flex items-center"
                    style={{
                    left: `${(minPrice / MAX) * 100}%`,
                    width: `${((maxPrice - minPrice) / MAX) * 100}%`,
                    }}
                >
                    <div className="w-full h-[2px] bg-primary" />
                </div>

                {/* MIN */}
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    value={minPrice}
                    onChange={(e) => {
                    const value = Math.min(Number(e.target.value), maxPrice - STEP);
                    setMinPrice(value);
                    }}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none
                    [&::-webkit-slider-runnable-track]:appearance-none
                    [&::-webkit-slider-runnable-track]:bg-transparent
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />

                {/* MAX */}
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    value={maxPrice}
                    onChange={(e) => {
                    const value = Math.max(Number(e.target.value), minPrice + STEP);
                    setMaxPrice(value);
                    }}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none
                    [&::-webkit-slider-runnable-track]:appearance-none
                    [&::-webkit-slider-runnable-track]:bg-transparent
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
            </div>

            {/* VALUE DISPLAY */}
            <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Rp {minPrice.toLocaleString("id-ID")}</span>
                <span>Rp {maxPrice.toLocaleString("id-ID")}</span>
            </div>

            {/* INPUT MANUAL */}
            <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                <label className="text-xs mb-1 text-black">Dari</label>
                <input
                    type="number"
                    value={minPrice === MIN ? "" : minPrice}
                    placeholder="0"
                    onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < maxPrice) {
                        setMinPrice(value);
                    }
                    }}
                    className="w-full border-b border-gray-300 bg-transparent
                            focus:outline-none focus:border-primary
                            py-1 text-sm"
                />
                </div>

                <div className="flex flex-col w-1/2">
                <label className="text-xs mb-1 text-black">Sampai</label>
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > minPrice) {
                        setMaxPrice(value);
                    }
                    }}
                    className="w-full border-b border-gray-300 bg-transparent
                            focus:outline-none focus:border-primary
                            py-1 text-sm"
                />
                </div>
            </div>
        </div>

    </div>
  );
}