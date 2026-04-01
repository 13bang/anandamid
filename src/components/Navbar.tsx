import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Search, MessageCircle, CircleQuestionMark, Menu as MenuIcon, ChevronDown, Layers, EllipsisVertical, Workflow } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { Product } from "../types/product";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/adminCategoryService";
import SearchBar from "./SearchBar";
import { getGroupings } from "../services/groupingService";

interface Category {
  id: string;
  name: string;
  code: string;
  parent_id: string | null;
}

interface Grouping {
  id: string;
  name: string;
  children: Category[];
}


export default function Navbar() {
  const [groupings, setGroupings] = useState<Grouping[]>([]);

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getProductImage = (product: Product) => {
    const imagePath =
      product.images?.[0]?.thumbnail_url ||
      product.thumbnail_url ||
      product.images?.[0]?.image_url;

    if (!imagePath) return "/icon-anandam.svg";

    return imagePath.startsWith("http")
      ? imagePath
      : `${import.meta.env.VITE_API_BASE}${imagePath}`;
  };
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<Category[]>([]);
  const cache = useRef<Record<string, Product[]>>({});
  const [loadingSearch, setLoadingSearch] = useState(false);

  const shortenName = (name: string) => {
    const words = name.split(" ");
    const take = Math.random() > 0.5 ? 2 : 3;
    return words.slice(0, take).join(" ");
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showContactPopover, setShowContactPopover] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
        setShowContactPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupingData, categoryData] = await Promise.all([
          getGroupings(),
          getCategories(),
        ]);

        setGroupings(groupingData);
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim() || search.length < 2) {
      setResults([]);
      setSuggestions([]);
      setCategorySuggestions([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setLoadingSearch(true);

    const delay = setTimeout(async () => {
      if (!search.trim() || search.length < 2) {
        setResults([]);
        setSuggestions([]);
        setCategorySuggestions([]);
        setShowDropdown(false);
        return;
      }

      // cek cache dulu
      if (cache.current[search]) {
        setResults(cache.current[search]);
        setShowDropdown(true);
        return;
      }

      try {
        setLoadingSearch(true);

        const res = await getProducts({
          search: search,
          page: 1,
          limit: 10,
        });

        const products: Product[] = res.data;

        cache.current[search] = products;

        setResults(products);
        setFeaturedProducts(shuffleArray(products).slice(0, 5));

        // suggestion nama
        const normalizedSearch = search.trim().toLowerCase();

        const nameSuggestions = Array.from(
          new Set(
            shuffleArray(products).map((p) => shortenName(p.name))
          )
        )
        .filter((name) => name.toLowerCase() !== normalizedSearch)
        .slice(0, 5);

        setSuggestions(nameSuggestions);

        // category suggestion
        const uniqueCategories = Array.from(
          new Map(
            products
              .filter((p: Product) => p.category)
              .map((p: Product) => [p.category!.id, p.category])
          ).values()
        ) as Category[];

        setCategorySuggestions(uniqueCategories);

        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSearch(false);
      }
    }, 150);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    const currentPath = location.pathname;
    navigate(`${currentPath}?search=${encodeURIComponent(search)}`);
  };

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openKategori, setOpenKategori] = useState(false);

  interface Category {
    id: string;
    name: string;
    code: string;
    parent_id: string | null;
  }

  return (
    <>
      {/* ================= TOP INFO BAR ================= */}
      {/* 1. Tambah overflow-hidden di div paling luar ini */}
      <div className="w-full bg-blue-700 text-xs border-b border-gray-300 overflow-hidden">

        <style>{`
          /* DESKTOP ANIMATION */
          .animate-info-desktop {
            animation: infoBarLoop 12s ease-in-out infinite;
          }

          @keyframes infoBarLoop {
            0% { opacity: 0; transform: translateX(-40px); }
            10% { opacity: 1; transform: translateX(0); }
            13% { transform: scale(1.02); }
            16% { transform: scale(1); }
            85% { opacity: 1; transform: translateX(0); }
            95% { opacity: 0; transform: translateX(40px); }
            100% { opacity: 0; transform: translateX(40px); }
          }

          /* MOBILE INFINITE MARQUEE */
          .marquee {
            display: flex;
            width: max-content;
            animation: marquee 18s linear infinite;
          }

          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <div className="w-full mx-auto px-3 md:px-6 py-2 text-gray-700">

          {/* MOBILE VERSION */}
          <div className="md:hidden overflow-hidden text-[11px]">

            <div className="marquee flex gap-8">

              {/* CONTENT 1 */}
              <div className="flex items-center gap-6 whitespace-nowrap">

                <span className="font-medium text-gray-50">
                  Jam Operasional:
                </span>

                <span className="text-gray-50">
                  Senin–Sabtu 08.00–21.00 | Minggu / Libur Nasional 10.00–19.00
                </span>

              </div>

              {/* CONTENT DUPLICATE */}
              <div className="flex items-center gap-6 whitespace-nowrap">

                <span className="font-medium text-gray-50">
                  Jam Operasional:
                </span>

                <span className="text-gray-50">
                  Senin–Sabtu 08.00–21.00 | Minggu / Libur Nasional 10.00–19.00
                </span>

              </div>

            </div>

          </div>

          {/* DESKTOP VERSION */}
          <div className="hidden md:flex items-center justify-between animate-info-desktop">

            {/* LEFT */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-50">
                Jam Operasional:
              </span>

              <span className="text-gray-50">
                Senin–Sabtu 08.00–21.00 | Minggu / Libur Nasional 10.00–19.00
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6">

              {/* CARA PEMESANAN */}
              <div 
                onClick={() => setIsOrderModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer transition group"
              >
                <CircleQuestionMark className="text-gray-50 group-hover:text-blue-200" size={14} />
                <span className="font-medium text-gray-50 group-hover:text-blue-200">
                  Cara Pemesanan
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ================= STICKY NAVBAR ================= */}
      <div
        className={`
          sticky top-0 z-[1000] w-full bg-white border-b border-gray-200
          transition-shadow
          ${isScrolled ? "shadow-md" : ""}
        `}
      >

        {/* ================= TOP NAVBAR (Logo + Search) ================= */}
        <div className="w-full">
          <div className="flex items-center justify-between px-4 md:px-6 mx-auto w-full h-16">

            {/* HAMBURGER */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden"
            >
              <MenuIcon size={22} />
            </button>

            {/* Logo */}
            <Link to="/">
              <img
                src="/anandam-logo-blue.svg"
                alt="Anandam Logo"
                className="h-9 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Search */}
            <SearchBar
              className="hidden md:block w-[360px]"
              dropdownWidth="w-[360px]"
            />
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar
            className="w-full"
            dropdownWidth="w-full"
          />
        </div>

        {/* ================= BOTTOM NAVBAR (MENU) ================= */}
        <div
          className={`
            w-full
            transition-all duration-300
          `}
        >
          <div className="w-full mx-auto px-8 py-3">
            <div className="hidden md:flex gap-12 text-sm font-medium text-gray-700">

              {/* MENU DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div className="flex items-center gap-2 cursor-pointer transition hover:text-primary">
                  {/* <MenuIcon size={18} strokeWidth={2} /> */}
                  <span>Menu</span>
                  <ChevronDown size={16} strokeWidth={2} />
                </div>

                <div className="absolute left-0 top-full h-3 w-full"></div>

                {open && (
                  <div
                    className="
                      absolute left-0 top-full mt-3
                      w-[1100px]
                      bg-white text-gray-700
                      shadow-md p-5 z-50
                    "
                  >
                    <div className="grid grid-cols-5 gap-6 max-h-[420px] overflow-y-auto pr-2">

                      {groupings.map((group) => {

                        const groupCategories = group.children || [];

                        return (
                          <div key={group.id} className="flex flex-col">

                            {/* GROUP TITLE */}
                            <div className="mb-2">
                              <div
                                onClick={() => {
                                  navigate(`/product-grouping?grouping=${group.name}`);
                                  setOpen(false);
                                }}
                                className="
                                  text-sm font-bold text-gray-800
                                  cursor-pointer
                                  hover:text-primary
                                  whitespace-nowrap overflow-hidden text-ellipsis
                                "
                              >
                                {group.name}
                              </div>
                            </div>

                            {/* CATEGORY LIST (NO DROPDOWN) */}
                            <div className="flex flex-col gap-1">
                              {groupCategories.map((cat) => (
                                <div
                                  key={cat.id}
                                  onClick={() => {
                                    navigate(`/product-categories?category=${cat.name}`);
                                    setOpen(false);
                                  }}
                                  className="
                                    text-sm text-gray-600
                                    hover:text-primary
                                    cursor-pointer
                                    px-1 py-0.5
                                    rounded
                                    transition
                                    hover:translate-x-1
                                  "
                                >
                                  {cat.name}
                                </div>
                              ))}
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  </div>
                )}
              </div>

              {/* TENTANG KAMI */}
              <NavLink
                to="/company-profile"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-blue-800 pb-1 text-primary"
                    : "hover:text-primary"
                }
              >
                Tentang Kami
              </NavLink>

              {/* PRODUCT KATALOG */}
              <NavLink
                to="/product-katalog"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-blue-800 pb-1 text-primary"
                    : "hover:text-primary"
                }
              >
                Produk Katalog
              </NavLink>

              {/* RAKITAN */}
              <NavLink
                to="/pc-builder"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-blue-800 pb-1 text-primary"
                    : "hover:text-primary"
                }
              >
                Rakitan
              </NavLink>

            </div>
          </div>
        </div>

      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`
          fixed inset-0 z-[999]
          transition
          ${mobileMenuOpen ? "visible" : "invisible"}
        `}
      >
        
        {/* BACKDROP */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`
            absolute inset-0 bg-black/40 transition-opacity
            ${mobileMenuOpen ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* SIDEBAR */}
        <div
          className={`
            absolute top-0 left-0 h-full w-72
            bg-white shadow-xl
            transform transition-transform
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >

          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold text-lg">Menu</span>

            <button onClick={() => setMobileMenuOpen(false)}>
              ✕
            </button>
          </div>

          {/* MENU LIST */}
          <div className="flex flex-col p-4 gap-4">

            {/* HOME */}
            <div
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className="text-sm font-medium cursor-pointer"
            >
              Home
            </div>

            {/* PRODUK KATALOG */}
            <div
              onClick={() => {
                navigate("/product-katalog");
                setMobileMenuOpen(false);
              }}
              className="text-sm font-medium cursor-pointer"
            >
              Produk Katalog
            </div>

            {/* ================= KATEGORI ================= */}
            <div>

              {/* TITLE */}
              <div
                onClick={() => setOpenKategori(!openKategori)}
                className="flex items-center justify-between text-sm font-medium cursor-pointer"
              >
                <span>Kategori</span>

                <ChevronDown
                  size={16}
                  className={`transition ${openKategori ? "rotate-180" : ""}`}
                />
              </div>

              {/* LIST KATEGORI */}
              {openKategori && (
                <div className="mt-2 flex flex-col gap-2">

                  {categories
                    .filter((cat) => !cat.parent_id)
                    .map((parent) => {

                      const children = categories.filter(
                        (cat) => String(cat.parent_id) === String(parent.id)
                      );

                      const hasChildren = children.length > 0;
                      const isOpen = openCategory === parent.id;

                      return (
                        <div key={parent.id}>

                          {/* PARENT */}
                          <div
                            onClick={() => {
                              if (!hasChildren) {
                                navigate(`/parent-categories/${parent.name}`);
                                setMobileMenuOpen(false);
                              }
                            }}
                            className="flex items-center justify-between text-sm cursor-pointer pl-2"
                          >
                            <span>{parent.name}</span>

                            {hasChildren && (
                              <ChevronDown
                                size={14}
                                onClick={(e) => {
                                  e.stopPropagation(); // penting supaya tidak trigger navigate
                                  setOpenCategory(isOpen ? null : parent.id);
                                }}
                                className={`transition ${isOpen ? "rotate-180" : ""}`}
                              />
                            )}
                          </div>

                          {/* CHILD */}
                          {isOpen && hasChildren && (
                            <div className="pl-4 mt-1 flex flex-col gap-1">

                              {children.map((child) => (
                                <div
                                  key={child.id}
                                  onClick={() => {
                                    navigate(`/product-categories?category=${child.name}`);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="text-sm text-gray-600 cursor-pointer hover:text-primary"
                                >
                                  {child.name}
                                </div>
                              ))}

                            </div>
                          )}

                        </div>
                      );
                    })}

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL CARA PEMESANAN ================= */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOrderModalOpen(false)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-700 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-2">
                  <Workflow size={20} />
                </div>
                <h3 className="font-bold text-lg">Alur Pemesanan</h3>
              </div>
              <button 
                onClick={() => setIsOrderModalOpen(false)} 
                className="hover:bg-white/20 p-2 rounded-full transition"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {[
                {
                  step: 1,
                  text: "Cari produk yang kamu inginkan melalui halaman utama atau menu kategori yang tersedia."
                },
                {
                  step: 2,
                  text: "Klik ikon WhatsApp di produk atau masuk ke halaman detail produk untuk melihat informasi lengkap."
                },
                {
                  step: 3,
                  text: "Di halaman detail, kamu bisa memilih jumlah (quantity) sesuai dengan stok yang tersedia sebelum menghubungi admin."
                },
                {
                  step: 4,
                  text: "Setelah itu, hubungi admin via WhatsApp untuk konfirmasi produk, harga, dan ketersediaan."
                },
                {
                  step: 5,
                  text: "Pembayaran dapat dilakukan secara langsung (COD/Datang ke toko) atau melalui transfer bank sesuai instruksi admin."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100">
                    {item.step}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}

              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}