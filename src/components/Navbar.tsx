import { NavLink, Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!search.trim()) return;

      navigate(`/product?search=${encodeURIComponent(search)}`);
    };

    return (
    <nav className="w-full bg-primary shadow-sm">
      <div className="relative flex items-center justify-between px-2 mx-auto max-w-7xl h-16">

        {/* Logo - Left */}
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/anandam-logo.svg"
              alt="Anandam Logo" 
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Menu - TRUE Center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-10 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-white border-b-2 border-white pb-1"
                : "text-white/80 hover:text-white"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/product"
            className={({ isActive }) =>
              isActive
                ? "text-white border-b-2 border-white pb-1"
                : "text-white/80 hover:text-white"
            }
          >
            Product
          </NavLink>
        </div>

        {/* Search */}
        <div className="flex items-center">
          <form onSubmit={handleSearch} className="group relative">

            <div
              className="
                flex items-center
                h-10
                bg-white
                rounded-full
                overflow-hidden
                transition-all duration-300 ease-in-out
                w-10
                group-hover:w-56
                backdrop-blur-sm
              "
            >
              {/* ICON WRAPPER */}
              <div className="flex items-center justify-center w-10 h-10 shrink-0">
                <Search size={18} strokeWidth={2} className="text-black" />
              </div>

              {/* INPUT */}
              <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    bg-transparent
                    outline-none
                    text-sm
                    text-black
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
    </nav>
  );
}