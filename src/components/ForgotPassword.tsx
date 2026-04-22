import { useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import { forgotPasswordUser } from "../services/userAuthService";
import Swal from "sweetalert2";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
        await forgotPasswordUser(email);
        Swal.fire({
            icon: "success",
            title: "Email Terkirim",
            text: "Silakan cek kotak masuk email Anda untuk link reset password.",
        });
        setEmail("");
        onClose(); // Tutup modal otomatis jika sukses
        } catch (error: any) {
        Swal.fire("Gagal", error.response?.data?.message || "Email tidak terdaftar", "error");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-popIn relative">
                
                <button 
                onClick={onClose} 
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
                >
                <X size={20} />
                </button>
                
                <div className="text-center mb-8 mt-2">
                    <h2 className="text-2xl font-bold text-gray-900">Lupa Password?</h2>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Masukkan email Anda untuk menerima link reset password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Email</label>
                    <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 py-3.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                    Batal
                    </button>
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                    {loading ? <Loader2 className="animate-spin" /> : "Kirim Link Reset"}
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}