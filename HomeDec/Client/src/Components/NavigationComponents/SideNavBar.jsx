import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

const SideNavbar = () => {

    const { role } = useSelector(state => state.auth);

    const navContent = [
        { content: "Dashboard", route: `/${role}/dashboard` },
        { content: "Orders List", route: `/${role}/orders` },
        { content: "Products Stock", route: `/${role}/products/list` },
        { content: "Sales Report", route: `/${role}/sales-report` }
    ];

    const adminManagementContent = [
        { content: "Users", route: `/${role}/users/list` },
        { content: "Sellers", route: `/${role}/sellers/list` },
        { content: "Category", route: `/${role}/category/list` },
        { content: "Coupon", route: `/${role}/coupon/list` },
        { content: "Offers", route: `/${role}/offers/list` }
    ];

    const sellerManagementContent = [
        { content: "Category", route: `/${role}/category/list` },
        { content: "Coupon", route: `/${role}/coupon/list` },
        { content: "Offers", route: `/${role}/offers/list` }
    ];

    const navManagementContent = role === "admin" ? adminManagementContent : sellerManagementContent;

    return (
        <nav className="w-52 bg-pure_white text-black h-screen flex flex-col border-r">
            <div className="py-5 text-2xl font-semibold ml-7"><span className='text-green_600' >Home</span>Dec </div>
            <ul className='flex-col h-full p-2'>
                {
                    navContent.map((item, index) => (
                        <NavLink
                            to={item.route}
                            key={index}

                            className={({ isActive }) =>
                                isActive
                                    ? 'w-full flex gap-3 mb-1 bg-green_600 text-white rounded-md'
                                    : 'w-full flex gap-3 mb-1 bg-white hover:bg-green_100 text-black rounded-md'
                            }
                        >
                            {/* Left border indicator */}
                            {/* <div
                                className={({ isActive }) =>
                                    isActive ? 'bg-green_600 w-1.5 rounded-e-md' : 'bg-white w-1.5 rounded-e-md'
                                }
                            ></div> */}

                            {/* Content block */}
                            <div className="w-48 flex rounded-md py-1 pl-5">
                                <li className="block py-2 px-4">{item.content}</li>
                            </div>
                        </NavLink>
                    ))
                }
                <hr className='m-5' />
                <p className='text-green_700 font-bold ml-5 text-sm' >Management</p >
                {
                    navManagementContent.map((item, index) => (
                        <NavLink
                            to={item.route}
                            key={index}

                            className={({ isActive }) =>
                                isActive
                                    ? 'w-full flex gap-3 mb-1 bg-green_600 text-white rounded-md'
                                    : 'w-full flex gap-3 mb-1 bg-white hover:bg-green_100 text-black rounded-md'
                            }
                        >
                            {/* Left border indicator */}
                            {/* <div
                                className={({ isActive }) =>
                                    isActive ? 'bg-green_600 w-1.5 rounded-e-md' : 'bg-white w-1.5 rounded-e-md'
                                }
                            ></div> */}

                            {/* Content block */}
                            <div className="w-48 flex rounded-md py-1 pl-5">
                                <li className="block py-2 px-4">{item.content}</li>
                            </div>
                        </NavLink>
                    ))
                }
                <hr className='m-5' />

            </ul>
        </nav>
    );
};

export default SideNavbar;
