import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Phone, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="w-full bg-gray-50 text-black text-xs border-b border-black">
        <div className="w-full mx-auto px-6 py-2 flex items-center justify-between">

          {/* KIRI - Jadwal */}
          <div>
            Waktu Operasional : Senin - Sabtu pukul 08.00 - 21.00 WIB, 
            Minggu/Hari Libur pukul 10.00 - 19.00
          </div>

          {/* KANAN */}
          <div className="flex items-center gap-6">

            <div className="flex items-center gap-2 hover:text-gray-700 cursor-pointer transition">
              <Phone size={14} />
              <span>Cara Pemesanan</span>
            </div>

            <div className="flex items-center gap-2 hover:text-gray-700 cursor-pointer transition">
              <MessageCircle size={14} />
              <span>Hubungi Kami</span>
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
          <form onSubmit={handleSearch} className="group relative">
            <div
              className="
                flex items-center
                h-10
                bg-black
                rounded-full
                overflow-hidden
                transition-all duration-300 ease-in-out
                w-10
                group-hover:w-56
              "
            >
              <div className="flex items-center justify-center w-10 h-10 shrink-0">
                <Search size={18} strokeWidth={2} className="text-white" />
              </div>

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  bg-transparent
                  outline-none
                  text-sm
                  text-white
                  placeholder-gray-400
                  w-full
                  pr-4
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-200
                "
              />
            </div>
          </form>
        </div>
      </div>

      {/* ================= BOTTOM NAVBAR (Menu Sticky) ================= */}
      <nav
        className={`
          sticky top-0 z-50 w-full bg-primary
          transition-all duration-300
          ${isScrolled ? "shadow-lg py-3" : "py-4"}
        `}
      >
        <div className="w-full mx-auto px-6">
          <div className="flex gap-12 text-sm font-medium text-white">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-gray-200"
              }
            >
              Home
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