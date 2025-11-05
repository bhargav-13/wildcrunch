'use client';

import { useState } from 'react';
import { ordersAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { X, Package, MapPin, CreditCard, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState(order.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (currentStatus === order.status) {
      toast.error('Status has not changed');
      return;
    }

    setIsUpdating(true);
    try {
      await ordersAPI.updateStatus(order._id, currentStatus);
      toast.success('Order status updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">Order ID: #{order._id.slice(-8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <User className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{order.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{order.user?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="text-primary-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="text-gray-900">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.pinCode}
                </p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
            </div>
            <div className="space-y-4">
              {(order.items || order.orderItems)?.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    {item.pack && item.pack !== '1' && (
                      <p className="text-sm text-gray-600">Pack: {item.pack}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.priceNumeric || item.price)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: {formatCurrency((item.priceNumeric || item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Total */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-900">
                <span>Subtotal</span>
                <span>{formatCurrency(order.itemsPrice || order.totalPrice)}</span>
              </div>
              {order.shippingPrice > 0 && (
                <div className="flex justify-between text-gray-900">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingPrice)}</span>
                </div>
              )}
              {order.taxPrice > 0 && (
                <div className="flex justify-between text-gray-900">
                  <span>Tax</span>
                  <span>{formatCurrency(order.taxPrice)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Payment Status</span>
                  <span
                    className={`badge ${
                      order.isPaid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                {order.isPaid && order.paidAt && (
                  <p className="text-sm text-gray-600 mt-2">
                    Paid on {formatDate(order.paidAt)}
                  </p>
                )}
                {order.paymentMethod && (
                  <p className="text-sm text-gray-600 mt-2">
                    Payment Method: {order.paymentMethod}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Status Update */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Order Status</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="input"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || currentStatus === order.status}
                className="btn-primary w-full"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
