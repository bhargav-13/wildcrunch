import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  Copy,
  RefreshCw,
  TruckIcon,
  Navigation
} from 'lucide-react';
import Header from '../Header';
import { ordersAPI } from '@/services/api';
import { toast } from 'sonner';
import localProducts from '@/data/product';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getById(id!);
        if (response.data.success) {
          const orderData = response.data.data;
          console.log('📋 Order loaded:', {
            orderNumber: orderData.orderNumber,
            hasShippingDetails: !!orderData.shippingDetails,
            awbNumber: orderData.shippingDetails?.awbNumber,
            orderStatus: orderData.orderStatus,
            paymentStatus: orderData.paymentStatus,
            paymentMethod: orderData.paymentMethod,
            paymentDetails: orderData.paymentDetails,
            paidAt: orderData.paidAt
          });
          console.log('📋 Full order object:', orderData);
          setOrder(orderData);
        } else {
          toast.error('Order not found');
          navigate('/');
        }
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch order');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const fetchTracking = async () => {
    if (!order?._id) return;

    try {
      setLoadingTracking(true);
      const response = await ordersAPI.getTracking(order._id);
      console.log('📦 Tracking response:', response.data);

      if (response.data.success) {
        const { order: updatedOrder, shipping, liveTracking } = response.data.data;
        console.log('📦 Live tracking data:', liveTracking);
        console.log('📦 Shipping details:', shipping);

        // Update order with fresh shipping details
        setOrder({ ...order, shippingDetails: shipping });
        setTrackingData(liveTracking);

        if (liveTracking) {
          toast.success('Tracking updated');
        } else {
          toast.info(response.data.data.message || 'No live tracking available yet');
        }
      }
    } catch (error: any) {
      console.error('❌ Error fetching tracking:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tracking');
    } finally {
      setLoadingTracking(false);
    }
  };

  useEffect(() => {
    if (order?._id && order.shippingDetails?.awbNumber) {
      console.log('📦 Order has AWB, fetching tracking...', order.shippingDetails.awbNumber);
      fetchTracking();
    } else if (order?._id) {
      console.log('⚠️ Order loaded but no AWB number yet:', {
        orderId: order._id,
        hasShippingDetails: !!order.shippingDetails,
        awbNumber: order.shippingDetails?.awbNumber
      });
    }
  }, [order?._id, order?.shippingDetails?.awbNumber]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Failed':
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'Paid':
      case 'Confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Failed':
      case 'Cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Shipped':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Delivered':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7E5]">
        <Header />
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F1B213] mb-4"></div>
          <p className="text-xl font-suez text-black">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const orderItems = order.items || [];
  const packLabel = (pack: string) => {
    if (pack === '2') return 'Pack of 2';
    if (pack === '4') return 'Pack of 4';
    return 'Individual';
  };

  const subtotal = order.itemsPrice || 0;
  const shipping = order.shippingPrice ?? 60;
  const total = order.totalPrice || (subtotal + (shipping ?? 0));

  return (
    <div className="min-h-screen bg-[#F8F7E5] font-jost">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-24 max-w-6xl">
        {/* Header with Order Number */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black font-suez mb-2">Order Details</h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-jost">Order Number:</span>
                <span className="text-lg font-bold font-suez text-[#F1B213]">{order.orderNumber}</span>
                <button
                  onClick={() => copyToClipboard(order.orderNumber, 'Order number')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copy order number"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              {getStatusIcon(order.paymentStatus)}
              <span className={getStatusBadge(order.paymentStatus)}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
          
          {/* Order Date */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Placed on {formatDate(order.createdAt)}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-black p-6">
              <h2 className="text-2xl font-bold mb-6 font-suez">Order Items</h2>
              <div className="space-y-4">
                {orderItems.map((item: any, index: number) => {
                  const localProduct = localProducts.find(p => p.id === item.productId);
                  const imageSrc = localProduct?.imageSrc || item.imageSrc;
                  
                  return (
                    <div key={index} className="flex gap-4 pb-4 border-b border-dashed border-gray-300 last:border-0">
                      {/* Product Image */}
                      <div className="w-24 h-24 border border-black rounded flex items-center justify-center bg-white flex-shrink-0">
                        <img 
                          src={imageSrc} 
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold font-suez mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 font-jost mb-2">{item.weight}</p>
                        {item.pack && item.pack !== '1' && (
                          <span className="inline-block bg-[#F1B213] text-white text-xs px-2 py-1 rounded font-suez mb-2">
                            {packLabel(item.pack)}
                          </span>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                          <span className="text-sm text-gray-600">×</span>
                          <span className="font-bold font-suez">₹{item.packPrice || item.priceNumeric}</span>
                          <span className="text-sm text-gray-600">=</span>
                          <span className="text-lg font-bold font-suez text-[#F1B213]">
                            ₹{(item.packPrice || item.priceNumeric) * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-dashed border-black">
                <div className="space-y-2">
                  <div className="flex justify-between text-base">
                    <span className="font-suez">Subtotal:</span>
                    <span className="font-bold font-suez">₹{subtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-suez">Shipping:</span>
                    <span className="font-bold font-suez">₹{shipping}.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-dashed border-black mt-4">
                    <span className="font-suez">Total:</span>
                    <span className="text-[#F1B213]">₹{total}.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-black p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-[#F1B213]" />
                <h2 className="text-2xl font-bold font-suez">Payment Information</h2>
              </div>
              <div className="space-y-3">
                {/* Payment Mode */}
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                  <span className="font-jost text-gray-600">Payment Mode:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.paymentMethod === 'COD'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                  <span className="font-jost text-gray-600">Payment Method:</span>
                  <span className="font-suez font-semibold capitalize">
                    {order.paymentMethod === 'razorpay' ? 'Razorpay' : order.paymentMethod || 'Not specified'}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                  <span className="font-jost text-gray-600">Payment Status:</span>
                  <span className={getStatusBadge(order.paymentStatus || 'Pending')}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>

                {/* Amount Paid */}
                {order.totalPrice && order.paymentStatus === 'Paid' && (
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                    <span className="font-jost text-gray-600">Amount Paid:</span>
                    <span className="font-suez font-semibold text-green-700">₹{order.totalPrice}.00</span>
                  </div>
                )}

                {/* Paid At */}
                {order.paidAt && (
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                    <span className="font-jost text-gray-600">Paid At:</span>
                    <span className="font-suez text-sm">{formatDate(order.paidAt)}</span>
                  </div>
                )}

                {/* Transaction ID */}
                {order.paymentDetails?.razorpayPaymentId && (
                  <div className="pt-3 border-t border-dashed border-gray-300">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-jost text-gray-600 text-sm">Transaction ID:</span>
                      <button
                        onClick={() => copyToClipboard(order.paymentDetails.razorpayPaymentId, 'Transaction ID')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy Transaction ID"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <span className="font-suez text-xs text-gray-700 break-all">{order.paymentDetails.razorpayPaymentId}</span>
                  </div>
                )}

                {/* Razorpay Order ID */}
                {order.paymentDetails?.razorpayOrderId && (
                  <div className="pt-2">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-jost text-gray-600 text-sm">Razorpay Order ID:</span>
                      <button
                        onClick={() => copyToClipboard(order.paymentDetails.razorpayOrderId, 'Razorpay Order ID')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copy Razorpay Order ID"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <span className="font-suez text-xs text-gray-700 break-all">{order.paymentDetails.razorpayOrderId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg border border-black p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-[#F1B213]" />
                <h2 className="text-2xl font-bold font-suez">Order Status</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {order.orderStatus === 'Confirmed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-jost">Confirmed</span>
                </div>
                <div className="flex items-center gap-3">
                  {order.orderStatus === 'Shipped' ? (
                    <Truck className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-jost">Shipped</span>
                </div>
                <div className="flex items-center gap-3">
                  {order.orderStatus === 'Delivered' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-jost">Delivered</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                <span className={`inline-block ${getStatusBadge(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Shipment Tracking */}
            {order.shippingDetails?.awbNumber ? (
              <div className="bg-white rounded-lg border border-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-6 h-6 text-[#F1B213]" />
                    <h2 className="text-2xl font-bold font-suez">Shipment Tracking</h2>
                  </div>
                  <button
                    onClick={fetchTracking}
                    disabled={loadingTracking}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    title="Refresh tracking"
                  >
                    <RefreshCw className={`w-5 h-5 text-[#F1B213] ${loadingTracking ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* AWB Number */}
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                    <span className="font-jost text-gray-600">AWB Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-suez font-semibold">{order.shippingDetails.awbNumber}</span>
                      <button
                        onClick={() => copyToClipboard(order.shippingDetails.awbNumber, 'AWB Number')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Courier Name */}
                  {order.shippingDetails.courierName && (
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                      <span className="font-jost text-gray-600">Courier Partner:</span>
                      <span className="font-suez font-semibold">{order.shippingDetails.courierName}</span>
                    </div>
                  )}

                  {/* Shipping Status */}
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                    <span className="font-jost text-gray-600">Shipping Status:</span>
                    <span className={getStatusBadge(order.shippingDetails.shippingStatus || 'pending')}>
                      {(order.shippingDetails.shippingStatus || 'pending').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                  </div>

                  {/* Expected Delivery - Prominent Display */}
                  {(order.shippingDetails.estimatedDelivery || trackingData?.order_details?.expected_delivery_date) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 my-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-jost text-green-700 text-sm font-semibold">Expected Delivery</span>
                      </div>
                      <p className="font-suez text-lg font-bold text-green-800 ml-6">
                        {trackingData?.order_details?.expected_delivery_date || order.shippingDetails.estimatedDelivery}
                      </p>
                    </div>
                  )}

                  {/* Last Updated */}
                  {order.shippingDetails.lastTrackedAt && (
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                      <span className="font-jost text-gray-600">Last Updated:</span>
                      <span className="font-suez text-sm">{formatDate(order.shippingDetails.lastTrackedAt)}</span>
                    </div>
                  )}

                  {/* Shipment Created Date */}
                  {order.shippingDetails.createdAt && (
                    <div className="flex justify-between items-center py-2">
                      <span className="font-jost text-gray-600">Shipment Created:</span>
                      <span className="font-suez text-sm">{formatDate(order.shippingDetails.createdAt)}</span>
                    </div>
                  )}

                  {/* Live Tracking Data */}
                  {trackingData && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h3 className="font-suez font-semibold mb-3 flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-[#F1B213]" />
                        Live Tracking Details
                      </h3>

                      {/* Current Status */}
                      {trackingData.current_status && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-jost text-blue-600 mb-1">Current Status</p>
                          <p className="text-sm font-suez font-semibold text-blue-900">{trackingData.current_status}</p>
                        </div>
                      )}

                      {/* Last Scan Details */}
                      {trackingData.last_scan_details && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-jost text-gray-600 mb-2">Last Scan</p>
                          <div className="space-y-1 text-sm">
                            {trackingData.last_scan_details.location && (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="font-jost text-gray-700">{trackingData.last_scan_details.location}</span>
                              </div>
                            )}
                            {trackingData.last_scan_details.scan_datetime && (
                              <div className="flex items-start gap-2">
                                <Clock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="font-jost text-gray-700">{trackingData.last_scan_details.scan_datetime}</span>
                              </div>
                            )}
                            {trackingData.last_scan_details.instructions && (
                              <p className="font-jost text-gray-600 text-xs italic mt-1">{trackingData.last_scan_details.instructions}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Order Details from Tracking */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        {trackingData.logistic && (
                          <div>
                            <p className="font-jost text-gray-500">Courier</p>
                            <p className="font-suez font-semibold capitalize">{trackingData.logistic}</p>
                          </div>
                        )}
                        {trackingData.order_type && (
                          <div>
                            <p className="font-jost text-gray-500">Order Type</p>
                            <p className="font-suez font-semibold capitalize">{trackingData.order_type}</p>
                          </div>
                        )}
                      </div>

                      {/* Scan History Summary */}
                      {trackingData.scan_details && trackingData.scan_details.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-jost text-gray-500 mb-2">Recent Scans ({trackingData.scan_details.length} total)</p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {trackingData.scan_details.slice(0, 3).map((scan: any, index: number) => (
                              <div key={index} className="text-xs bg-white border border-gray-100 rounded p-2">
                                <p className="font-suez font-semibold text-gray-900">{scan.status || scan.scan_type}</p>
                                {scan.location && (
                                  <p className="font-jost text-gray-600">{scan.location}</p>
                                )}
                                {scan.scan_datetime && (
                                  <p className="font-jost text-gray-400 mt-0.5">{scan.scan_datetime}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expected Delivery */}
                      {(trackingData.order_details?.expected_delivery_date || order.shippingDetails.estimatedDelivery) && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-jost text-gray-600">Expected Delivery</p>
                              <p className="text-sm font-suez font-semibold text-green-700">
                                {trackingData.order_details?.expected_delivery_date || order.shippingDetails.estimatedDelivery}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Message fallback */}
                      {trackingData.message && !trackingData.current_status && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800 font-jost">{trackingData.message}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status History */}
                  {order.shippingDetails.statusHistory && order.shippingDetails.statusHistory.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h3 className="font-suez font-semibold mb-3">Tracking History</h3>
                      <div className="space-y-2">
                        {order.shippingDetails.statusHistory.slice(-5).reverse().map((history: any, index: number) => (
                          <div key={index} className="flex gap-3 text-sm">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-[#F1B213] mt-1.5"></div>
                              {index !== order.shippingDetails.statusHistory.slice(-5).length - 1 && (
                                <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-3">
                              <p className="font-suez font-semibold text-gray-900">
                                {history.status?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </p>
                              {history.message && (
                                <p className="font-jost text-gray-600 text-xs mt-0.5">{history.message}</p>
                              )}
                              {history.location && (
                                <p className="font-jost text-gray-500 text-xs mt-0.5">{history.location}</p>
                              )}
                              <p className="font-jost text-gray-400 text-xs mt-1">
                                {formatDate(history.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing' ? (
              <div className="bg-white rounded-lg border border-black p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="w-6 h-6 text-[#F1B213]" />
                  <h2 className="text-2xl font-bold font-suez">Shipment Tracking</h2>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-jost">
                    📦 Your shipment is being prepared. Tracking information will be available once the package is dispatched.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Shipping Details */}
            <div className="bg-white rounded-lg border border-black p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-[#F1B213]" />
                <h2 className="text-2xl font-bold font-suez">Shipping Address</h2>
              </div>
              {order.shippingAddress ? (
                <div className="space-y-2 text-sm">
                  <p className="font-bold font-suez">{order.shippingAddress.fullName}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-jost">{order.shippingAddress.address}</p>
                      {order.shippingAddress.area && <p className="font-jost">{order.shippingAddress.area}</p>}
                      <p className="font-jost">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                      </p>
                      <p className="font-jost">{order.shippingAddress.country || 'India'}</p>
                    </div>
                  </div>
                  {order.shippingAddress.email && (
                    <div className="flex items-center gap-2 pt-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="font-jost">{order.shippingAddress.email}</span>
                    </div>
                  )}
                  {order.shippingAddress.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="font-jost">{order.shippingAddress.phone}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No shipping address added</p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                to="/profile"
                className="block w-full bg-black text-white text-center py-3 rounded-lg font-suez hover:bg-gray-800 transition-colors"
              >
                View All Orders
              </Link>
              <Link
                to="/products"
                className="block w-full bg-[#F1B213] text-white text-center py-3 rounded-lg font-suez hover:bg-[#E5A612] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
