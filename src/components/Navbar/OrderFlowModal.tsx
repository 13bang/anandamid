import { Workflow } from "lucide-react";

interface OrderFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderFlowModal({ isOpen, onClose }: OrderFlowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-700 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2">
              <Workflow size={20} />
            </div>
            <h3 className="font-bold text-lg">Alur Pemesanan</h3>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-2 rounded-full transition"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {[
            { step: 1, text: "Cari produk yang kamu inginkan melalui halaman utama atau menu kategori yang tersedia." },
            { step: 2, text: "Klik ikon WhatsApp di produk atau masuk ke halaman detail produk untuk melihat informasi lengkap." },
            { step: 3, text: "Di halaman detail, kamu bisa memilih jumlah (quantity) sesuai dengan stok yang tersedia sebelum menghubungi admin." },
            { step: 4, text: "Setelah itu, hubungi admin via WhatsApp untuk konfirmasi produk, harga, dan ketersediaan." },
            { step: 5, text: "Pembayaran dapat dilakukan secara langsung (COD/Datang ke toko) atau melalui transfer bank sesuai instruksi admin." }
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100">
                {item.step}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}

          <button 
            onClick={onClose}
            className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}