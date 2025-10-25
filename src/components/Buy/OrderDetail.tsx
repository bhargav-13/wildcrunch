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
  Copy
} from 'lucide-react';
import Header from '../Header';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI } from '@/services/api';
import { toast } from 'sonner';
import localProducts from '@/data/product';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view order');
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getById(id!);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          toast.error('Order not found');
          navigate('/profile');
        }
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch order');
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

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
  const shipping = order.shippingPrice || 60;
  const total = order.totalPrice || 0;

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
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                  <span className="font-jost text-gray-600">Payment Method:</span>
                  <span className="font-suez font-semibold capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                  <span className="font-jost text-gray-600">Payment Status:</span>
                  <span className={getStatusBadge(order.paymentStatus)}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="font-jost text-gray-600">Paid At:</span>
                    <span className="font-suez text-sm">{formatDate(order.paidAt)}</span>
                  </div>
                )}
                {order.paymentDetails?.razorpayPaymentId && (
                  <div className="flex justify-between items-center py-2 pt-3 border-t border-dashed border-gray-300">
                    <span className="font-jost text-gray-600">Transaction ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-suez text-sm">{order.paymentDetails.razorpayPaymentId}</span>
                      <button
                        onClick={() => copyToClipboard(order.paymentDetails.razorpayPaymentId, 'Transaction ID')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
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
