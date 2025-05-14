import React, { useState } from 'react';
import ProfilePage from '../User/Profile/ProfilePage';

const UserProfileSideBar = () => {

    return (
        <div className="flex space-x-10 p-8 mt-14">
            {/* Sidebar */}
            <div className="w-64 p-4 bg-white ">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-pink-200 text-pink-600 flex items-center justify-center rounded-full">
                        S
                    </div>
                    <div>
                        <h4 className="font-semibold">Susan Gardner</h4>
                        <p className="text-sm text-gray-500 flex items-center">
                            <span role="img" aria-label="gift" className="mr-1">🎁</span>100 bonuses available
                        </p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <i className="icon-orders" /> {/* Replace with icon */}
                            <p>Orders</p>
                        </div>
                        <div className="text-xs bg-orange-400 text-white px-2 py-1 rounded-full">1</div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="icon-wishlist" />
                        <p>Wishlist</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="icon-payment" />
                        <p>Payment methods</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="icon-reviews" />
                        <p>My reviews</p>
                    </div>
                    <h5 className="text-gray-500 text-sm mt-6 mb-2">Manage account</h5>
                    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
                        <i className="icon-personal-info" />
                        <p>Personal info</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="icon-addresses" />
                        <p>Addresses</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="icon-notifications" />
                        <p>Notifications</p>
                    </div>
                    <h5 className="text-gray-500 text-sm mt-6 mb-2">Customer service</h5>
                    <div className="flex items-center space-x-2">
                        <i className="icon-help-center" />
                        <p>Help center</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="icon-terms" />
                        <p>Terms and conditions</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="icon-logout" />
                        <p>Log out</p>
                    </div>
                </div>
            </div>

            {/* Personal Info Content */}
            <div className="flex-1">
                <ProfilePage />
            </div>
        </div>
    );
};

export default UserProfileSideBar;
