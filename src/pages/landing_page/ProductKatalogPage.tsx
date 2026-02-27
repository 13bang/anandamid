import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/adminCategoryService";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types/product";

import Breadcrumb from "../../components/Breadcrumb";

const brandList = ["Acer","Acasis","Accurate","ADATA","AMD","Anker","APC","Arctic","ASRock","ASUS","Aten","Aukey","AverMedia","AOC","Baseus","Bantex","Belden","BenQ","Bitdefender","Blueprint","Brother","Canon","Casio","Cisco","Citizen","CommScope","Cooler Master","Corsair","Creative","Crucial","CyberPower","Dahua","Datalogic","DeepCool","Deli","Dell","D-Link","Dymo","Elgato","Eppos","Epson","Fantech","Fenvi","FiiO","FSP","FujiFilm","G.Skill","Gigabyte","Honeywell","HP","Hikvision","ICA","IKEA","Insta360","Intel","Iware","Jabra","Joyko","Kaspersky","Kenko","Keychron","Kingston","Kingston Fury","Kioxia","Kootek","Laplace","Lenovo","Lexar","LG","Lian Li","Logitech","Matrix Point","Maxhub","Matsunaga","Mcdodo","Microsoft","Mikrotik","Moft","MSI","Netgear","Nillkin","Noctua","NZXT","Obsbot","Orico","Palit","Pantum","Pioneer","Poly","PowerColor","Prolink","QNAP","Razer","Rexus","Ruijie","Sapphire","SanDisk","Seagate","Seasonic","Solution","SteelSeries","Suprema","Sunmi","Synology","TeamGroup","Tenda","TerraMaster","Thermal Grizzly","Thermaltake","Toshiba","TP-Link","Transcend","Targus","Ubiquiti","Ugreen","Vascolink","Vention","V-Gen","VBR","Western Digital","WD","Xiaomi","Xprinter","Yealink","Zahir","Zebra","ZKTeco","Zotac"];

interface Category {
  id: string;
  name: string;
}

