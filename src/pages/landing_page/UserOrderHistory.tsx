import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../services/orderSevice"; 
import api from "../../services/api";
import { Package, Clock, CheckCircle, XCircle, ChevronRight, X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";

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
    //   text: "Pesanan yang dibatalkan tidak bisa dikembalikan.",
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "LUNAS":
        return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={16} />, label: "Selesai" };
      case "PENDING":
        return { color: "text-orange-600", bg: "bg-orange-50", icon: <Clock size={16} />, label: "Menunggu Pembayaran" };
      case "BATAL":
        return { color: "text-red-600", bg: "bg-red-50", icon: <XCircle size={16} />, label: "Dibatalkan" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-50", icon: <Package size={16} />, label: status };
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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans">

        <div className="max-w-7xl w-full mx-auto flex items-center px-4 sm:px-6 lg:px-8 mb-4">
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Riwayat Pesanan" },
                ]}
            />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Pesanan Saya</h1>

            {/* --- TABS FILTER --- */}
            <div className="flex overflow-x-auto gap-2 mb-6 hide-scrollbar">
            {["SEMUA", "PENDING", "LUNAS", "BATAL"].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
                >
                {tab === "SEMUA" ? "Semua Pesanan" : tab === "LUNAS" ? "Selesai" : tab === "PENDING" ? "Berlangsung" : "Dibatalkan"}
                </button>
            ))}
            </div>

            {/* --- ORDER LIST --- */}
            {loading ? (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
            ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
                {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                
                return (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition hover:shadow-md">
                    
                        {/* Card Header */}
                        <div className="border-b border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="font-semibold text-gray-800">{order.invoice_number}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500">
                                {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                {", "}
                                {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                </span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusConfig.bg} ${statusConfig.color}`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-4">
                            {order.items?.map((item: any) => {
                            const imageUrl = getProductImage(item.product);

                            return (
                                <div key={item.id} className="flex gap-4 items-start">
                                
                                {/* Gambar Produk */}
                                <Link 
                                    to={`/product-katalog/${item.product_id}`} 
                                    className="w-16 h-16 bg-gray-50 rounded-lg p-1 flex items-center justify-center flex-shrink-0 border border-gray-200 hover:opacity-80 transition-opacity"
                                >
                                    {imageUrl ? (
                                    <img src={imageUrl} alt={item.product_name} className="w-full h-full object-contain rounded-md" />
                                    ) : (
                                    <Package className="text-gray-400" size={24} />
                                    )}
                                </Link>
                                
                                <div className="flex-1 min-w-0">
                                    <Link to={`/product-katalog/${item.product_id}`} className="hover:text-blue-600 transition-colors">
                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                        {item.product_name}
                                    </h3>
                                    </Link>
                                    {item.variasi && (
                                    <p className="text-xs text-gray-500 mt-1">Variasi: {item.variasi}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                    {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}
                                    </p>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-gray-900">
                                    Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                </div>
                            );
                            })}
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                            <p className="text-xs text-gray-500 mb-1">Total Belanja</p>
                            <p className="text-lg font-bold text-blue-600">
                                Rp {Number(order.total_price).toLocaleString('id-ID')}
                            </p>
                            </div>
                            
                            <div className="flex gap-2 w-full sm:w-auto">
                            {order.status === "PENDING" && (
                                <button 
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
                                >
                                    <X size={16} /> Batalkan
                                </button>
                            )}
                            
                            {order.status === "LUNAS" && (
                                <Link 
                                    to={`/product-katalog/${order.items?.[0]?.product_id}`}
                                    className="flex-1 sm:flex-none text-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
                                >
                                    Beli Lagi
                                </Link>
                            )}
                            
                            {/* <Link 
                                to={`/order/${order.id}`}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Detail <ChevronRight size={16} />
                            </Link> */}
                            </div>
                        </div>

                    </div>
                );
                })}
            </div>
            ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Belum ada pesanan</h3>
                <p className="text-gray-500 mt-1 mb-4">Kamu belum pernah melakukan pemesanan.</p>
                <Link to="/product-katalog" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Mulai Belanja
                </Link>
            </div>
            )}

        </div>
    </div>
  );
}