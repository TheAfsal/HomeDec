import { getWalletDetails } from '@/api/user/account';
import React, { useEffect, useState } from 'react';

const Wallet = () => {
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWalletDetails = async () => {
            try {
                const data = await getWalletDetails();
                setWalletBalance(data.walletBalance);
                setTransactions(data.transactions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWalletDetails();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">My Wallet</h1>
            {loading && <div className="text-gray-600">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {!loading && !error && (
                <>
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">Current Balance</h2>
                        <p className="text-3xl font-bold text-green-600 mt-2">${walletBalance.toFixed(2)}</p>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Transaction History</h2>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Date</th>
                                <th className="py-2 px-4 border">Amount</th>
                                <th className="py-2 px-4 border">Type</th>
                                <th className="py-2 px-4 border">Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{new Date(transaction.transactionDate).toLocaleString()}</td>
                                        <td className="py-2 px-4 border">${transaction.amount.toFixed(2)}</td>
                                        <td className="py-2 px-4 border">{transaction.transactionType}</td>
                                        <td className="py-2 px-4 border">{transaction.orderId || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 border text-center">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Wallet;