export default function ProductKatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [searchCategory, setSearchCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
    const [searchBrand, setSearchBrand] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");

    const [activeSearch, setActiveSearch] = useState<string | null>(null);
    const [sort, setSort] = useState<string | null>(null);

    const MIN = 0;
    const MAX = 10000000; 

    const [minPrice, setMinPrice] = useState<number>(MIN);
    const [maxPrice, setMaxPrice] = useState<number>(MAX);

    const STEP = 100000;

    const isPriceFiltered = minPrice !== MIN || maxPrice !== MAX;

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    // useEffect(() => {
    //     fetchProducts();
    // }, [selectedCategory, selectedBrand, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [
        selectedCategory,
        selectedBrand,
        currentPage,
        activeSearch,
        sort,
        minPrice,
        maxPrice
    ]);

    // useEffect(() => {
    //     fetchProducts();
    // }, [selectedCategory, selectedBrand, currentPage, searchQuery]);

    useEffect(() => {
        if (searchQuery !== null) {
            setActiveSearch(searchQuery);
            setCurrentPage(1);
            setSearchParams({}, { replace: true });
        }
    }, [searchQuery]);

    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    const fetchProducts = async () => {
        setLoading(true);

        const params: any = {
            page: currentPage,
            limit: 20,
        };

        if (selectedCategory) {
            params.category = selectedCategory;
        }

        if (selectedBrand.length > 0) {
            params.brand = selectedBrand.join(",");
        }

        if (activeSearch) {
            params.search = activeSearch;
        }

        if (sort) {
            params.sort = sort;
        }

        if (minPrice !== MIN) {
        params.min_price = minPrice;
        }

        if (maxPrice !== MAX) {
        params.max_price = maxPrice;
        }

        const res = await getProducts(params);

        setProducts(res.data);
        setTotalPages(res.last_page);
        setTotalPages(res.last_page);
        setLoading(false);
    };

  return (
    
    <div>
        {/* ================= BREADCRUMB BAR ================= */}
        <div className="w-full bg-blue-100">
            <div className="h-14 flex items-center px-8">
                <div className="w-ful items-center">
                    <Breadcrumb
                    items={[
                        { label: "Home", path: "/" },
                        { label: "Product Katalog" },
                    ]}
                    />
                </div>
            </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="px-8 pt-4 pb-8 mx-auto w-full">
            <div className="grid grid-cols-12 gap-8">
                
                {/* ================= SIDEBAR ================= */}
                <div className="col-span-3 space-y-8">

                    {/* ================= CATEGORY ================= */}
                    <div>
                        <h2 className="mb-4 text-xl font-bold">Category</h2>

                        {/* SEARCH CATEGORY */}
                        <div className="relative mb-4">
                            <Search
                                size={16}
                                className="absolute text-gray-400 -translate-y-1/2 left-0 top-1/2"
                            />

                            <input
                                type="text"
                                placeholder="Search"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                                className="
                                w-full
                                pl-6
                                pr-2
                                py-2
                                text-sm
                                bg-transparent
                                border-b
                                border-gray-300
                                focus:outline-none
                                focus:border-primary
                                transition
                                "
                            />
                        </div>

                        {/* CATEGORY LIST */}
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 text-sm text-black">
                        <li
                            onClick={() => {
                            setSelectedCategory(null);
                            setCurrentPage(1);
                            }}
                            className={`cursor-pointer ${
                            !selectedCategory
                                ? "text-primary font-semibold"
                                : "text-black"
                            }`}
                        >
                            All
                        </li>

                        {categories
                            .filter((cat) =>
                            cat.name.toLowerCase().includes(searchCategory.toLowerCase())
                            )
                            .map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => {
                                setSelectedCategory(cat.name);
                                setCurrentPage(1);
                                }}
                                className={`cursor-pointer hover:text-primary transition ${
                                selectedCategory === cat.name
                                    ? "text-primary font-semibold"
                                    : "text-black"
                                }`}
                            >
                                {cat.name}
                            </li>
                            ))}
                        </ul>
                    </div>

                    {/* ================= BRAND ================= */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Brand</h2>

                            {selectedBrand.length > 0 && (
                            <button
                                onClick={() => {
                                setSelectedBrand([]);
                                setCurrentPage(1);
                                }}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Clear
                            </button>
                            )}
                        </div>

                        {/* SEARCH BRAND */}
                        <div className="relative mb-4">
                            <Search
                            size={16}
                            className="absolute text-gray-400 -translate-y-1/2 left-0 top-1/2"
                            />

                            <input
                            type="text"
                            placeholder="Search"
                            value={searchBrand}
                            onChange={(e) => setSearchBrand(e.target.value)}
                            className="
                                w-full
                                pl-6
                                pr-2
                                py-2
                                text-sm
                                bg-transparent
                                border-b
                                border-gray-300
                                focus:outline-none
                                focus:border-primary
                                transition
                            "
                            />
                        </div>

                        {/* BRAND LIST */}
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {(() => {
                                const filteredBrands = brandList.filter((brand) =>
                                brand.toLowerCase().includes(searchBrand.toLowerCase())
                                );

                                if (filteredBrands.length === 0) {
                                return (
                                    <li className="text-sm text-gray-400 italic">
                                    Brand tidak ada
                                    </li>
                                );
                                }

                                return filteredBrands.map((brand) => {
                                    const isChecked = selectedBrand.includes(brand);

                                    return (
                                        <li
                                        key={brand}
                                        onClick={() => {
                                            setSelectedBrand((prev) =>
                                            prev.includes(brand)
                                                ? prev.filter((b) => b !== brand)
                                                : [...prev, brand]
                                            );
                                            setCurrentPage(1);
                                        }}
                                        className="flex items-center gap-3 cursor-pointer group"
                                        >
                                        {/* CHECKBOX */}
                                        <div
                                            className={`
                                            w-4 h-4 border rounded-sm flex items-center justify-center transition
                                            ${isChecked
                                                ? "bg-primary border-primary"
                                                : "border-gray-400 group-hover:border-primary"}
                                            `}
                                        >
                                            {isChecked && (
                                            <div className="w-2 h-2 bg-white rounded-sm"></div>
                                            )}
                                        </div>

                                        {/* BRAND TEXT */}
                                        <span
                                            className={`text-sm transition
                                            ${isChecked
                                                ? "text-primary font-semibold"
                                                : "text-black group-hover:text-primary"}
                                            `}
                                        >
                                            {brand}
                                        </span>
                                        </li>
                                    );
                                });
                            })()}
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
                                setCurrentPage(1);
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
                                setCurrentPage(1);
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
                                setCurrentPage(1);
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
                                    setCurrentPage(1);
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
                                    setCurrentPage(1);
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

                {/* ================= PRODUCT GRID ================= */}
                <div className="flex flex-col col-span-9">

                    {/* TITLE */}
                    <h1 className="mb-6 text-3xl font-bold">
                        {selectedCategory ? selectedCategory : "Semua Product"}
                    </h1>

                        {/* ACTIVE FILTER TAGS */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            
                            {/* BRAND TAGS */}
                            {selectedBrand.map((brand) => (
                                <div
                                key={brand}
                                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-md"
                                >
                                <span>{brand}</span>
                                <button
                                    onClick={() =>
                                    setSelectedBrand((prev) =>
                                        prev.filter((b) => b !== brand)
                                    )
                                    }
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    ✕
                                </button>
                                </div>
                            ))}

                            {/* PRICE TAG */}
                            {(isPriceFiltered) && (
                                <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
                                <span>
                                    Rp {minPrice.toLocaleString("id-ID")} - Rp{" "}
                                    {maxPrice.toLocaleString("id-ID")}
                                </span>
                                <button
                                    onClick={() => {
                                    setMinPrice(MIN);
                                    setMaxPrice(MAX);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    ✕
                                </button>
                                </div>
                            )}
                        </div>

                    {loading ? (
                        <p>Loading...</p>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <p className="text-lg font-semibold text-gray-600">
                                Produk tidak ditemukan
                                </p>
                                <p className="mt-2 text-sm text-gray-400">
                                Coba pilih brand atau kategori lain
                                </p>
                            </div>
                        ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* ================= PAGINATION ================= */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10">
                            <div className="flex items-center space-x-2">

                            {/* Previous */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>

                            {/* Dynamic Page Numbers */}
                            {(() => {
                                const pages = [];
                                const maxVisible = 5;

                                let start = Math.max(currentPage - 2, 1);
                                let end = start + maxVisible - 1;

                                if (end > totalPages) {
                                end = totalPages;
                                start = Math.max(end - maxVisible + 1, 1);
                                }

                                for (let i = start; i <= end; i++) {
                                pages.push(i);
                                }

                                return (
                                <>
                                    {start > 1 && (
                                    <>
                                        <button
                                        onClick={() => setCurrentPage(1)}
                                        className="px-3 py-1 text-sm border rounded"
                                        >
                                        1
                                        </button>
                                        {start > 2 && <span className="px-2">...</span>}
                                    </>
                                    )}

                                    {pages.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 text-sm border rounded transition ${
                                        currentPage === page
                                            ? "bg-primary text-white border-primary"
                                            : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                    ))}

                                    {end < totalPages && (
                                    <>
                                        {end < totalPages - 1 && <span className="px-2">...</span>}
                                        <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="px-3 py-1 text-sm border rounded"
                                        >
                                        {totalPages}
                                        </button>
                                    </>
                                    )}
                                </>
                                );
                            })()}

                            {/* Next */}
                            <button
                                onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    </div>
  );
}