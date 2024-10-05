import React from 'react';
import { Link } from 'react-router-dom';
import { USER_ROUTES } from '../../../../config/routerConstants';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      {/* Order Success Section */}
      <div className="bg-green-100 rounded-lg shadow-md p-10 w-full max-w-4xl text-center relative">
        {/* Top Floating Fruits */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* <img
            src="https://linktoyourimage1.png"
            alt="Fruit"
            className="absolute top-0 left-10"
            style={{ width: '100px' }}
          />
          <img
            src="https://linktoyourimage2.png"
            alt="Banana"
            className="absolute top-10 right-20"
            style={{ width: '80px' }}
          /> */}
          {/* Add more floating images as needed */}
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Your order <span className="font-bold"></span> has been accepted and will be processed shortly. Expect our courier today (Sunday, May 9) between 12:00 and 14:00.
        </p>
        <Link to={`/${USER_ROUTES.SHOP}`} className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700">
          Continue shopping
        </Link>
      </div>

      {/* Coupon Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 w-full max-w-4xl text-center">
        <p className="text-xl font-bold mb-4">
          <span role="img" aria-label="confetti">
            🎉
          </span>{' '}
          Congratulations! 30% off your new purchase!
        </p>
        <p className="text-gray-600 mb-4">Use the coupon now or find it in your personal account.</p>

        <div className="flex justify-center items-center">
          <input
            type="text"
            value="30%SALEOFF"
            readOnly
            className="border border-gray-300 rounded-l-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button className="bg-gray-900 text-white px-4 py-2 rounded-r-lg hover:bg-gray-700">
            Copy coupon
          </button>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-6 text-sm text-gray-600">
        Need help? <a href="/contact" className="text-blue-500 hover:underline">Contact us</a>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
