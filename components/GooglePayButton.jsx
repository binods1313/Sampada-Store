import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const GooglePayButton = ({ cartItems, totalPrice, userEmail }) => {
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    const initializeGooglePay = async () => {
      console.log('Initializing Google Pay, totalPrice:', totalPrice);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

      if (!stripe) {
        console.error('Failed to load Stripe for Google Pay');
        return;
      }

      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total Amount',
          amount: Math.round(totalPrice * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check if Google Pay is available
      const canMakePayment = await pr.canMakePayment();
      console.log('Google Pay canMakePayment result in component:', canMakePayment);

      // Handle different response formats from canMakePayment
      let googlePayAvailable = false;
      if (canMakePayment) {
        // Check for Google Pay specifically
        googlePayAvailable = canMakePayment.googlePay || canMakePayment.applePay || canMakePayment.methodName === 'google.com/pay';
      }

      if (googlePayAvailable) {
        console.log('Setting payment request');
        setPaymentRequest(pr);
      } else {
        console.log('Google Pay not available');
      }

      // Handle payment method event
      pr.on('paymentmethod', async (ev) => {
        console.log('Payment method event received');
        try {
          // Create order on your backend
          const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cartItems,
              userEmail,
              paymentMethodId: ev.paymentMethod.id,
              totalPrice,
            }),
          });

          const { clientSecret, error } = await response.json();

          if (error) {
            console.error('Error in payment processing:', error);
            ev.complete('fail');
            return;
          }

          // Confirm the payment
          const { error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

          if (confirmError) {
            console.error('Payment confirmation error:', confirmError);
            ev.complete('fail');
          } else {
            ev.complete('success');
            // Redirect to success page
            window.location.href = '/success';
          }
        } catch (error) {
          console.error('Payment error:', error);
          ev.complete('fail');
        }
      });
    };

    if (totalPrice > 0) {
      initializeGooglePay();
    }
  }, [cartItems, totalPrice, userEmail]);

  if (!paymentRequest) {
    return null;
  }

  return (
    <>
      <div className="google-pay-button-container">
        <button
          onClick={() => paymentRequest.show()}
          className="google-pay-button"
        >
          <img
            src="https://www.gstatic.com/instantbuy/svg/light/en.svg"
            alt="Google Pay"
            className="google-pay-icon"
          />
        </button>
      </div>
      <style jsx>{`
        .google-pay-button-container {
          width: 100%;
        }

        .google-pay-button {
          background-color: #000;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .google-pay-button:hover {
          opacity: 0.9;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }

        .google-pay-icon {
          height: 24px;
        }
      `}</style>
    </>
  );
};

export default GooglePayButton;