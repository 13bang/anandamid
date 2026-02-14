import type { Category } from "./category";
import type { ProductImage } from "./product-image";

export interface Product {
  id: string;
  product_id: string;
  sku_id: string | null;
  name: string;
  description: string | null;

  price_normal: number;
  price_discount: number | null;
  final_price: number;

  stock: number;

  sku_seller: string | null;
  warranty: string | null;
  url_tiktok: string | null;
  url_tokped: string | null;

  is_active: boolean;
  is_popular: boolean;

  created_at: string;
  updated_at: string;

  category: Category;
  images: ProductImage[];
}
