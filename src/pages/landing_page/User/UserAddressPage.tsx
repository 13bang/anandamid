import { useEffect, useState } from "react";
import { MapPin, Home, Plus, Edit2, Loader2, Trash2, CheckCircle2, X, Save } from "lucide-react";

import { 
  getMyAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  type AddressDto
} from "../../../services/userAuthService";

import Swal from "sweetalert2";

export default function UserAddressPage() {
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AddressDto>({
    label: "Rumah",
    recipient_name: "",
    phone_number: "",
    full_address: "",
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (addr?: AddressDto) => {
    if (addr) {
      setFormData(addr);
    } else {
      setFormData({
        label: "Rumah",
        recipient_name: "",
        phone_number: "",
        full_address: "",
        is_default: addresses.length === 0, 
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await updateAddress(formData.id, formData);
      } else {
        await addAddress(formData);
      }
      Swal.fire({ icon: "success", title: "Berhasil!", timer: 1500, showConfirmButton: false });
      setShowModal(false);
      fetchAddresses();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Gagal", text: "Terjadi kesalahan saat menyimpan." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Hapus Alamat?",
      text: "Alamat yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAddress(id);
        fetchAddresses();
      } catch (err) {
        Swal.fire("Gagal", "Alamat gagal dihapus.", "error");
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm font-medium">Memuat data alamat...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alamat Saya</h2>
          <p className="text-sm text-gray-500">Kelola lokasi pengiriman pesanan Anda</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-md hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Tambah Alamat Baru
        </button>
      </div>

      {/* ADDRESS LIST */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <MapPin className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">Belum ada alamat tersimpan</p>
          </div>
        ) : (
          addresses.map((item) => (
            <div 
              key={item.id} 
              className={`p-5 rounded-2xl border transition-all ${
                item.is_default ? "border-primary bg-blue-50/30" : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                    item.is_default ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    <Home size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900">{item.label}</span>
                      {item.is_default && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      {item.recipient_name} <span className="text-gray-400 font-normal">| {item.phone_number}</span>
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.full_address}</p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0">
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all">
                      <Edit2 size={16} />
                    </button>
                    {!item.is_default && (
                      <button onClick={() => item.id && handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  {!item.is_default && (
                    <button 
                      onClick={() => item.id && handleSetDefault(item.id)}
                      className="text-[11px] font-bold text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
                    >
                      Set Utama
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-popIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{formData.id ? "Edit Alamat" : "Tambah Alamat Baru"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Label Alamat</label>
                  <input
                    required
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="Rumah / Kantor / Kost"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Nama Penerima</label>
                  <input
                    required
                    type="text"
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
                    placeholder="Nama Lengkap"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Nomor Telepon</label>
                <input
                  required
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  placeholder="08xxxxxxxxxx"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Alamat Lengkap</label>
                <textarea
                  required
                  rows={3}
                  value={formData.full_address}
                  onChange={(e) => setFormData({...formData, full_address: e.target.value})}
                  placeholder="Nama jalan, Nomor rumah, RT/RW, Kecamatan, Kota, Kode Pos"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-all">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Jadikan Alamat Utama</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 font-bold rounded-md hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}