import { useState } from "react";
// Link dihapus karena kita pakai Button untuk buka Modal
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { changePasswordUser } from "../../../services/userAuthService";
import Swal from "sweetalert2";

import ForgotPasswordModal from "../../../components/ForgotPassword"; 

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      return Swal.fire("Error", "Konfirmasi password baru tidak cocok", "error");
    }
    if (formData.new_password.length < 6) {
      return Swal.fire("Error", "Password baru minimal 6 karakter", "error");
    }

    setLoading(true);
    try {
      await changePasswordUser({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Password Anda telah diubah!",
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengubah password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn relative">
      <div className="border-b pb-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Ubah Password</h2>
        <p className="text-sm text-gray-500">Demi keamanan akun, jangan bagikan password Anda ke orang lain.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        {/* Password Lama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
          <div className="relative">
            <input
              required
              type={showOld ? "text" : "password"}
              value={formData.old_password}
              onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Masukkan password lama"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="mt-2 text-right">
            {/* 🔥 3. Ubah menjadi button untuk memicu modal */}
            <button 
              type="button"
              onClick={() => setIsForgotModalOpen(true)} 
              className="text-xs text-primary font-semibold hover:underline"
            >
              Lupa password?
            </button>
          </div>
        </div>

        <div className="border-t pt-6 space-y-6">
          {/* Password Baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
            <div className="relative">
              <input
                required
                type={showNew ? "text" : "password"}
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password Baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
            <input
              required
              type="password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Ulangi password baru"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
          Simpan Password
        </button>
      </form>

        <ForgotPasswordModal 
            isOpen={isForgotModalOpen} 
            onClose={() => setIsForgotModalOpen(false)} 
        />
    </div>
  );
}