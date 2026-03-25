import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/adminCategoryService";
import { LayoutGrid, LayoutList } from "lucide-react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";

import ProductCard from "../../components/ProductCard";
import InfiniteScrollTrigger from "../../components/InfiniteScrollTrigger";
import FilteringSidebar from "../../components/FilteringSidebar";
import HeaderProduct from "../../components/HeaderProduct";
import Breadcrumb from "../../components/Breadcrumb";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";

import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

const brandList = ["Acer","Acasis","Accurate","ADATA","AMD","Anker","APC","Arctic","ASRock","ASUS","Aten","Aukey","AverMedia","AOC","Baseus","Bantex","Belden","BenQ","Bitdefender","Blueprint","Brother","Canon","Casio","Cisco","Citizen","CommScope","Cooler Master","Corsair","Creative","Crucial","CyberPower","Dahua","Datalogic","DeepCool","Deli","Dell","D-Link","Dymo","Elgato","Eppos","Epson","Fantech","Fenvi","FiiO","FSP","FujiFilm","G.Skill","Gigabyte","Honeywell","HP","Hikvision","ICA","IKEA","Insta360","Intel","Iware","Jabra","Joyko","Kaspersky","Kenko","Keychron","Kingston","Kingston Fury","Kioxia","Kootek","Laplace","Lenovo","Lexar","LG","Lian Li","Logitech","Matrix Point","Maxhub","Matsunaga","Mcdodo","Microsoft","Mikrotik","Moft","MSI","Netgear","Nillkin","Noctua","NZXT","Obsbot","Orico","Palit","Pantum","Pioneer","Poly","PowerColor","Prolink","QNAP","Razer","Rexus","Ruijie","Sapphire","SanDisk","Seagate","Seasonic","Solution","SteelSeries","Suprema","Sunmi","Synology","TeamGroup","Tenda","TerraMaster","Thermal Grizzly","Thermaltake","Toshiba","TP-Link","Transcend","Targus","Ubiquiti","Ugreen","Vascolink","Vention","V-Gen","VBR","Western Digital","WD","Xiaomi","Xprinter","Yealink","Zahir","Zebra","ZKTeco","Zotac"];

export default function KategoriParentPage() {

  const { parent } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const [searchCategory, setSearchCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [searchBrand, setSearchBrand] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [sort, setSort] = useState("popular");

  const MIN = 0;
  const MAX = 10000000;

  const [minPrice, setMinPrice] = useState(MIN);
  const [maxPrice, setMaxPrice] = useState(MAX);

  const STEP = 100000;

  const isPriceFiltered = minPrice !== MIN || maxPrice !== MAX;

  const location = useLocation();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, parent, categoryParam, selectedBrand, sort, minPrice, maxPrice]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, [
    parent,
    categoryParam,
    selectedBrand,
    sort,
    minPrice,
    maxPrice
  ]);

  const resetProducts = () => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);

    const params: any = {
      page,
      limit: 20,
      parent: parent,
    };

    if (categoryParam) params.category = categoryParam;
    if (selectedBrand.length > 0) params.brand = selectedBrand.join(",");
    if (sort) params.sort = sort;
    if (minPrice !== MIN) params.min_price = minPrice;
    if (maxPrice !== MAX) params.max_price = maxPrice;

    const res = await getProducts(params);

    setTotalProducts(res.total);

    const newProducts = res.data;
    const currentPage = res.page;
    const lastPage = res.last_page;

    setHasMore(currentPage < lastPage);

    if (page === 1) {
      setProducts(newProducts);
    } else {
      setProducts((prev) => [...prev, ...newProducts]);
    }

    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const parentName =
    categories.find((c) => c.code === parent)?.name || parent;

  const [openFilter, setOpenFilter] = useState(false);

  const filterProps = {
    categories,
    showCategory: false,
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

    setSearchParams
  };

  return (
    <div>

      {/* BREADCRUMB */}
      <div className="w-full bg-white">
        <div className="h-14 flex items-center px-4 lg:px-8 max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: parentName ?? "Kategori" },
            ]}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 lg:px-8 pt-4 pb-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SIDEBAR */}
          <div className="hidden lg:block col-span-3">
            <FilteringSidebar {...filterProps} />
          </div>

          {/* PRODUCT LIST */}
          <div className="flex flex-col col-span-12 lg:col-span-9">

            <HeaderProduct
              layout={layout}
              setLayout={setLayout}
              sort={sort}
              setSort={setSort}
              totalProducts={totalProducts}
              page={page}
              onOpenFilter={() => setOpenFilter(true)}
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedBrand.map((brand) => (
                  <div
                  key={brand}
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-primary5 border border-gray-300 shadow-sm text-gray-700"
                  >
                  <span>{brand}</span>

                  <button
                      onClick={() => {
                      setSelectedBrand((prev) =>
                          prev.filter((b) => b !== brand)
                      );
                      setProducts([]);
                      setPage(1);
                      setHasMore(true);
                      }}
                      className="text-gray-500 hover:text-red-500"
                  >
                      ✕
                  </button>
                  </div>
              ))}

              {isPriceFiltered && (
                  <div className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-primary5 border border-gray-300 shadow-sm text-gray-700">
                  <span>
                      Rp {minPrice.toLocaleString("id-ID")} - Rp{" "}
                      {maxPrice.toLocaleString("id-ID")}
                  </span>

                  <button
                      onClick={() => {
                      setMinPrice(MIN);
                      setMaxPrice(MAX);
                      setProducts([]);
                      setPage(1);
                      setHasMore(true);
                      }}
                      className="text-gray-500 hover:text-red-500"
                  >
                      ✕
                  </button>
                  </div>
              )}
            </div>

            {loading && page === 1 ? (
                <div
                    className={
                    layout === "grid"
                        ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
                        : "flex flex-col gap-4"
                    }
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                    ))}
                </div>
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
                <div
                    className={
                    layout === "grid"
                        ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
                        : "flex flex-col gap-4"
                    }
                >
                    {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        layout={layout}
                    />
                    ))}
                </div>
            )}

            <InfiniteScrollTrigger
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </div>

        </div>
      </div>

      {openFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center lg:hidden">

            <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenFilter(false)}
            />

            <div className="
            relative
            w-[90%]
            max-w-md
            max-h-[85vh]
            bg-white
            rounded-2xl
            shadow-xl
            overflow-y-auto
            p-4
            ">

            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filter</h2>

                <button
                onClick={() => setOpenFilter(false)}
                className="text-gray-500 hover:text-black"
                >
                ✕
                </button>
            </div>

            <FilteringSidebar {...filterProps} />

            </div>
        </div>
      )}

    </div>
  );
}
