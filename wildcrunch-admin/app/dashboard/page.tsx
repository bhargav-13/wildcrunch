"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Ticket, TrendingUp, ShoppingCart } from "lucide-react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    inStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, couponsRes] = await Promise.all([
        api.get("/products"),
        api.get("/coupons"),
      ]);

      const products = productsRes.data.data || [];
      const coupons = couponsRes.data.data || [];

      setStats({
        totalProducts: products.length,
        totalCoupons: coupons.length,
        activeCoupons: coupons.filter((c: any) => c.isActive).length,
        inStockProducts: products.filter((p: any) => p.inStock).length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Stock",
      value: stats.inStockProducts,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Coupons",
      value: stats.totalCoupons,
      icon: Ticket,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Coupons",
      value: stats.activeCoupons,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to Wild Crunch Admin Panel</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/dashboard/products"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Manage Products</h3>
                  <p className="text-sm text-gray-500">
                    Add, edit, or delete products
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/dashboard/coupons"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-medium">Manage Coupons</h3>
                  <p className="text-sm text-gray-500">
                    Create and manage discount coupons
                  </p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
