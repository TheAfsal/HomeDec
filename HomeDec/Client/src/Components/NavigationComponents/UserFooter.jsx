import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import HomeDecIcon from '../../assets/Images/HomeDec.png'

const UserFooter = () => {
    return (
        <footer className="bg-gray-100 py-8 font-nunito">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 text-center sm:text-left">
                {/* Logo and Description */}
                <div className="sm:col-span-1 flex flex-col items-center sm:items-start">
                    <img src={HomeDecIcon} alt="HomeDec Logo" className="mb-4 w-24" />
                    <p className="text-gray-600 text-xs font-semibold">
                        We offer stylish, luxury furniture and decor to help you create your perfect space. Enjoy easy shopping, secure payments, and great customer service.
                    </p>
                </div>

                {/* Customer Service Links */}
                <div className="sm:col-span-1">
                    <h3 className="text-orange-500 font-semibold mb-4">Customer Service</h3>
                    <ul className="space-y-2">
                        <li className="text-gray-700 font-medium text-sm">Shipping & Delivery</li>
                        <li className="text-gray-700 font-medium text-sm">Returns & Refunds</li>
                        <li className="text-gray-700 font-medium text-sm">Order Tracking</li>
                    </ul>
                </div>

                {/* Shop Categories Links */}
                <div className="sm:col-span-1">
                    <h3 className="text-orange-500 font-semibold mb-4">Shop Categories</h3>
                    <ul className="space-y-2">
                        <li className="text-gray-700 font-medium text-sm">Beds</li>
                        <li className="text-gray-700 font-medium text-sm">Chairs</li>
                        <li className="text-gray-700 font-medium text-sm">All</li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div className="sm:col-span-1">
                    <h3 className="text-orange-500 font-semibold mb-4">Follow Us</h3>
                    <ul className="space-y-2">
                        <li className="text-gray-700 font-medium text-sm flex items-center space-x-2">
                            <FaFacebookF /> <span>Facebook</span>
                        </li>
                        <li className="text-gray-700 font-medium text-sm flex items-center space-x-2">
                            <FaTwitter /> <span>Twitter</span>
                        </li>
                        <li className="text-gray-700 font-medium text-sm flex items-center space-x-2">
                            <FaInstagram /> <span>Instagram</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Links */}
            <div className="mx-auto mt-8 pt-2">
                <ul className="flex items-center justify-between max-w-6xl text-sm pr-12 text-gray-500">
                    <p className="ml-24 text-gray-500">Copyright © 2021</p>
                    <div className='flex gap-3 mb-3'>
                        <li>Terms & Conditions</li>
                        <li>Privacy Policy</li>
                    </div>
                </ul>
            </div>
        </footer>
    )
}

export default UserFooter
