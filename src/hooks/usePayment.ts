import { useState } from 'react';
import { paymentAPI } from '@/services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async (
    order: any,  // Existing order with Razorpay order ID
    onSuccess: (order: any) => void,
    onFailure: (error: any) => void
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Get Razorpay key
      const keyResponse = await paymentAPI.getKey();
      const razorpayKey = keyResponse.data.keyId;

      // Use existing order data
      const razorpayOrderId = order.paymentDetails.razorpayOrderId;
      const amount = order.totalPrice;
      const orderId = order._id;

      // Razorpay options
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Wild Crunch',
        description: `Order Payment - ${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            setLoading(true);
            // Verify payment and update order
            const verifyResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId,  // Our database order ID
            });

            if (verifyResponse.data.success) {
              // Ensure loading state is maintained during redirect
              await onSuccess(verifyResponse.data.data);
            } else {
              setLoading(false);
              onFailure(new Error('Payment verification failed'));
            }
          } catch (err: any) {
            setLoading(false);
            onFailure(err);
          }
        },
        prefill: {
          name: order.shippingAddress?.fullName || order.guestName || '',
          email: order.shippingAddress?.email || order.guestEmail || '',
          contact: order.shippingAddress?.phone || order.guestPhone || '',
        },
        theme: {
          color: '#F1B213',
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', (response: any) => {
        onFailure(new Error(response.error.description));
      });

      razorpay.open();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to initialize payment';
      setError(errorMsg);
      onFailure(new Error(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return {
    initializePayment,
    loading,
    error,
  };
};
