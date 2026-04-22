import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, Camera } from "lucide-react";
// 🔥 Tambahkan uploadAvatar di import
import { getUserProfile, updateUserProfile, uploadAvatar } from "../../../services/userAuthService";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    avatar_url: "",
    gender: "", 
    date_of_birth: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.requirePhone) {
      Swal.fire({
        toast: true, position: 'bottom-end', icon: 'warning',
        title: 'Lengkapi Data Terlebih Dahulu',
        text: 'Isi nomor WhatsApp sebelum checkout.',
        showConfirmButton: false, timer: 4000, timerProgressBar: true
      });
      window.history.replaceState({}, document.title);
    }
    fetchProfile();
  }, [location]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setFormData({
        full_name: data.full_name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        avatar_url: data.avatar_url || "",
        gender: data.gender || "",
        date_of_birth: data.birth_date ? data.birth_date.split("T")[0] : "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNGSI UPLOAD & VALIDASI 1MB
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi Ukuran (1 MB = 1048576 bytes)
    if (file.size > 1024 * 1024) {
      Swal.fire("Ukuran Terlalu Besar", "Maksimal ukuran gambar adalah 1 MB", "error");
      return;
    }

    // Buat Preview Lokal
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Langsung Upload ke Server
    try {
      setSaving(true);
      const res = await uploadAvatar(file);
      setFormData({ ...formData, avatar_url: res.avatar_url });
      Swal.fire({ icon: 'success', title: 'Foto diunggah', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    } catch (err) {
      Swal.fire("Gagal", "Gagal mengunggah gambar", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        gender: formData.gender,
        avatar_url: formData.avatar_url,
        birth_date: formData.date_of_birth,
      };

      await updateUserProfile(payload);
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Profil diperbarui!', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal update data.' });
    } finally {
      setSaving(false);
    }
  };

  // Validasi sederhana
  const [errors, setErrors] = useState({ full_name: "", phone_number: "" });
  const validate = () => {
    const newErrors = { full_name: "", phone_number: "" };
    if (!formData.full_name.trim()) newErrors.full_name = "Nama wajib diisi";
    if (!formData.phone_number.trim()) newErrors.phone_number = "Nomor HP wajib diisi";
    setErrors(newErrors);
    return !newErrors.full_name && !newErrors.phone_number;
  };

  const getAvatarUrl = () => {
    if (imagePreview) return imagePreview;
    if (!formData.avatar_url) return "/default-avatar.png";
    if (formData.avatar_url.startsWith("http")) return formData.avatar_url;
    return `${import.meta.env.VITE_API_BASE}${formData.avatar_url}`;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="animate-fadeIn">
      <div className="border-b pb-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Profil Saya</h2>
        <p className="text-sm text-gray-500">Kelola informasi profil untuk keamanan akun Anda.</p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-12">
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          {/* Input Nama */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-start gap-4">
            <label className="text-sm text-gray-600 mt-2">Nama <span className="text-red-500">*</span></label>
            <div>
              <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.full_name ? "border-red-500" : "focus:border-blue-500"}`} />
              {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-4">
            <label className="text-sm text-gray-600">Email</label>
            <span className="text-sm font-medium text-gray-400">{formData.email}</span>
          </div>

          {/* Nomor HP */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-start gap-4">
            <label className="text-sm text-gray-600 mt-2">Nomor HP <span className="text-red-500">*</span></label>
            <div>
              <input type="tel" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.phone_number ? "border-red-500" : "focus:border-blue-500"}`} />
              {errors.phone_number && <p className="text-xs text-red-500 mt-1">{errors.phone_number}</p>}
            </div>
          </div>

          {/* Gender */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-4">
            <label className="text-sm text-gray-600">Jenis Kelamin</label>
            <div className="flex gap-6">
              {[{ label: 'Laki-laki', value: 'MALE' }, { label: 'Perempuan', value: 'FEMALE' }, { label: 'Lainnya', value: 'OTHER' }].map(g => (
                <label key={g.value} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="gender" value={g.value} checked={formData.gender === g.value} onChange={(e) => setFormData({...formData, gender: e.target.value})} /> {g.label}
                </label>
              ))}
            </div>
          </div>

          {/* Tgl Lahir */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-4">
            <label className="text-sm text-gray-600">Tanggal Lahir</label>
            <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="px-4 py-2 border rounded-lg outline-none focus:border-blue-500" />
          </div>

          <div className="md:ml-[136px] pt-4">
            <button type="submit" disabled={saving} className="bg-primary text-white px-10 py-2.5 rounded-md font-bold hover:bg-primary/90 disabled:bg-blue-300 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
              {saving ? <Loader2 size={18} className="animate-spin" /> : "Simpan Profil"}
            </button>
          </div>
        </form>

        {/* FOTO KANAN */}
        <div className="w-full md:w-64 flex flex-col items-center md:border-l pl-0 md:pl-12">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img src={getAvatarUrl()} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
          <p className="mt-4 text-[11px] text-gray-400 text-center leading-relaxed">
            Ukuran gambar: maks. 1 MB <br/> Format: JPEG, PNG
          </p>
        </div>
      </div>
    </div>
  );
}