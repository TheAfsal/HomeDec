import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { MANAGEMENT_ROUTES } from '../../config/routerConstants';

const SideNavbar = () => {

    const { role } = useSelector(state => state.auth);

    const navContent = [
        { content: "Dashboard", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.DASHBOARD}` },
        { content: "Orders List", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.ORDERS}` },
        { content: "Products Stock", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_LIST}` },
        { content: "Sales Report", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/sales-report` }
    ];

    const adminManagementContent = [
        { content: "Users", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.USERS}/${MANAGEMENT_ROUTES.USERS_LIST}` },
        { content: "Sellers", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.SELLERS}/${MANAGEMENT_ROUTES.SELLERS_LIST}` },
        { content: "Category", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.CATEGORY}/${MANAGEMENT_ROUTES.CATEGORY_LIST}` },
        { content: "Coupon", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.COUPON}/${MANAGEMENT_ROUTES.COUPON_LIST}` },
        { content: "Offers", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.OFFER}/${MANAGEMENT_ROUTES.OFFER_LIST}` }
    ];

    const sellerManagementContent = [
        { content: "Category", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.CATEGORY}/${MANAGEMENT_ROUTES.CATEGORY_LIST}` },
        { content: "Coupon", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.COUPON}/${MANAGEMENT_ROUTES.COUPON_LIST}` },
        { content: "Offers", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.OFFER}/${MANAGEMENT_ROUTES.OFFER_LIST}` }
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
