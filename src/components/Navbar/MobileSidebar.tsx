import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";

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

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const navTo = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[1000] transition ${isOpen ? "visible" : "invisible"}`}>
      <div 
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div className={`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4 border-b bg-gray-50">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {currentUser.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{currentUser.full_name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
              </div>
              <button onClick={onLogout} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => { onClose(); onOpenAuth('login'); }}
                className="flex-1 bg-white border border-blue-700 text-blue-700 py-2 rounded-lg text-sm font-semibold text-center"
              >
                Masuk
              </button>
              <button 
                onClick={() => { onClose(); onOpenAuth('register'); }}
                className="flex-1 bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold text-center"
              >
                Daftar
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col p-4 gap-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div onClick={() => navTo("/")} className="text-sm font-medium cursor-pointer">Home</div>
          <div onClick={() => navTo("/company-profile")} className="text-sm font-medium cursor-pointer">Tentang Kami</div>
          <div onClick={() => navTo("/product-katalog")} className="text-sm font-medium cursor-pointer">Produk Katalog</div>
          <div onClick={() => navTo("/pc-builder")} className="text-sm font-medium cursor-pointer">Rakitan</div>
          <div onClick={() => navTo("/price-list")} className="text-sm font-medium cursor-pointer">Pricelist</div>

          <div>
            <div onClick={() => setOpenKategori(!openKategori)} className="flex items-center justify-between text-sm font-medium cursor-pointer">
              <span>Kategori</span>
              <ChevronDown size={16} className={`transition ${openKategori ? "rotate-180" : ""}`} />
            </div>

            {openKategori && (
              <div className="mt-2 flex flex-col gap-1">
                {groupings.map((group) => {
                  const hasChildren = group.children && group.children.length > 0;
                  const isGroupOpen = expandedGroups.includes(group.id);

                  return (
                    <div key={group.id} className="flex flex-col">
                      <div onClick={() => toggleGroup(group.id)} className="flex items-center justify-between text-sm cursor-pointer pl-2 py-1.5">
                        <span className={isGroupOpen ? "font-semibold text-primary" : "text-gray-800"}>{group.name}</span>
                        {hasChildren && <ChevronDown size={14} className={`transition ${isGroupOpen ? "rotate-180 text-primary" : "text-gray-500"}`} />}
                      </div>

                      {isGroupOpen && hasChildren && (
                        <div className="pl-6 flex flex-col gap-2 mt-1 mb-2 border-l-2 border-gray-100 ml-3">
                          <div onClick={() => navTo(`/product-grouping?grouping=${group.name}`)} className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-primary">
                            Semua di {group.name}
                          </div>
                          {group.children.map((cat) => (
                            <div key={cat.id} onClick={() => navTo(`/product-categories?category=${cat.name}`)} className="text-sm text-gray-600 cursor-pointer hover:text-primary">
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
      </div>
    </div>
  );
}