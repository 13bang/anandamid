import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/adminOrderService";
import { Eye, CheckCircle, XCircle, X } from "lucide-react"; 
import Swal from "sweetalert2";

export default function OrderListPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders({ status: filterStatus });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const confirm = await Swal.fire({
      title: `Ubah status ke ${newStatus}?`,
      text: newStatus === "LUNAS" ? "Stok barang akan otomatis dikurangi." : "Status akan diperbarui.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "LUNAS" ? "#10b981" : "#ef4444",
      confirmButtonText: "Ya, Update",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await updateOrderStatus(orderId, newStatus);
        Swal.fire("Berhasil!", `Pesanan menjadi ${newStatus}`, "success");
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } catch (err: any) {
        Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      LUNAS: "text-green-600 bg-green-50",
      PENDING: "text-yellow-600 bg-yellow-50",
      BATAL: "text-red-600 bg-red-50",
    };
    const badgeStyle = styles[status] || "text-gray-600 bg-gray-50";
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeStyle}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daftar Pesanan</h1>
          </div>
          <select
            className="mt-4 sm:mt-0 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="LUNAS">Lunas</option>
            <option value="BATAL">Batal</option>
          </select>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4 font-medium">Invoice</th>
                <th className="p-4 font-medium">Pelanggan</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{order.invoice_number}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{order.user?.full_name}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === "PENDING" && (
                          <>
                            <button onClick={() => handleUpdateStatus(order.id, "LUNAS")} className="text-green-600 hover:bg-green-50 p-1.5 rounded transition" title="Tandai Lunas"><CheckCircle size={18} /></button>
                            <button onClick={() => handleUpdateStatus(order.id, "BATAL")} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition" title="Batalkan"><XCircle size={18} /></button>
                          </>
                        )}
                        <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition" title="Lihat Detail"><Eye size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500 italic">Belum ada data pesanan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DETAIL PESANAN --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Detail Pesanan</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition"><X size={20} /></button>
            </div>

            <div className="p-5 space-y-4 text-sm text-gray-700 overflow-y-auto">
              <div className="grid grid-cols-2 gap-y-2 border-b pb-4">
                <div className="text-gray-500">No. Invoice</div>
                <div className="font-medium text-right text-gray-900">{selectedOrder.invoice_number}</div>
                <div className="text-gray-500">Tanggal</div>
                <div className="text-right">{new Date(selectedOrder.created_at).toLocaleString('id-ID')}</div>
                <div className="text-gray-500">Status</div>
                <div className="text-right">{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* DAFTAR PRODUK */}
              <div className="border-b pb-4">
                <div className="text-gray-500 mb-2 font-semibold">Item Produk:</div>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="font-medium text-gray-900">{item.product_name}</div>
                        <div className="text-xs text-gray-500">{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</div>
                      </div>
                      <div className="font-semibold text-gray-800">
                        Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CATATAN (NOTES) */}
              {selectedOrder.notes && (
                <div className="bg-gray-50 p-3 rounded-md border border-dashed border-gray-300">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Catatan:</div>
                  <div className="italic text-gray-700">"{selectedOrder.notes}"</div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-gray-800 text-base">Total Pembayaran</span>
                <span className="font-bold text-xl text-blue-600">
                  Rp {Number(selectedOrder.total_price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium text-sm transition">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}