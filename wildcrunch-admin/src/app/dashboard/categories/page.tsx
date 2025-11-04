'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { productsAPI } from '@/lib/api';
import { Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryStats {
  name: string;
  productCount: number;
  totalStock: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        productsAPI.getCategories(),
      ]);

      // Handle nested response structure for products
      let products = productsRes.data.products || productsRes.data.data || productsRes.data || [];
      if (!Array.isArray(products)) {
        products = [];
      }

      // Handle nested response structure for categories
      let categoryNames = categoriesRes.data.data || categoriesRes.data || [];
      if (!Array.isArray(categoryNames)) {
        categoryNames = [];
      }

      // Calculate stats for each category
      const categoryStats: CategoryStats[] = categoryNames.map((name: string) => {
        const categoryProducts = products.filter((p: any) => p.category === name);
        return {
          name,
          productCount: categoryProducts.length,
          totalStock: categoryProducts.reduce((sum: number, p: any) => sum + (p.stock || 0), 0),
        };
      });

      // Sort by product count
      categoryStats.sort((a, b) => b.productCount - a.productCount);

      setCategories(categoryStats);
    } catch (error: any) {
      toast.error('Failed to fetch categories');
      console.error(error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">
              Manage product categories ({categories.length} categories)
            </p>
          </div>
        </div>

        {/* Categories Info */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Package className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Category Management</h3>
              <p className="text-sm text-blue-800">
                Categories are automatically created when you add products. The categories shown
                below are derived from your product inventory.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full card">
              <p className="text-center text-gray-500 py-12">
                No categories found. Add products to create categories.
              </p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.name}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="text-primary-600" size={24} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  {category.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Products</span>
                    <span className="badge bg-blue-100 text-blue-800">
                      {category.productCount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Stock</span>
                    <span className="badge bg-green-100 text-green-800">
                      {category.totalStock} units
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (category.productCount /
                            Math.max(...categories.map((c) => c.productCount))) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {((category.productCount / categories.reduce((sum, c) => sum + c.productCount, 0)) * 100).toFixed(1)}% of total products
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
