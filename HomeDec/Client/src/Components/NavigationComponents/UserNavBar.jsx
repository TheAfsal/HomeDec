import React from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoMdLogIn } from 'react-icons/io'
import { IoHeartHalfOutline } from 'react-icons/io5'
import { PiShoppingCartSimpleBold } from 'react-icons/pi'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AUTH_ROUTES, USER_ROUTES } from '../../config/routerConstants'

const UserNavBar = () => {

    const { role } = useSelector(state => state.auth);

    return (
        <nav className="bg-transparent shadow-lg fixed w-full top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to={`${USER_ROUTES.HOME}`} className="text-2xl font-bold text-green_700">
                    HomeDec
                </Link>

                {/* Menu Links */}
                <div className="hidden md:flex space-x-6">
                    <Link to={`${USER_ROUTES.HOME}`} className="text-gray-600 hover:text-green_500">
                        Home
                    </Link>
                    <Link to={`${USER_ROUTES.SHOP}`} className="text-gray-600 hover:text-green_500">
                        Shop
                    </Link>
                    <Link to="/about" className="text-gray-600 hover:text-green_500">
                        About
                    </Link>
                    <Link to="/contact" className="text-gray-600 hover:text-green_500">
                        Contact
                    </Link>
                </div>

                {/* Search Bar */}
                {/* <div className="relative hidden md:block">
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
                </div> */}

                {/* Cart Icon */}
                <div className="flex items-center space-x-7">
                    <Link to={`/${USER_ROUTES.ACCOUNT}/${USER_ROUTES.WISHLIST}`} className="relative  text-gray-600 hover:text-green_500">
                        <IoHeartHalfOutline size={20} />
                    </Link>
                    <Link to={`${USER_ROUTES.CART}`} className="relative text-gray-600 hover:text-green_500">
                        <PiShoppingCartSimpleBold size={19} />
                    </Link>

                    {
                        role === "user" ? (<Link to={`/${USER_ROUTES.ACCOUNT}/${USER_ROUTES.ORDERS}`} className='text-gray-600 hover:text-green_500'><FaRegUserCircle size={18} /></Link>) : (<Link to={`${AUTH_ROUTES.LOGIN_USER}`} className="text-gray-600 hover:text-green_500">
                            <IoMdLogIn size={20} />
                        </Link>)
                    }

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
                <Link to={`${USER_ROUTES.HOME}`} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Home
                </Link>
                <Link to={`${USER_ROUTES.SHOP}`} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
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
    )
}

export default UserNavBar
