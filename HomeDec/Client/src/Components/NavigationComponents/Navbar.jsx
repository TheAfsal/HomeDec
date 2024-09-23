import React from 'react';

const Navbar = () => {
    return (
        <header className="bg-white p-4 flex justify-between items-center border">
            <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg p-2 w-1/3"
            />
            <div className="flex items-center">
                <span className="mr-3">Admin Name</span>
                <img src="/path/to/profile-icon.png" alt="Profile" className="w-10 h-10 rounded-full" />
            </div>
        </header>
    );
};

export default Navbar;
