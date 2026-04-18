import { useEffect, useState, useMemo } from "react";
import { getProducts } from "../../services/productService";
import { getGroupings } from "../../services/groupingService";
import { useParams, useSearchParams, useLocation } from "react-router-dom";

import ProductCard from "../../components/ProductCard";
import InfiniteScrollTrigger from "../../components/InfiniteScrollTrigger";
import FilteringSidebar from "../../components/FilteringSidebar";
import HeaderProduct from "../../components/HeaderProduct";
import Breadcrumb from "../../components/Breadcrumb";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import { getBrands } from "../../services/brandService";

import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

interface Brand {
  id: string;
  name: string;
  image?: string;
}

export default function GroupingPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [groupings, setGroupings] = useState<any[]>([]);
  const [isGroupingsLoaded, setIsGroupingsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchCategory, setSearchCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [searchBrand, setSearchBrand] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const groupingParam = searchParams.get("grouping");
  const categoryIdsParam = searchParams.get("category_ids"); // Nangkep filter kategori dari sidebar

  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("newest");

  const MIN = 0;
  const MAX = 10000000; 

  const [minPrice, setMinPrice] = useState<number>(MIN);
  const [maxPrice, setMaxPrice] = useState<number>(MAX);
  const STEP = 100000;
  const isPriceFiltered = minPrice !== MIN || maxPrice !== MAX;

  const location = useLocation();

  // === LOGIC PENGGABUNGAN KATEGORI & CUSTOM GROUPING ===
  const { categories, categoryIds } = useMemo(() => {
    if (!isGroupingsLoaded || groupings.length === 0) return { categories: [], categoryIds: [] };

    let cats: Category[] = [];
    
    const paramStr = groupingParam ? groupingParam.trim().toLowerCase() : "";

    if (paramStr === "komponen & peripheral") {
      // 1. Ambil dari Grouping Komponen & Peripheral
      const kompGroup = groupings.find((g) => g.name.trim().toLowerCase() === "komponen komputer");
      const periGroup = groupings.find((g) => g.name.trim().toLowerCase() === "peripheral & i/o");
      
      // 2. Cari SSD dan HDD dari seluruh data grouping
      const allCategories = groupings.flatMap((g) => g.children || []);
      const ssdCat = allCategories.find((c) => c.name.trim().toLowerCase() === "ssd");
      const hddCat = allCategories.find((c) => c.name.trim().toLowerCase() === "hdd");

      cats = [
        ...(kompGroup?.children || []),
        ...(periGroup?.children || []),
        ssdCat,
        hddCat,
      ].filter(Boolean) as Category[];

      // Hilangkan duplikat barangkali SSD/HDD udah ada di dalamnya
      cats = Array.from(new Map(cats.map((c) => [c.id, c])).values());

    } else if (groupingParam) {
      const matchedGroup = 
        groupings.find((g) => g.name.trim().toLowerCase() === paramStr) || 
        groupings.find((g) => g.name.trim().toLowerCase().includes(paramStr));
      
      cats = matchedGroup?.children || [];
    } else {
      cats = groupings.flatMap((g) => g.children || []);
      cats = Array.from(new Map(cats.map((c) => [c.id, c])).values());
    }

    return {
      categories: cats,
      categoryIds: cats.map((c) => c.id),
    };
  }, [groupings, isGroupingsLoaded, groupingParam]);

  const resetProducts = () => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  };

  const fetchGroupings = async () => {
    const data = await getGroupings();
    setGroupings(data);
    setIsGroupingsLoaded(true);
  };

  useEffect(() => {
    fetchGroupings();
    fetchBrands();
  }, []);

  useEffect(() => {
    const isRefresh = location.key === "default";
    if (isRefresh && searchParams.get("category")) {
      setSearchParams({}, { replace: true });
    }
  }, []);

  // Fetch products dijalankan saat filter berubah
  useEffect(() => {
    if (!isGroupingsLoaded) return;
    fetchProducts();
  }, [page, groupingParam, categoryIdsParam, selectedBrand, activeSearch, sort, minPrice, maxPrice, isGroupingsLoaded]);

  useEffect(() => {
    if (searchQuery !== null) {
      setActiveSearch(searchQuery);
      resetProducts();
      setSearchParams({}, { replace: true });
    }
  }, [searchQuery]);

  // Reset page ke 1 kalau filter berubah
  useEffect(() => {
    resetProducts();
  }, [groupingParam, categoryIdsParam, selectedBrand, activeSearch, sort, minPrice, maxPrice]);

  const fetchProducts = async () => {
    if (groupingParam && categoryIds.length === 0) {
      setProducts([]);
      setTotalProducts(0);
      setHasMore(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    const params: any = {
      page,
      limit: 20,
    };

    if (categoryIdsParam) {
      params.category_ids = categoryIdsParam;
    } else if (categoryIds.length > 0) {
      params.category_ids = categoryIds.join(",");
    }

    if (selectedBrand.length > 0) params.brand = selectedBrand.join(",");
    if (activeSearch) params.search = activeSearch;
    if (sort) params.sort = sort;
    if (minPrice !== MIN) params.min_price = minPrice;
    if (maxPrice !== MAX) params.max_price = maxPrice;

    const res = await getProducts(params);

    setTotalProducts(res.total);

    if (page === 1) {
      setProducts(res.data);
    } else {
      setProducts(prev => [...prev, ...res.data]);
    }

    setHasMore(res.page < res.last_page);
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const [openFilter, setOpenFilter] = useState(false);

  const fetchBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  const filterProps = {
    groupings,
    categories, 
    showCategory: true,
    groupingParam,
    categoryIdsParam,
    searchCategory,
    setSearchCategory,

    selectedBrand,
    setSelectedBrand,
    searchBrand,
    setSearchBrand,

    brands,

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
  };

  return (
    <div>
      {/* ================= BREADCRUMB BAR ================= */}
      <div className="w-full bg-white">
        <div className="flex items-center px-4 mx-auto h-14 lg:px-8 max-w-7xl">
          <div className="items-center w-full">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: groupingParam || "Kategori" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="px-4 pt-4 pb-8 mx-auto lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* ================= SIDEBAR ================= */}
          <div className="hidden col-span-3 lg:block">
            <FilteringSidebar {...filterProps} />
          </div>

          {/* ================= PRODUCT GRID ================= */}
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
              {selectedBrand.map((brandId) => {
                const brandObj = brands.find(b => b.id === brandId);
                return (
                  <div
                    key={brandId}
                    className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-primary5 border border-gray-300 shadow-sm text-gray-700"
                  >
                    <span>{brandObj?.name || brandId}</span>
                    <button
                      onClick={() => {
                        setSelectedBrand((prev) => prev.filter((b) => b !== brandId));
                        resetProducts();
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {isPriceFiltered && (
                <div className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 border border-gray-300 shadow-sm rounded-full bg-primary5">
                  <span>
                    Rp {minPrice.toLocaleString("id-ID")} - Rp {maxPrice.toLocaleString("id-ID")}
                  </span>
                  <button
                    onClick={() => {
                      setMinPrice(MIN);
                      setMaxPrice(MAX);
                      resetProducts();
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
          <div className="relative w-[90%] max-w-md max-h-[85vh] bg-white rounded-2xl shadow-xl overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filter</h2>
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