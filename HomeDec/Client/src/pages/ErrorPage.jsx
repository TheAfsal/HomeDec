import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-6">Sorry, the page you are looking for doesn't exist.</p>
                <Link to="/" className="inline-block bg-green_500 text-white px-6 py-3 rounded-lg shadow hover:bg-green_700 transition duration-200">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
