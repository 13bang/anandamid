import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../../services/orderSevice"; 
import api from "../../../services/api";
import { Package, Store, ShoppingBag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("SEMUA");

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await getUserOrders();
      const orderData = Array.isArray(res) ? res : res.data || [];
      setOrders(orderData);
    } catch (error) {
      console.error("Gagal mengambil riwayat pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirm = await Swal.fire({
      title: 'Batalkan Pesanan?',
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Batalkan',
      cancelButtonText: 'Kembali'
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("user_token");
        await api.patch(`/orders/${orderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire("Berhasil", "Pesanan berhasil dibatalkan", "success");
        fetchMyOrders();
      } catch (err: any) {
        Swal.fire("Gagal", err.response?.data?.message || "Gagal membatalkan pesanan", "error");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "SEMUA") return true;
    return order.status === activeTab;
  });

  // Disesuaikan untuk style text ala Shopee (hanya warna teks, tanpa background pill)
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "LUNAS":
        return { color: "text-primary", label: "SELESAI" };
      case "PENDING":
        return { color: "text-orange-500", label: "BELUM BAYAR" };
      case "BATAL":
        return { color: "text-red-500", label: "DIBATALKAN" };
      default:
        return { color: "text-gray-600", label: status.toUpperCase() };
    }
  };

  const getProductImage = (product: any) => {
    if (!product) return null;
    let imgPath = null;
    
    if (product.thumbnail) {
      imgPath = product.thumbnail;
    } else if (product.images && product.images.length > 0) {
      imgPath = product.images[0]?.image_url || product.images[0];
    } else if (product.image_url) {
      imgPath = product.image_url;
    }

    if (!imgPath) return null;
    return imgPath.startsWith("http") 
      ? imgPath 
      : `${import.meta.env.VITE_API_BASE}${imgPath}`;
  };

  return (
    <div className="min-h-screen pb-10 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* --- TABS FILTER (Ala Shopee) --- */}
        <div className="bg-white flex overflow-x-auto shadow-sm mb-4 rounded-sm hide-scrollbar">
          {[
            { id: "SEMUA", label: "Semua" },
            { id: "PENDING", label: "Belum Bayar" },
            { id: "LUNAS", label: "Selesai" },
            { id: "BATAL", label: "Dibatalkan" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] py-4 text-sm text-center font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-700 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- ORDER LIST --- */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                  
                  {/* Card Header: Store Name / Invoice & Status */}
                  <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store size={16} className="text-gray-600" />
                      <span className="font-semibold text-sm text-gray-800">
                        {order.invoice_number}
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${statusStyle.color}`}>
                      {statusStyle.label}
                    </div>
                  </div>

                  {/* Card Body: Products */}
                  <div className="p-4 space-y-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    {order.items?.map((item: any) => {
                      const imageUrl = getProductImage(item.product);

                      return (
                        <Link to={`/product-katalog/${item.product_id}`} key={item.id} className="flex gap-4 items-start">
                          {/* Gambar Produk */}
                          <div className="w-20 h-20 bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            {imageUrl ? (
                              <img src={imageUrl} alt={item.product_name} className="w-full h-full object-contain" />
                            ) : (
                              <Package className="text-gray-300" size={28} />
                            )}
                          </div>
                          
                          {/* Detail Produk */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug">
                                {item.product_name}
                              </h3>
                              {item.variasi && (
                                <p className="text-xs text-gray-500 mt-1">Variasi: {item.variasi}</p>
                              )}
                            </div>
                            <p className="text-sm text-gray-800 mt-2">x{item.quantity}</p>
                          </div>

                          {/* Harga Produk (Kanan) */}
                          <div className="text-right flex-shrink-0 flex items-center h-full">
                            <p className="text-sm text-primary">
                              Rp {Number(item.price).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Card Footer: Total Price */}
                  <div className="bg-[#fffdfaf5] border-t border-gray-200 p-4 flex justify-end items-center gap-4">
                    <p className="text-sm text-gray-600">Total Pesanan:</p>
                    <p className="text-xl font-medium text-primary">
                      Rp {Number(order.total_price).toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="border-t border-gray-200 p-4 flex justify-end gap-3 bg-white">
                    {order.status === "PENDING" && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                      >
                        Batalkan Pesanan
                      </button>
                    )}
                    
                    {order.status === "LUNAS" && (
                      <Link 
                        to={`/product-katalog/${order.items?.[0]?.product_id}`}
                        className="px-6 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90 transition shadow-sm"
                      >
                        Beli Lagi
                      </Link>
                    )}
                    
                    {/* Tombol hubungi penjual / detail dsb bisa ditambah di sini */}
                    {order.status === "BATAL" && (
                       <Link 
                       to={`/product-katalog/${order.items?.[0]?.product_id}`}
                       className="px-6 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90 transition shadow-sm"
                     >
                       Beli Lagi
                     </Link>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-sm shadow-sm border border-gray-200">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Belum ada pesanan</h3>
            <p className="text-gray-500 mt-1 mb-6 text-sm">Kamu belum pernah melakukan pemesanan apa pun.</p>
            <Link to="/product-katalog" className="inline-block px-8 py-2.5 bg-primary text-white rounded font-medium hover:bg-primary/90 transition shadow-sm shadow-primary/30">
              Mulai Belanja
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}