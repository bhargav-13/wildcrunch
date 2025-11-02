import React, { useState, useEffect } from 'react';
import { Package, Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '@/services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const OrdersHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      if (response.data.success) {
        // Sort by date, newest first
        const sortedOrders = response.data.data.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: any = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-300',
      'delivered': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'paid'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-orange-100 text-orange-800 border-orange-300';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F1B213]"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-suez text-gray-700 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 font-jost mb-6">Start shopping to see your orders here</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#F1B213] text-white px-6 py-3 rounded-full font-suez hover:bg-[#E5A612] transition-colors"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-black font-suez">Order History</h2>
        <span className="text-sm font-jost text-gray-600">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 hover:border-[#F1B213] transition-all cursor-pointer"
            onClick={() => navigate(`/order/${order._id}`)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-suez font-bold text-lg">Order #{order.orderNumber}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border font-jost ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-sm font-jost text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-jost text-gray-600">Total Amount</p>
                  <p className="text-xl font-suez font-bold text-black">₹{order.totalPrice}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-dashed border-gray-300">
              <Package className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-jost text-gray-700">
                  {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  {order.items && order.items.length > 0 && (
                    <span className="text-gray-500"> • {order.items[0].name}
                      {order.items.length > 1 && ` +${order.items.length - 1} more`}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Payment & Shipping Info */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <div className="flex-1">
                <p className="text-xs font-jost text-gray-500 mb-1">Payment Status</p>
                <span className={`text-xs px-2 py-1 rounded-full border font-jost inline-block ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>

              {order.shippingAddress && (
                <div className="flex-1">
                  <p className="text-xs font-jost text-gray-500 mb-1">Shipping To</p>
                  <p className="text-sm font-jost text-gray-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              )}

              <div className="flex items-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/order/${order._id}`);
                  }}
                  className="text-[#F1B213] hover:text-[#E5A612] font-suez text-sm flex items-center gap-1 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrdersHistory;
