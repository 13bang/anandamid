import { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, Loader2, Save, Camera, AlertTriangle } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../services/userAuthService";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    avatar_url: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- AUTO-HIDE MESSAGE ---
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setFormData({
        full_name: data.full_name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        avatar_url: data.avatar_url || "",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Gagal memuat data profil." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Ukuran gambar maksimal 2MB." });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      try {
        setSaving(true);
        setMessage({ type: "loading", text: "Sedang mengupload foto..." });

        const uploadData = new FormData();
        uploadData.append("file", file);

        const token = localStorage.getItem("user_token");

        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/user/auth/profile/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadData
        });

        if (!res.ok) throw new Error("Gagal mengupload gambar");

        const result = await res.json();
        setFormData(prev => ({ ...prev, avatar_url: result.avatar_url }));
        
        const currentUserData = JSON.parse(localStorage.getItem("user_data") || "{}");
        const updatedData = { ...currentUserData, avatar_url: result.avatar_url };
        localStorage.setItem("user_data", JSON.stringify(updatedData));
        
        window.dispatchEvent(new Event("storage"));
        setMessage({ type: "success", text: "Foto profil berhasil diperbarui!" });
      } catch (err: any) {
        setMessage({ type: "error", text: "Gagal mengupload gambar ke server." });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await updateUserProfile({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
      });
      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      window.dispatchEvent(new Event("storage"));
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Gagal memperbarui profil." 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "U";
  };

  const formatImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    return `${import.meta.env.VITE_API_BASE}${url}`;
  };

  const displayImage = imagePreview || formatImageUrl(formData.avatar_url);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="bg-blue-600 h-32 relative">
           {!formData.phone_number && (
             <div className="absolute top-4 left-0 right-0 flex justify-center">
               <div className="bg-orange-500/90 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-sm backdrop-blur-sm animate-bounce">
                 <AlertTriangle size={16} /> Mohon lengkapi nomor WhatsApp Anda
               </div>
             </div>
           )}
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/jpeg, image/png, image/jpg" 
                className="hidden" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 cursor-pointer group relative overflow-hidden"
              >
                {displayImage ? (
                  <img 
                    src={displayImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  getInitials(formData.full_name)
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-white text-[10px] font-medium">Ubah Foto</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Profil</h2>

          {/* Animasi Transisi Halus untuk Pesan */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-lg text-sm transition-all duration-500 transform translate-y-0 opacity-100 ${
              message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : 
              message.type === "loading" ? "bg-blue-50 text-blue-700 border border-blue-200" :
              "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <div className="flex items-center gap-2">
                {message.type === "loading" && <Loader2 size={16} className="animate-spin" />}
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="pl-10 w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Nomor WhatsApp
                {!formData.phone_number && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200">Wajib Diisi</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 08123456789"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition ${
                    !formData.phone_number ? "border-orange-300 focus:ring-orange-500 focus:border-orange-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}