import React, { useState } from 'react';

const Payment = ({ setCurrentStep, handlePreviousStep, placeOrder, setPaymentMethod }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [error, setError] = useState('');

    const paymentMethods = [
        { id: 'cod', label: 'Cash on Delivery (COD)' },
        { id: 'online', label: 'Online Payment' },
        { id: 'wallet', label: 'Wallet' },
    ];

    return (
        <div className="space-y-4">
            <p>Payment details here...</p>

            <div className="space-y-2">
                {paymentMethods.map(method => (
                    <label key={method.id} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            className="mr-2"
                            onChange={() => {
                                setSelectedPaymentMethod(method.id);
                                setPaymentMethod(method.id);
                            }}
                            checked={selectedPaymentMethod === method.id}
                        />
                        {method.label}
                    </label>
                ))}
            </div>

            {error && <p className='text-red-500 text-sm' >{error}</p>}

            <button
                onClick={() => {
                    if (selectedPaymentMethod) {
                        setPaymentMethod(selectedPaymentMethod)
                        placeOrder()
                        setError('')
                    } else {
                        setError('Please select a payment method.');
                    }
                }}
                className="text-white bg-green-500 px-8 py-2 rounded"
            >
                Pay
            </button>
            <button
                onClick={handlePreviousStep}
                className="text-gray-600 p-2 rounded mt-4"
            >
                Back
            </button>
        </div>
    );
};

export default Payment;
