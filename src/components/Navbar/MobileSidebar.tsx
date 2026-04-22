import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  ChevronDown, 
  Home, 
  Info, 
  Package, 
  Cpu, 
  User, 
  LogIn, 
  X,
  LayoutGrid,
  ShoppingBag
} from "lucide-react";

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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onLogout: () => void;
  onOpenAuth: (mode: "login" | "register") => void;
  groupings: Grouping[];
}

export default function MobileSidebar({ isOpen, onClose, currentUser, onLogout, onOpenAuth, groupings }: MobileSidebarProps) {
  const navigate = useNavigate();
  const [openKategori, setOpenKategori] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Fungsi untuk memuat URL Avatar persis seperti di Navbar
  const getAvatarUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE}${url}`;
  };

  // Mengunci scroll body saat sidebar buka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const navTo = (path: string) => {
    navigate(path);
    onClose();
  };

  const MenuItem = ({ icon: Icon, label, onClick, active = false }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-4 border-b border-gray-50 transition-all active:bg-gray-100 cursor-pointer ${
        active ? "text-primary bg-blue-50/50" : "text-gray-700"
      }`}
    >
      <Icon size={20} className={active ? "text-primary" : "text-gray-400"} />
      <span className="text-sm font-semibold tracking-tight">{label}</span>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[2000] transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar Panel */}
      <div className={`absolute top-0 left-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Header Section */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 tracking-tighter text-xl">ANANDAM STORE</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Area */}
        <div className="p-5 border-b bg-white">
          {currentUser ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {currentUser.avatar_url ? (
                    <img 
                      src={getAvatarUrl(currentUser.avatar_url)} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                      {currentUser.full_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Indikator warning jika belum ada nomor HP */}
                  {(!currentUser.phone_number || currentUser.phone_number.trim() === "") && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white"></span>
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{currentUser.full_name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              {/* Action Buttons: Profil & Pesanan */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button 
                  onClick={() => navTo("/user/account/profile")}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-50/50 text-primary border border-blue-100 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors active:scale-95"
                >
                  <User size={14} /> Profil
                </button>
                <button 
                  onClick={() => navTo("/orders_history")}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-50/50 text-primary border border-blue-100 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors active:scale-95"
                >
                  <ShoppingBag size={14} /> Pesanan
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onOpenAuth("login")}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <LogIn size={14} /> Masuk
              </button>
              <button 
                onClick={() => onOpenAuth("register")}
                className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold active:scale-95 transition-all"
              >
                Daftar
              </button>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-270px)] scrollbar-hide">
          <MenuItem icon={Home} label="Beranda" onClick={() => navTo("/")} />
          <MenuItem icon={Info} label="Tentang Kami" onClick={() => navTo("/company-profile")} />
          <MenuItem icon={Package} label="Produk Katalog" onClick={() => navTo("/product-katalog")} />
          <MenuItem icon={Cpu} label="Rakit PC" onClick={() => navTo("/pc-builder")} />

          {/* Collapsible Kategori */}
          <div className="flex flex-col border-b border-gray-50">
            <div 
              onClick={() => setOpenKategori(!openKategori)} 
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${openKategori ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid size={20} className={openKategori ? "text-primary" : "text-gray-400"} />
                <span className={`text-sm font-semibold ${openKategori ? "text-primary" : "text-gray-700"}`}>Kategori</span>
              </div>
              <ChevronDown size={18} className={`transition-transform duration-300 text-gray-400 ${openKategori ? "rotate-180 text-primary" : ""}`} />
            </div>

            {openKategori && (
              <div className="bg-gray-50/50 pb-2">
                {groupings.map((group) => {
                  const hasChildren = group.children && group.children.length > 0;
                  const isGroupOpen = expandedGroups.includes(group.id);

                  return (
                    <div key={group.id} className="flex flex-col px-4">
                      <div 
                        onClick={() => toggleGroup(group.id)} 
                        className={`flex items-center justify-between py-3 px-3 rounded-xl transition-all cursor-pointer ${
                          isGroupOpen ? "text-primary font-bold" : "text-gray-600 font-medium"
                        }`}
                      >
                        <span className="text-sm">{group.name}</span>
                        {hasChildren && <ChevronDown size={14} className={`transition-transform ${isGroupOpen ? "rotate-180" : ""}`} />}
                      </div>

                      {isGroupOpen && hasChildren && (
                        <div className="ml-4 pl-4 border-l-2 border-primary/20 flex flex-col gap-1 mb-2 animate-fadeIn">
                          <div 
                            onClick={() => navTo(`/product-grouping?grouping=${group.name}`)} 
                            className="py-2 text-xs font-bold text-primary hover:underline cursor-pointer"
                          >
                            Lihat Semua {group.name}
                          </div>
                          {group.children.map((cat) => (
                            <div 
                              key={cat.id} 
                              onClick={() => navTo(`/product-categories?category=${cat.name}`)} 
                              className="py-2 text-xs text-gray-500 hover:text-primary cursor-pointer transition-colors"
                            >
                              {cat.name}
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

        {/* Footer Logout */}
        {currentUser && (
          <div className="absolute bottom-0 left-0 w-full p-5 bg-white border-t">
            <button 
              onClick={onLogout}
              className="flex items-center justify-center gap-3 w-full py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors active:scale-95"
            >
              <LogOut size={18} /> Keluar Akun
            </button>
          </div>
        )}
      </div>
    </div>
  );
}