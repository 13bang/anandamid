import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Search, MessageCircle, CircleQuestionMark, Home } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import { getProducts } from "../services/productService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      const res = await getProducts({
        search: search,
        page: 1,
        limit: 5,
      });

      setResults(res.data); // <-- ambil dari .data
      setShowDropdown(true);
    }, 300);

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

  return (
    <>
      {/* ================= TOP INFO BAR ================= */}
      {/* 1. Tambah overflow-hidden di div paling luar ini */}
      <div className="w-full bg-gray-50 text-xs border-b border-gray-400 overflow-hidden">
        
        {/* 2. Sisipkan CSS Keyframes di sini */}
        <style>{`
          .animate-info-bar {
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
        `}</style>

        {/* 3. Tambah class animate-info-bar di div pembungkus konten ini */}
        <div className="w-full mx-auto px-6 py-2 flex items-center justify-between text-gray-700 animate-info-bar">

          {/* LEFT */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">
              Jam Operasional:
            </span>
            <span>
              Senin–Sabtu 08.00–21.00 | Minggu / Libur Nasional 10.00–19.00
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition">
              <CircleQuestionMark size={14} />
              <span className="font-medium">
                Cara Pemesanan
              </span>
            </div>

            <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition">
              <MessageCircle size={14} />
              <span className="font-medium">
                Hubungi Kami
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* ================= TOP NAVBAR (Logo + Search) ================= */}
      <div className="w-full bg-gray-50">
        <div className="flex items-center justify-between px-6 mx-auto max-w-7xl h-16">

          {/* Logo */}
          <Link to="/">
            <img
              src="/anandam-logo-blue.svg"
              alt="Anandam Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-72">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  pl-10 pr-4 py-2
                  text-sm
                  bg-white
                  border border-gray-300
                  rounded-md
                  focus:outline-none
                  focus:ring-2 focus:ring-primary
                  focus:border-primary
                  transition
                "
              />
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-[999] overflow-hidden">
                
                {results.length > 0 ? (
                  results.map((item) => {
                    const finalPrice = item.price_discount
                      ? Number(item.price_normal) - Number(item.price_discount)
                      : Number(item.price_normal);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          navigate(`/product-katalog/${item.id}`);
                          setShowDropdown(false);
                          setSearch("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
                      >
                        <img
                          src={
                            item.thumbnail_url
                              ? item.thumbnail_url.startsWith("http")
                                ? item.thumbnail_url
                                : `http://localhost:3000${item.thumbnail_url}`
                              : "/icon-anandam.svg"
                          }
                          className="w-12 h-12 object-contain bg-white rounded"
                        />

                        <div className="flex flex-col text-xs">
                          <span className="font-medium line-clamp-1">
                            {item.name}
                          </span>
                          <span className="text-red-600 font-semibold">
                            Rp {finalPrice.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    Produk tidak ditemukan
                  </div>
                )}
              </div>
            )}

          </form>
        </div>
      </div>

      {/* ================= BOTTOM NAVBAR (Menu Sticky) ================= */}
      <nav
        className={`
          sticky top-0 z-50 w-full bg-primary2
          transition-all duration-300
          ${isScrolled ? "shadow-lg py-3" : "py-4"}
        `}
      >
        <div className="w-full mx-auto px-8">
          <div className="flex gap-12 text-sm font-medium text-white">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center pb-1 transition ${
                  isActive
                    ? "border-b-2 border-white"
                    : "hover:text-gray-200 hover:border-b-2"
                }`
              }
            >
              <Home size={18} strokeWidth={2} />
            </NavLink>

            <NavLink
              to="/product-katalog"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-gray-200"
              }
            >
              Product Katalog
            </NavLink>

          </div>
        </div>
      </nav>
    </>
  );
}