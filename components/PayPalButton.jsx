import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const PayPalButton = ({ cartItems, totalPrice, currency = 'USD', customerEmail }) => {
  const router = useRouter();
  
  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: currency.toUpperCase(),
    intent: "capture",
  };

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price || item.variantPrice || item.basePrice
          })),
          totalPrice,
          currency,
          customerEmail
        }),
      });

      const order = await response.json();

      if (order.id) {
        return order.id;
      } else {
        const errorDetail = order?.details?.[0];
        const errorMessage = errorDetail 
          ? `${errorDetail.issue} ${errorDetail.description} (${order.debug_id})`
          : "Could not initiate PayPal Checkout.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create PayPal order.");
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    const loadingToast = toast.loading('Capturing payment...');
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      });

      const details = await response.json();
      
      if (details.success) {
        toast.dismiss(loadingToast);
        toast.success('Payment successful!');
        router.push(`/success?payment_id=${details.transactionId}&source=paypal`);
      } else {
        throw new Error("Payment capture failed.");
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to capture PayPal payment.");
    }
  };

  const onError = (err) => {
    console.error("PayPal Error:", err);
    toast.error("An error occurred with PayPal. Please try again.");
  };

  const onCancel = () => {
    toast.error("Payment cancelled.");
  };

  if (!initialOptions["client-id"]) {
    return (
      <div style={{ padding: '10px', background: '#fff4f4', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#d32f2f', fontSize: '13px' }}>
        PayPal is not properly configured. Please contact support.
      </div>
    );
  }

  return (
    <div style={{ marginTop: '10px', width: '100%', minHeight: '150px' }}>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal"
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;
