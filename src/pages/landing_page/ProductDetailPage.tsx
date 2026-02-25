import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price_normal: string;
  price_discount: string;
  final_price: number;
  stock: number;
  warranty: string;
  category: {
    name: string;
  };
  images: ProductImage[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const data = await getProductById(id!);
    setProduct(data);
    setLoading(false);
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto">
      <div className="grid grid-cols-12 gap-10">

        {/* ================= IMAGE SECTION ================= */}
        <div className="col-span-5">
          <div className="overflow-hidden border rounded-lg aspect-square">
            <img
              src={product.images[activeImage]?.image_url}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex mt-4 space-x-3 overflow-x-auto">
            {product.images.map((img, index) => (
              <img
                key={img.id}
                src={img.image_url}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                  activeImage === index
                    ? "border-primary"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= INFO SECTION ================= */}
        <div className="col-span-7 space-y-6">
          <div>
            <p className="mb-2 text-sm text-gray-500">
              {product.category.name}
            </p>

            <h1 className="text-2xl font-semibold">
              {product.name}
            </h1>
          </div>

          {/* PRICE */}
          <div>
            {product.price_discount ? (
              <>
                <p className="text-sm text-gray-400 line-through">
                  Rp {Number(product.price_normal).toLocaleString()}
                </p>
                <p className="text-3xl font-bold text-red-600">
                  Rp {Number(product.final_price).toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-red-600">
                Rp {Number(product.price_normal).toLocaleString()}
              </p>
            )}
          </div>

          {/* STOCK */}
          <div className="text-sm text-gray-600">
            Stock: <span className="font-medium">{product.stock}</span>
          </div>

          {/* WARRANTY */}
          <div className="text-sm text-gray-600">
            Warranty: <span className="font-medium">{product.warranty}</span>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}