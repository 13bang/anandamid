import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getMyCart, removeFromCart, updateCartQuantity } from "../../../services/cartService";
import { checkoutFromCart } from "../../../services/orderSevice"; 
import Swal from "sweetalert2";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const WHATSAPP_NUMBER = "6281228134747";

    const fetchCart = async () => {
        try {
        const data = await getMyCart();
        setCartItems(data);
        setSelectedItems(data.map((item: any) => item.id));
        } catch (err) {
        console.error("Gagal mengambil keranjang", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
        setSelectedItems([]);
        } else {
        setSelectedItems(cartItems.map(item => item.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleUpdateQty = async (id: string, newQty: number, stock: number) => {
        if (newQty < 1) return;
        if (newQty > stock) {
            Swal.fire({
                icon: "warning",
                title: "Stok tidak cukup",
                text: `Maksimal pembelian hanya ${stock}`,
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        try {
            await updateCartQuantity(id, newQty);
            setCartItems(prev =>
                prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
            );
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Hapus barang?',
            text: "Barang akan dihapus dari keranjangmu",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1d4ed8',
            confirmButtonText: 'Ya, hapus!'
        });

        if (result.isConfirmed) {
        try {
            await removeFromCart(id);
            setCartItems(prev => prev.filter(item => item.id !== id));
            setSelectedItems(prev => prev.filter(item => item !== id));
        } catch (err) { console.error(err); }
        }
    };

    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

    const subtotal = selectedCartItems.reduce((acc, item) => {
        const priceNormal = Number(item.product?.price_normal || 0);
        const priceDiscount = Number(item.product?.price_discount || 0);
        const finalPrice = priceDiscount > 0 ? priceNormal - priceDiscount : priceNormal;
        return acc + finalPrice * item.quantity;
    }, 0);

    const totalDiscount = selectedCartItems.reduce((acc, item) => {
        const discount = Number(item.product?.price_discount || 0);
        return acc + (discount * item.quantity);
    }, 0);

    const handleCheckoutWA = async () => {
        if (selectedItems.length === 0) {
            Swal.fire({ icon: 'info', title: 'Opps!', text: 'Pilih minimal 1 produk untuk checkout' });
            return;
        }

        const userDataString = localStorage.getItem("user_data");
        const userData = userDataString ? JSON.parse(userDataString) : null;

        if (!userData || !userData.phone_number) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Belum Lengkap!',
                text: 'Harap lengkapi nomor WhatsApp Anda di halaman profil sebelum melakukan checkout.',
                confirmButtonText: 'Lengkapi Sekarang',
                confirmButtonColor: '#2563eb'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/user/account/profile', { state: { requirePhone: true } }); 
                }
            });
            return; 
        }

        try {
            Swal.fire({
                title: 'Memproses Pesanan...',
                text: 'Mohon tunggu sebentar',
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading();
                }
            });

            const response = await checkoutFromCart(selectedItems, "Checkout via WhatsApp");
            const invoiceNumber = response?.data?.invoice_number || response?.invoice_number || "Tunggu Konfirmasi";

            Swal.close();

            let message = `*Halo Anandam Computer, saya ingin memproses pesanan dengan Invoice: ${invoiceNumber}*\n\n`;
            message += `*Detail Pesanan:*\n`;
            
            selectedCartItems.forEach((item, index) => {
                const priceNormal = Number(item.product?.price_normal || 0);
                const priceDiscount = Number(item.product?.price_discount || 0);
                const finalPrice = priceDiscount > 0 ? priceNormal - priceDiscount : priceNormal;
                
                message += `${index + 1}. *${item.product.name}*\n`;
                if (item.selected_variasi) message += `   - Variasi: ${item.selected_variasi}\n`;
                message += `   - Jumlah: ${item.quantity}x\n`;
                message += `   - Harga: Rp ${finalPrice.toLocaleString()}\n\n`;
            });

            message += `*Total Tagihan: Rp ${subtotal.toLocaleString()}*\n\n`;
            message += `Mohon segera diproses untuk pembayaran, terima kasih!`;

            setCartItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);

            const encodedMsg = encodeURIComponent(message);
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, '_blank');

            Swal.fire({
                icon: 'success',
                title: 'Pesanan Dibuat!',
                text: 'Silakan lanjutkan percakapan di WhatsApp.',
                timer: 3000,
                showConfirmButton: false
            });

        } catch (err: any) {
            Swal.close();
            console.error("Checkout Error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memproses',
                text: err.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.'
            });
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse">Memuat Keranjang...</div>;

    return (
        <div className="min-h-screen bg-white pb-20 animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Keranjang Belanja</h1>
                        <p className="text-sm text-gray-500 font-medium">Kamu memiliki {cartItems.length} item di dalam keranjang</p>
                    </div>
                    {cartItems.length > 0 && (
                        <button 
                            onClick={toggleSelectAll}
                            className="text-sm font-bold text-primary hover:text-primary/70 flex items-center gap-2 transition-colors"
                        >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedItems.length === cartItems.length ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                            {selectedItems.length === cartItems.length && <Check size={14} className="text-white" strokeWidth={4} />}
                        </div>
                            Pilih Semua
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LIST BARANG */}
                    <div className="lg:col-span-8 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => {
                                const product = item.product;
                                const priceNormal = Number(product?.price_normal || 0);
                                const priceDiscount = Number(product?.price_discount || 0);
                                const finalPrice = priceDiscount > 0 ? priceNormal - priceDiscount : priceNormal;
                                const isSelected = selectedItems.includes(item.id);

                                const imageUrl = product?.thumbnail?.startsWith("http")
                                    ? product.thumbnail
                                    : `${import.meta.env.VITE_API_BASE}${product?.thumbnail}`;

                                return (
                                <div key={item.id} className={`group bg-white p-4 lg:p-6 rounded-[24px] border-2 transition-all duration-300 flex flex-col sm:flex-row gap-4 items-center ${isSelected ? 'border-primary/20 shadow-md translate-x-1' : 'border-transparent shadow-sm'}`}>
                                    
                                    {/* CHECKBOX */}
                                    <div 
                                        onClick={() => toggleSelectItem(item.id)}
                                        className={`cursor-pointer w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-gray-200 hover:border-primary/50'}`}
                                    >
                                        {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                                    </div>

                                    {/* IMAGE - DIBUNGKUS LINK */}
                                    <Link to={`/product-katalog/${product?.id}`} className="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                                        <img src={imageUrl} className="w-full h-full object-contain" alt="product" />
                                    </Link>

                                    {/* INFO - NAMA DIBUNGKUS LINK */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <Link to={`/product-katalog/${product?.id}`} className="hover:text-primary transition-colors">
                                            <h3 className="font-bold text-gray-900 text-sm lg:text-base line-clamp-2 mb-1">
                                                {product?.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 mb-2">
                                            <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold uppercase tracking-wider">
                                                {item.selected_variasi || "Default"}
                                            </span>
                                            <span className={`text-[11px] font-bold ${product?.stock < 5 ? 'text-orange-500' : 'text-green-600'}`}>
                                                Stok: {product?.stock}
                                            </span>
                                        </div>
                                            <p className="text-primary font-bold text-base lg:text-lg">
                                                Rp {finalPrice.toLocaleString()}
                                            </p>
                                    </div>

                                    {/* ACTION (TETAP SAMA) */}
                                    <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-6">
                                        <div className="flex items-center bg-gray-50 rounded-md p-1 border border-gray-100">
                                            <button
                                                onClick={() => handleUpdateQty(item.id, item.quantity - 1, product?.stock || 0)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                                            >
                                                <Minus size={14} strokeWidth={3} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-900 text-sm">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQty(item.id, item.quantity + 1, product?.stock || 0)}
                                                disabled={item.quantity >= (product?.stock || 0)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                                            >
                                                <Plus size={14} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-[40px] py-20 px-8 text-center border-2 border-dashed border-gray-200">
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary/30">
                                    <ShoppingBag size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Wah, Keranjang Kosong!</h3>
                                <p className="text-gray-500 mb-10 max-w-xs mx-auto">Yuk, cari barang impianmu dan mulai isi keranjangmu sekarang.</p>
                                <Link to="/product-katalog" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95">
                                    Mulai Belanja <ChevronRight size={20} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RINGKASAN TAGIHAN */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 lg:p-8 rounded-[32px] border border-gray-200 shadow-sm sticky top-28">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Total Barang ({selectedItems.length})</span>
                            <span className="font-bold text-gray-900">
                                Rp {(subtotal + totalDiscount).toLocaleString()}
                            </span>
                            </div>

                            {totalDiscount > 0 && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Hemat Diskon</span>
                                <span className="text-green-600 font-bold">
                                -Rp {totalDiscount.toLocaleString()}
                                </span>
                            </div>
                            )}

                            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                            <span className="text-gray-900 font-bold">Total Tagihan</span>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">
                                Rp {subtotal.toLocaleString()}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Belum termasuk ongkir</p>
                            </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckoutWA}
                            className="relative w-full h-14 group overflow-hidden rounded-2xl bg-primary transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={cartItems.length === 0}
                        >
                            <div className="absolute inset-0 flex items-center justify-center gap-2 text-white font-bold transition-all duration-500 group-hover:-translate-y-full">
                            Checkout Sekarang
                            <ChevronRight size={20} />
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-green-500 text-white font-bold translate-y-full transition-all duration-500 group-hover:translate-y-0">
                            <FaWhatsapp size={22} className="animate-bounce" />
                            Checkout via WhatsApp
                            </div>
                        </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}