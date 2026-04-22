import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { resetPasswordUser } from "../../../services/userAuthService";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false); // 🔥 Tambahan toggle konfirmasi
  
  const [formData, setFormData] = useState({ password: "", confirm_password: "" });

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      return Swal.fire("Error", "Password baru minimal 6 karakter", "error");
    }

    if (formData.password !== formData.confirm_password) {
      return Swal.fire("Error", "Konfirmasi password tidak cocok", "error");
    }
    
    if (!token) {
      return Swal.fire("Error", "Token tidak valid atau sudah kadaluarsa. Silakan minta link baru.", "error");
    }

    setLoading(true);
    try {
      await resetPasswordUser({ token, password: formData.password });
      
      await Swal.fire({
        icon: "success",
        title: "Password Diperbarui",
        text: "Sekarang Anda bisa login dengan password baru.",
        timer: 3000,
        showConfirmButton: false
      });
      
      navigate("/"); // Arahkan ke halaman utama/login
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Token expired atau tidak valid", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Buat Password Baru</h2>
          <p className="text-sm text-gray-500 mt-2">Silakan masukkan password baru yang kuat untuk akun Anda.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
            {/* Kolom Password Baru */}
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    required
                    type={showPass ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password Baru (Min. 6 Karakter)"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Kolom Konfirmasi Password */}
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    required
                    type={showConfirmPass ? "text" : "password"}
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    placeholder="Konfirmasi Password Baru"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button 
                    type="button" 
                    onClick={() => setShowConfirmPass(!showConfirmPass)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Simpan Password Baru"}
            </button>
        </form>
      </div>
    </div>
  );
}