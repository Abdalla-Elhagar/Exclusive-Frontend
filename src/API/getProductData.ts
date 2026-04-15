import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { StoreProducts } from "../slices/productData";
import type { productType } from "../Types/products";

const API = import.meta.env.VITE_API;

const fetchProducts = async (): Promise<productType[] | null> => {
  if (!localStorage.getItem("authToken")) return null;

  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const useProducts = () => {
  if (!localStorage.getItem("authToken")) return null;

  const dispatch = useDispatch();

  const query = useQuery<productType[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  if (query.data) {
    dispatch(StoreProducts(query.data));
  }

  return query;
};
