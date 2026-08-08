import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentProcessing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { transactionId } = location.state || {};

    const [status, setStatus] = useState('PENDING');
    const [message, setMessage] = useState('Awaiting payment confirmation...');

    useEffect(() => {
        if (!transactionId) {
            console.error("Polling Error: No transactionId found in state.");
            setStatus('FAILED');
            setMessage('Transaction ID missing. Please restart the process.');
            return;
        }

        let isMounted = true; // Prevent state updates if unmounted

        const checkPaymentStatus = async () => {
            try {
                // Log the exact URL we are hitting for debugging
                const url = `/api/payments/status/${transactionId}`;
                console.log(`Polling backend at: ${url}`);

                const response = await fetch(url);

                // Handle HTTP errors explicitly
                if (response.status === 404) {
                    throw new Error('Transaction not found on server (404).');
                }
                if (!response.ok) {
                    throw new Error(`Server returned status ${response.status}`);
                }

                const data = await response.json();
                console.log("Backend status response:", data);

                if (data.status === 'PAID') {
                    if (isMounted) {
                        setStatus('PAID');
                        setMessage('Payment verified! Your registration is complete.');
                    }
                    return true; // Stop polling
                } else if (data.status === 'FAILED') {
                    if (isMounted) {
                        setStatus('FAILED');
                        setMessage('Payment failed. Please try again.');
                    }
                    return true; // Stop polling
                }
                return false; // Continue polling
            } catch (err) {
                console.error('Polling Error:', err.message);
                // If we encounter a fetch error, we keep the user on the screen without crashing
                if (isMounted) {
                    setMessage(`Waiting for Safaricom... (${err.message})`);
                }
                return false; // Keep polling, it might recover
            }
        };

        // Poll every 3 seconds
        const interval = setInterval(async () => {
            const shouldStop = await checkPaymentStatus();
            if (shouldStop) {
                clearInterval(interval);
                console.log("Polling stopped. Final status achieved.");
            }
        }, 3000);

        // Run immediately on mount
        checkPaymentStatus();

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [transactionId, navigate]);

    return (
        <div className="payment-page-container">
            <div className="payment-card" style={{ textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                {/* --- PENDING STATE --- */}
                {status === 'PENDING' && (
                    <>
                        <div className="spinner" style={{ fontSize: '50px', marginBottom: '20px' }}>
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        </div>
                        <h2>Check Your Phone</h2>
                        <p style={{ color: '#5a4e42', marginBottom: '10px' }}>
                            We have sent an M-Pesa prompt to <strong>{location.state?.phone || 'your phone'}</strong>.
                        </p>
                        <p style={{ fontSize: '14px', color: '#5a4e42' }}>
                            Please open your M-Pesa app, enter your PIN, and confirm the amount.
                            <br /><strong>This page will update automatically once confirmed.</strong>
                        </p>
                    </>
                )}

                {/* --- REGISTRATION COMPLETE / SUCCESS STATE --- */}
                {status === 'PAID' && (
                    <div>
                        <div style={{ color: '#2c5e43', fontSize: '60px', marginBottom: '20px' }}>
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h2 style={{ color: '#2c5e43' }}>Registration Complete!</h2>
                        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                            {message}
                            <br /><span style={{ fontSize: '14px', color: '#5a4e42' }}>Your payment has been received and your registration is now active.</span>
                        </p>
                        {/* User chooses when to leave the page - This closes the tandem loop */}
                        <button
                            className="pay-btn"
                            onClick={() => navigate('/')}
                            style={{ marginTop: '10px', width: 'auto', padding: '12px 30px' }}
                        >
                            Go to Homepage
                        </button>
                    </div>
                )}

                {/* --- FAILED STATE --- */}
                {status === 'FAILED' && (
                    <div>
                        <div style={{ color: '#d9534f', fontSize: '60px', marginBottom: '20px' }}>
                            <i className="fa-solid fa-circle-xmark"></i>
                        </div>
                        <h2 style={{ color: '#d9534f' }}>Payment Failed</h2>
                        <p>{message}</p>
                        <button
                            className="pay-btn"
                            onClick={() => navigate('/')}
                            style={{ marginTop: '10px', width: 'auto', padding: '12px 30px' }}
                        >
                            Go Back Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentProcessing;