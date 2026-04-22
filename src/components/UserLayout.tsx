import { NavLink, Outlet } from "react-router-dom";
import { User, MapPin, Lock, ShoppingBag } from "lucide-react";

export default function UserLayout() {
  // Ambil data user untuk header sidebar
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

  // Helper untuk styling menu aktif (menggunakan logic dari snippet atas)
  const menuClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
    ${isActive 
      ? "text-primary font-semibold bg-blue-50" 
      : "text-gray-600 hover:bg-gray-100"
    }`;

  // Format URL Avatar
  const avatarUrl = userData.avatar_url?.startsWith("http")
    ? userData.avatar_url
    : userData.avatar_url 
      ? `${import.meta.env.VITE_API_BASE}${userData.avatar_url}`
      : "/default-avatar.png";

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR (KIRI) - Mengikuti struktur snippet atas */}
        <div className="w-full md:w-64 shrink-0 h-fit bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          
          {/* PROFILE HEADER */}
          <div className="flex items-center gap-3 pb-4 border-b mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border">
              <img 
                src={avatarUrl} 
                className="w-full h-full object-cover" 
                alt="profile"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                {userData.full_name || "Username"}
              </p>
              <NavLink to="/user/account/profile" className="text-[11px] text-gray-500 hover:text-primary transition-colors">
                Edit Profil
              </NavLink>
            </div>
          </div>

          {/* ================= MY ACCOUNT ================= */}
          <div className="mb-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 px-3">
              Akun Saya
            </p>

            <div className="flex flex-col gap-1">
              <NavLink to="/user/account/profile" className={menuClass}>
                <User size={16} /> Profil
              </NavLink>

              <NavLink to="/user/account/addresses" className={menuClass}>
                <MapPin size={16} /> Alamat
              </NavLink>

              <NavLink to="/user/account/change-password" className={menuClass}>
                <Lock size={16} /> Ubah Password
              </NavLink>
            </div>
          </div>

          {/* ================= MY PURCHASE ================= */}
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 px-3">
              Pesanan
            </p>

            <NavLink to="/user/purchase" className={menuClass}>
              <ShoppingBag size={16} /> Pesanan Saya
            </NavLink>
          </div>
        </div>

        {/* KONTEN DINAMIS (KANAN) */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
}