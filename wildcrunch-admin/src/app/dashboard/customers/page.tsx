'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ordersAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Mail, Phone, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
  isGuest: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await ordersAPI.getAll();
      // Handle nested response structure
      let orders = response.data.orders || response.data.data || response.data || [];

      // Ensure it's an array
      if (!Array.isArray(orders)) {
        orders = [];
      }

      // Group orders by customer
      const customerMap = new Map<string, Customer>();

      orders.forEach((order: any) => {
        // Handle both registered users and guest orders
        let customerId: string;
        let customerName: string;
        let customerEmail: string;
        let customerPhone: string | undefined;
        let isGuest: boolean;

        if (order.isGuest) {
          // Guest customer - use email as unique identifier
          customerId = order.guestEmail || 'unknown';
          customerName = order.guestName || 'Guest Customer';
          customerEmail = order.guestEmail || 'N/A';
          customerPhone = order.guestPhone;
          isGuest = true;
        } else {
          // Registered user
          const userId = order.user?._id || order.user;
          if (!userId) return; // Skip if no user ID
          customerId = userId;
          customerName = order.user?.name || 'Unknown';
          customerEmail = order.user?.email || 'N/A';
          customerPhone = order.user?.phone;
          isGuest = false;
        }

        if (customerMap.has(customerId)) {
          const customer = customerMap.get(customerId)!;
          customer.ordersCount += 1;
          if (order.isPaid) {
            customer.totalSpent += order.totalPrice;
          }
          if (
            !customer.lastOrderDate ||
            new Date(order.createdAt) > customer.lastOrderDate
          ) {
            customer.lastOrderDate = new Date(order.createdAt);
          }
        } else {
          customerMap.set(customerId, {
            _id: customerId,
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            ordersCount: 1,
            totalSpent: order.isPaid ? order.totalPrice : 0,
            lastOrderDate: new Date(order.createdAt),
            isGuest: isGuest,
          });
        }
      });

      const customersArray = Array.from(customerMap.values());
      customersArray.sort((a, b) => b.totalSpent - a.totalSpent);

      setCustomers(customersArray);
      setFilteredCustomers(customersArray);
    } catch (error: any) {
      toast.error('Failed to fetch customers');
      console.error(error);
      setCustomers([]);
      setFilteredCustomers([]);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            View and manage your customers ({filteredCustomers.length} customers)
          </p>
        </div>

        {/* Search */}
        <div className="card">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full card">
              <p className="text-center text-gray-500 py-12">No customers found</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        {customer.isGuest && (
                          <span className="badge bg-purple-100 text-purple-800 text-xs">Guest</span>
                        )}
                      </div>
                      <span className="badge bg-blue-100 text-blue-800">
                        {customer.ordersCount} {customer.ordersCount === 1 ? 'order' : 'orders'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span className="truncate">{customer.email}</span>
                  </div>

                  {customer.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{customer.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ShoppingBag size={16} />
                    <span>Total spent: {formatCurrency(customer.totalSpent)}</span>
                  </div>

                  {customer.lastOrderDate && (
                    <div className="text-sm text-gray-500 pt-3 border-t border-gray-200">
                      Last order: {formatDate(customer.lastOrderDate)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
