'use client';

import { useState } from 'react';
import { ordersAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { X, Package, MapPin, CreditCard, User, Truck, RefreshCw, Printer, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState(order.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSyncingTracking, setIsSyncingTracking] = useState(false);
  const [isPrintingLabel, setIsPrintingLabel] = useState(false);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

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

  const handleSyncTracking = async () => {
    setIsSyncingTracking(true);
    try {
      const response = await ordersAPI.syncTracking(order._id);
      toast.success('Tracking synced successfully');
      // Refresh the page or update the order data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to sync tracking');
      console.error(error);
    } finally {
      setIsSyncingTracking(false);
    }
  };

  const handlePrintLabel = async () => {
    setIsPrintingLabel(true);
    try {
      const response = await ordersAPI.printLabel(order._id);
      console.log('Print label response:', response.data);

      if (response.data.success && response.data.data?.label_url) {
        const labelUrl = response.data.data.label_url;
        console.log('Opening label URL:', labelUrl);

        // Try to open in new tab
        const newWindow = window.open(labelUrl, '_blank');

        // Check if popup was blocked
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
          // Popup blocked, create download link instead
          const link = document.createElement('a');
          link.href = labelUrl;
          link.target = '_blank';
          link.download = `shipping-label-${order.orderNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Downloading shipping label...');
        } else {
          toast.success('Opening shipping label...');
        }
      } else {
        console.error('No label URL in response:', response.data);
        toast.error('Label URL not available');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get label');
      console.error('Print label error:', error);
    } finally {
      setIsPrintingLabel(false);
    }
  };

  const handleCreateShipment = async () => {
    setIsCreatingShipment(true);
    try {
      const response = await ordersAPI.createShipment(order._id);
      toast.success(response.data.message || 'Shipment created successfully');
      // Refresh the page to show updated order
      window.location.reload();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to create shipment';
      const errorData = error.response?.data?.error;

      toast.error(errorMsg);

      // Log detailed error for debugging
      if (errorData) {
        console.error('Shipment creation error details:', errorData);
      }
      console.error(error);
    } finally {
      setIsCreatingShipment(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
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
              {order.isGuest && (
                <span className="badge bg-purple-100 text-purple-800 text-xs ml-2">Guest</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">
                  {order.isGuest
                    ? (order.guestName || order.shippingAddress?.fullName || 'N/A')
                    : (order.user?.name || 'N/A')
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">
                  {order.isGuest
                    ? (order.guestEmail || order.shippingAddress?.email || 'N/A')
                    : (order.user?.email || 'N/A')
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">
                  {order.isGuest
                    ? (order.guestPhone || order.shippingAddress?.phone || 'N/A')
                    : (order.user?.phone || 'N/A')
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Shipment Tracking */}
          {order.shippingDetails?.awbNumber ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Truck className="text-primary-500" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Shipment Tracking</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSyncTracking}
                    disabled={isSyncingTracking}
                    className="btn-secondary flex items-center gap-2 text-sm"
                    title="Sync tracking status"
                  >
                    <RefreshCw size={16} className={isSyncingTracking ? 'animate-spin' : ''} />
                    {isSyncingTracking ? 'Syncing...' : 'Sync'}
                  </button>
                  <button
                    onClick={handlePrintLabel}
                    disabled={isPrintingLabel}
                    className="btn-secondary flex items-center gap-2 text-sm"
                    title="Print shipping label"
                  >
                    <Printer size={16} />
                    {isPrintingLabel ? 'Loading...' : 'Print Label'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">AWB Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{order.shippingDetails.awbNumber}</p>
                    <button
                      onClick={() => copyToClipboard(order.shippingDetails.awbNumber, 'AWB Number')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Copy size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {order.shippingDetails.courierName && (
                  <div>
                    <p className="text-sm text-gray-600">Courier Partner</p>
                    <p className="font-medium text-gray-900">{order.shippingDetails.courierName}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Shipping Status</p>
                  <span className="badge bg-blue-100 text-blue-800">
                    {(order.shippingDetails.shippingStatus || 'pending')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </div>

                {order.shippingDetails.lastTrackedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatDate(order.shippingDetails.lastTrackedAt)}
                    </p>
                  </div>
                )}

                {order.shippingDetails.trackingId && (
                  <div>
                    <p className="text-sm text-gray-600">Tracking ID</p>
                    <p className="font-medium text-gray-900">{order.shippingDetails.trackingId}</p>
                  </div>
                )}

                {order.shippingDetails.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatDate(order.shippingDetails.estimatedDelivery)}
                    </p>
                  </div>
                )}
              </div>

              {order.shippingDetails.labelUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={order.shippingDetails.labelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 text-sm flex items-center gap-2"
                  >
                    <Printer size={16} />
                    View Saved Label
                  </a>
                </div>
              )}

              {/* Status History */}
              {order.shippingDetails.statusHistory && order.shippingDetails.statusHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Tracking History</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {order.shippingDetails.statusHistory.slice().reverse().map((history: any, index: number) => (
                      <div key={index} className="flex gap-3 text-sm border-l-2 border-primary-300 pl-3 py-1">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {history.status?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </p>
                          {history.message && (
                            <p className="text-gray-600 text-xs mt-0.5">{history.message}</p>
                          )}
                          {history.location && (
                            <p className="text-gray-500 text-xs mt-0.5">{history.location}</p>
                          )}
                          <p className="text-gray-400 text-xs mt-1">{formatDate(history.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (order.isPaid || order.paymentStatus === 'Paid') ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Truck className="text-primary-500" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Shipment Tracking</h3>
                </div>
                <button
                  onClick={handleCreateShipment}
                  disabled={isCreatingShipment}
                  className="btn-primary flex items-center gap-2 text-sm"
                  title="Create shipment manually"
                >
                  <Package size={16} />
                  {isCreatingShipment ? 'Creating...' : 'Create Shipment'}
                </button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-2">
                  ⚠️ Shipment not created yet. Click "Create Shipment" to manually create the shipment with iThink Logistics.
                </p>
                <p className="text-xs text-yellow-700">
                  This will generate an AWB number and create a shipment for this order.
                </p>
              </div>
            </div>
          ) : null}

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
