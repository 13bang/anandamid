import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight } from "lucide-react";
import { getMyCart, removeFromCart, updateCartQuantity } from "../../services/cartService";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await getMyCart();
      setCartItems(data);
    } catch (err) {
      console.error("Gagal mengambil keranjang", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

    const handleUpdateQty = async (id: string, newQty: number, stock: number) => {
        if (newQty < 1) return;

        // ❗ cegah lebih dari stok
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
            prev.map(item =>
                item.id === id ? { ...item, quantity: newQty } : item
            )
            );
        } catch (err) {
            console.error(err);
        }
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
      } catch (err) { console.error(err); }
    }
  };

    const subtotal = cartItems.reduce((acc, item) => {
        const priceNormal = Number(item.product?.price_normal || 0);
        const priceDiscount = Number(item.product?.price_discount || 0);
        const finalPrice = priceDiscount > 0 ? priceNormal - priceDiscount : priceNormal;

        return acc + finalPrice * item.quantity;
    }, 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold">Memuat Keranjang...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Keranjang</h1>
                <p className="text-sm text-gray-500">{cartItems.length} item</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LIST BARANG */}
                <div className="lg:col-span-8 space-y-4">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => {
                            const product = item.product;

                            const priceNormal = Number(product?.price_normal || 0);
                            const priceDiscount = Number(product?.price_discount || 0);
                            const finalPrice = priceDiscount > 0 ? priceNormal - priceDiscount : priceNormal;

                            const imageUrl = product?.thumbnail?.startsWith("http")
                                ? product.thumbnail
                                : `${import.meta.env.VITE_API_BASE}${product?.thumbnail}`;

                            return (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-200 flex gap-4 items-center">
                                
                                {/* IMAGE */}
                                <img
                                    src={imageUrl}
                                    className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2"
                                />

                                {/* INFO */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                                        {product?.name}
                                    </h3>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {item.selected_variasi || "Default"}
                                    </p>

                                    <p className="text-xs mt-1">
                                        {product?.stock > 0 ? (
                                            <span className="text-gray-500">
                                            Stok: <span className="font-semibold">{product.stock}</span>
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">Stok habis</span>
                                        )}
                                    </p>

                                    <p className="text-primary font-bold mt-2">
                                        Rp {finalPrice.toLocaleString()}
                                    </p>
                                </div>

                                {/* ACTION */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border rounded-lg">
                                        {/* MINUS */}
                                        <button
                                            onClick={() => handleUpdateQty(item.id, item.quantity - 1, product?.stock || 0)}
                                            disabled={item.quantity <= 1}
                                            className={`px-2 py-1 ${
                                            item.quantity <= 1 ? "text-gray-300 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            <Minus size={14} />
                                        </button>

                                        {/* QTY */}
                                        <span className="px-3 text-sm font-semibold">
                                            {item.quantity}
                                        </span>

                                        {/* PLUS */}
                                        <button
                                            onClick={() => handleUpdateQty(item.id, item.quantity + 1, product?.stock || 0)}
                                            disabled={item.quantity >= (product?.stock || 0)}
                                            className={`px-2 py-1 ${
                                            item.quantity >= (product?.stock || 0)
                                                ? "text-gray-300 cursor-not-allowed"
                                                : ""
                                            }`}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                </div>
                            );
                        })
                    ) : (
                    <div className="bg-white rounded-[40px] p-12 text-center border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <ShoppingBag size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h3>
                        <p className="text-gray-500 mb-8">Sepertinya kamu belum memilih barang rakitan impianmu.</p>
                        <Link to="/product-katalog" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                        Mulai Belanja <ChevronRight size={18} />
                        </Link>
                    </div>
                    )}
                </div>

                {/* RINGKASAN TAGIHAN */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 sticky top-24">
                        
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Ringkasan
                        </h2>

                        {/* DETAIL */}
                        <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between text-gray-500">
                            <span>Total ({cartItems.length})</span>
                            <span className="font-medium text-gray-800">
                            Rp {subtotal.toLocaleString()}
                            </span>
                        </div>

                        {/* ✅ DISCOUNT (muncul kalau ada) */}
                        {cartItems.some(item => Number(item.product?.price_discount || 0) > 0) && (
                            <div className="flex justify-between text-gray-500">
                            <span>Diskon</span>
                            <span className="text-green-600 font-medium">
                                -Rp {cartItems
                                .reduce((acc, item) => {
                                    const discount = Number(item.product?.price_discount || 0);
                                    return acc + (discount * item.quantity);
                                }, 0)
                                .toLocaleString()}
                            </span>
                            </div>
                        )}
                        </div>

                        {/* TOTAL */}
                        <div className="border-t pt-4 flex justify-between items-center mb-4">
                        <span className="text-gray-700 font-medium text-sm">
                            Total
                        </span>
                        <span className="text-lg font-bold text-primary">
                            Rp {subtotal.toLocaleString()}
                        </span>
                        </div>

                        {/* BUTTON */}
                        <button className="w-full h-12 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                        Checkout
                        <ChevronRight size={18} />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}