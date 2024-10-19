import React from 'react';

const PaymentPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Payment Policy</h1>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
                <p>
                    Thank you for choosing <strong>HomeDec</strong> for your furniture needs. This Payment Policy outlines our practices regarding payments made on our website. By placing an order, you agree to the terms outlined in this policy.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Accepted Payment Methods</h2>
                <ul className="list-disc ml-6">
                    <li>Credit/Debit Cards: Visa, MasterCard, American Express, Discover</li>
                    <li>Digital Wallets: PayPal, Apple Pay, Google Pay</li>
                    <li>Bank Transfers: Direct bank transfers (details provided during checkout)</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Payment Processing</h2>
                <p>
                    All transactions are processed securely through our trusted payment processor. Your payment information is encrypted and securely transmitted to ensure the highest level of security. Payments are processed at the time of purchase, and you will receive a confirmation email once the payment is successful.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Order Confirmation</h2>
                <p>
                    After your payment is processed, you will receive an order confirmation email containing the details of your purchase, including the items ordered, shipping information, and order number. Please retain this email for your records.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Pricing</h2>
                <p>
                    All prices listed on our website are in <strong>Rupee</strong> and are subject to change without notice. Sales tax or VAT may apply based on your location and will be calculated at checkout.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Pre-Orders and Backorders</h2>
                <p>
                    For pre-orders or backordered items, your payment will be processed at the time of ordering. You will be notified via email of the expected shipping date once the item becomes available.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Cancellations and Refunds</h2>
                <p>
                    If you wish to cancel your order, please contact our customer service team within <strong>24 hours</strong> of placing your order. Refunds will be processed according to our Refund Policy, which can be found on our website.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Security</h2>
                <p>
                    We take your security seriously. Our website uses SSL encryption to protect your payment information. For additional security, we may require verification of your identity for certain transactions.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
                <p>
                    If you have any questions or concerns regarding our payment policy, please contact us at:
                </p>
                <ul className="list-disc ml-6">
                    <li>Email: <strong>homedec@gmail.com</strong></li>
                    <li>Phone: <strong>+91 9897969223</strong></li>
                    <li>Address: <strong>HomeDec
                        Panapalli Nagar, Kochi
                    </strong></li>
                </ul>
            </section>

            <footer className="mt-8">
                <p className="text-center">
                    Thank you for shopping with <strong>HomeDec</strong>! We appreciate your business and are committed to providing you with a secure and pleasant shopping experience.
                </p>
            </footer>
        </div>
    );
};

export default PaymentPolicyPage;
