import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchRegistration = async () => {
      if (!id) {
        setError("Missing Registration ID.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`/api/registrations/${id}`);
        if (!response.ok) throw new Error(`Backend responded with ${response.status}`);
        const data = await response.json();
        setRegistration(data);
      } catch (err) {
        setError(err.message || 'Could not load registration details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistration();
  }, [id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    // Only require phone number for M-Pesa
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      alert("Please enter your M-Pesa phone number.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // If it's PayPal, we don't send a phoneNumber
      const payload = {
        transactionId: Date.now(),
        registrationId: id,
        amount: 500,
        currency: paymentMethod === 'mpesa' ? 'KES' : 'USD', // M-Pesa uses KES, PayPal uses USD
        purpose: `Registration Fee for ${registration?.name || 'User'}`,
        phoneNumber: paymentMethod === 'mpesa' ? phoneNumber : null, // Not needed for PayPal
        provider: paymentMethod.toUpperCase()
      };

      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate payment.');
      }

      if (data.status === "PENDING") {
        // If it's PayPal, the backend returns a checkoutUrl (redirect link)
        if (paymentMethod === 'paypal' && data.checkoutUrl) {
          // Redirect the user to PayPal's hosted page
          window.location.href = data.checkoutUrl;
        } else {
          // M-Pesa flow stays the same
          navigate('/payment-processing', {
            state: {
              transactionId: data.transactionId,
            }
          });
        }
      } else {
        throw new Error('Unexpected payment status: ' + data.status);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment initiation failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="payment-page-container">
      <div className="payment-card">
        <h2>Complete Your Payment</h2>
        <div className="registrant-info">
          <h3>Hi, {registration?.name || 'User'}!</h3>
          <p><strong>Email:</strong> {registration?.email}</p>
          <p><strong>Category:</strong> {registration?.category}</p>
          <hr />
          <p className="amount-text">Amount Due: <span>$500.00 / KES 50,000</span></p>
        </div>
        <form onSubmit={handlePayment} className="payment-form">
          <div className="payment-methods">
            <label className="method-label">
              <input type="radio" name="method" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} /> M-Pesa
            </label>
            <label className="method-label">
              <input type="radio" name="method" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} /> PayPal
            </label>
          </div>
          {paymentMethod === 'mpesa' && (
            <div className="form-group">
              <label>M-Pesa Phone Number (e.g., 2547XXXXXXXX)</label>
              <input type="tel" placeholder="254700000000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
          )}
          <button type="submit" className="pay-btn" disabled={processing}>
            {processing ? 'Processing...' : `Pay with ${paymentMethod || 'Selected Method'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;