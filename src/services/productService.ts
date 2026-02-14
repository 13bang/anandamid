import api from "./api";
import type { Product } from "../types/product";
import type { PaginatedResponse } from "../types/pagination";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const getProducts = async (
  params?: GetProductsParams
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};