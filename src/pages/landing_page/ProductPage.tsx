import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/adminCategoryService";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const brandList = ["Acer","Acasis","Accurate","ADATA","AMD","Anker","APC","Arctic","ASRock","ASUS","Aten","Aukey","AverMedia","AOC","Baseus","Bantex","be quiet!","Belden","BenQ","Bitdefender","Blueprint","Brother","Canon","Casio","Cisco","Citizen","CommScope","Cooler Master","Corsair","Creative","Crucial","CyberPower","Dahua","Datalogic","DeepCool","Deli","Dell","D-Link","Dymo","Elgato","Eppos","Epson","Fantech","Fenvi","FiiO","FSP","FujiFilm","G.Skill","Gigabyte","Honeywell","HP","Hikvision","ICA","IKEA","Insta360","Intel","Iware","Jabra","Joyko","Kaspersky","Kenko","Keychron","Kingston","Kingston Fury","Kioxia","Kootek","Laplace","Lenovo","Lexar","LG","Lian Li","Logitech","Matrix Point","Maxhub","Matsunaga","Mcdodo","Microsoft","Mikrotik","Moft","MSI","Netgear","Nillkin","Noctua","NZXT","Obsbot","Orico","Palit","Pantum","Pioneer","Poly","PowerColor","Prolink","QNAP","Razer","Rexus","Ruijie","Sapphire","SanDisk","Seagate","Seasonic","Solution","SteelSeries","Suprema","Sunmi","Synology","TeamGroup","Tenda","TerraMaster","Thermal Grizzly","Thermaltake","Toshiba","TP-Link","Transcend","Targus","Ubiquiti","Ugreen","Vascolink","Vention","V-Gen","Western Digital","WD","Xiaomi","Xprinter","Yealink","Zahir","Zebra","ZKTeco","Zotac"];


interface Product {
  id: string;
  name: string;
  thumbnail_url?: string;
  price_normal?: number;
  price_discount?: number;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [searchCategory, setSearchCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [searchBrand, setSearchBrand] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

        useEffect(() => {
            fetchProducts();
        }, [selectedCategory, selectedBrand, currentPage, searchQuery]);

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

        if (selectedBrand) {
            params.brand = selectedBrand;
        }

        if (searchQuery) {
            params.search = searchQuery;
        }

        const res = await getProducts(params);

        setProducts(res.data);
        setTotalPages(res.last_page);
        setLoading(false);
    };

  return (
    <div className="px-6 py-10 mx-auto max-w-7xl">
      <div className="grid grid-cols-12 gap-8">
        
        {/* ================= SIDEBAR ================= */}
        <div className="col-span-3 space-y-8">

            {/* ================= CATEGORY ================= */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Category</h2>

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
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                <li
                    onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                    }}
                    className={`cursor-pointer ${
                    !selectedCategory
                        ? "text-primary font-semibold"
                        : "text-gray-600"
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
                            : "text-gray-600"
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
                    <h2 className="text-lg font-semibold">Brand</h2>

                    {selectedBrand && (
                    <button
                        onClick={() => {
                        setSelectedBrand(null);
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
                    placeholder="Search brand"
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

                        return filteredBrands.map((brand) => (
                        <li
                            key={brand}
                            onClick={() => {
                            setSelectedBrand(brand);
                            setCurrentPage(1);
                            }}
                            className={`
                            cursor-pointer transition
                            ${
                                selectedBrand === brand
                                ? "text-primary font-semibold"
                                : "text-gray-600 hover:text-primary"
                            }
                            `}
                        >
                            {brand}
                        </li>
                        ));
                    })()}
                </ul>
            </div>

        </div>

        {/* ================= PRODUCT GRID ================= */}
        <div className="flex flex-col col-span-9">
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
                    <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="flex flex-col overflow-hidden transition bg-gray-50 border rounded-md shadow-sm hover:shadow-md cursor-pointer"
                    >
                        {/* IMAGE */}
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                            <img
                                src={
                                    product.thumbnail_url
                                    ? product.thumbnail_url.startsWith("http")
                                        ? product.thumbnail_url
                                        : `http://localhost:3000${product.thumbnail_url}`
                                    : "/icon-anandam.svg"
                                }
                                alt={product.name}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/icon-anandam.svg";
                                }}
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col flex-1 p-3">
                            <h3 className="mb-2 text-xs font-medium line-clamp-2 min-h-[32px]">
                            {product.name}
                            </h3>

                            <div className="mt-auto">
                            {product.price_discount ? (
                                <>
                                <p className="text-xs text-gray-400 line-through">
                                    Rp {Number(product.price_normal).toLocaleString()}
                                </p>
                                <p className="text-sm font-bold text-red-600">
                                    Rp {(
                                    Number(product.price_normal) -
                                    Number(product.price_discount)
                                    ).toLocaleString()}
                                </p>
                                </>
                            ) : (
                                <p className="text-sm font-bold text-red-600">
                                Rp {Number(product.price_normal).toLocaleString()}
                                </p>
                            )}
                            </div>
                        </div>
                    </div>
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
  );
}