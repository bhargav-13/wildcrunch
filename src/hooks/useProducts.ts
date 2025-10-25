import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

interface Product {
  _id: string;
  id: string;
  name: string;
  weight: string;
  price: string;
  priceNumeric: number;
  category: string;
  imageSrc: string;
  bgColor: string;
  description?: string;
  ingredients?: string;
  nutritionalInfo?: any;
  inStock: boolean;
  stockQuantity: number;
  ratings?: {
    average: number;
    count: number;
  };
}

interface UseProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const useProducts = (params?: UseProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll(params);
      
      if (response.data.success) {
        setProducts(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params?.category, params?.search, params?.sort, params?.page, params?.limit]);

  return {
    products,
    loading,
    error,
    pagination,
    refreshProducts: fetchProducts,
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getById(id);
      
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      console.error('Fetch product error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
    refreshProduct: fetchProduct,
  };
};
