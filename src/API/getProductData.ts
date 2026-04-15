import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { StoreProducts } from "../slices/productData";
import type { productType } from "../Types/products";

const API = import.meta.env.VITE_API;

const fetchProducts = async (): Promise<productType[]> => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${API}/products`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
};

export const useProducts = () => {
  const dispatch = useDispatch();

  const query = useQuery<productType[] | null, Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(StoreProducts(query.data));
    }
  }, [query.data, dispatch]);

  return query;
};
