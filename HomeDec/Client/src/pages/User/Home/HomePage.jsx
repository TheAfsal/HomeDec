import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeroImage from '../../../assets/Images/hero.webp'


const HomePage = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, token } = useSelector(state => state.auth);

    useEffect(() => {
        console.log(isAuthenticated)
        console.log(token)
    })

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="bg-cover bg-bottom h-screen " style={{ backgroundImage: `url(${HeroImage})` }}>
            <nav className="bg-transparent shadow-lg fixed w-full top-0 z-50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-gray-800">
                        HomeDec
                    </Link>

                    {/* Menu Links */}
                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-gray-800">
                            Home
                        </Link>
                        <Link to="/shop" className="text-gray-600 hover:text-gray-800">
                            Shop
                        </Link>
                        <Link to="/about" className="text-gray-600 hover:text-gray-800">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-gray-800">
                            Contact
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            className="px-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Search for furniture..."
                        />
                        <button className="absolute right-4 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116 16l4.35 4.35z" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart Icon */}
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative">
                            <svg
                                className="w-6 h-6 text-gray-600 hover:text-gray-800"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l1.6 8.4a1 1 0 001 1h5.8a1 1 0 001-1L17 13m-6 0V6h3m-6 7H5.4" />
                            </svg>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">2</span> {/* Cart Item Count */}
                        </Link>
                        <Link to="/login" className="text-gray-600 hover:text-gray-800">
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        Home
                    </Link>
                    <Link to="/shop" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        Shop
                    </Link>
                    <Link to="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        About
                    </Link>
                    <Link to="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        Contact
                    </Link>
                </div>
            </nav>

            <div className="min-h-screen bg-gray-100 font-nunito">
                {/* Hero Section */}
                <section className="bg-cover bg-bottom h-screen" style={{ backgroundImage: `url(${HeroImage})` }}>
                    <div className="flex items-center justify-center h-full bg-gray-800 bg-opacity-40">
                        <div className="text-center text-white">
                            <h1 className="text-5xl font-bold mb-4">Make Your Interior More <br /> Minimalistic & Modern</h1>
                            <p className="text-xl mb-8">Turn your room with HomeDec into a lot more minimalist <br /> and modern with ease and speed</p>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-full">Shop Now</button>
                        </div>
                    </div>
                </section>

                {/* Featured Categories */}
                <section className="py-12">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-semibold text-center mb-8">Featured Categories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src="/path-to-chair-image.jpg" alt="Chairs" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Chairs</h3>
                                <p className="text-gray-600">Comfortable and stylish seating for every room.</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src="/path-to-table-image.jpg" alt="Tables" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Tables</h3>
                                <p className="text-gray-600">Beautiful tables to match your decor.</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src="/path-to-sofa-image.jpg" alt="Sofas" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Sofas</h3>
                                <p className="text-gray-600">Luxury sofas for your living space.</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src="/path-to-bed-image.jpg" alt="Beds" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Beds</h3>
                                <p className="text-gray-600">Premium beds for a comfortable sleep.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Products */}
                <section className="py-12 bg-gray-200">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-semibold text-center mb-8">Latest Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src="/path-to-product1-image.jpg" alt="Product 1" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Wooden Dining Chair</h3>
                                <p className="text-gray-600">$120</p>
                                <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded">Add to Cart</button>
                            </div>
                            {/* Repeat Product Card for more products */}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
