import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { MANAGEMENT_ROUTES } from '../../config/routerConstants';
import { LayoutPanelLeft, ListOrdered, FolderKanban, BookAudio, BookUser, UsersRound, Ticket, BadgePercent, List, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../../redux/slices/authSlice';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import logoIcon from '@/assets/Images/HomeDecShort.png'



const SideNavbar = ({ isCollapsed }) => {

    const { role } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navContent = [
        { icon: <LayoutPanelLeft size={17} />, content: "Dashboard", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.DASHBOARD}` },
        { icon: <ListOrdered size={17} />, content: "Orders List", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.ORDERS}` },
        { icon: <FolderKanban size={17} />, content: "Products Details", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_LIST}` },
        { icon: <BookAudio size={17} />, content: "Sales Report", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/sales-report` }
    ];

    const adminManagementContent = [
        { icon: <BookUser size={17} />, content: "Users", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.USERS}/${MANAGEMENT_ROUTES.USERS_LIST}` },
        { icon: <UsersRound size={17} />, content: "Sellers", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.SELLERS}/${MANAGEMENT_ROUTES.SELLERS_LIST}` },
        { icon: <List size={17} />, content: "Category", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.CATEGORY}/${MANAGEMENT_ROUTES.CATEGORY_LIST}` },
        { icon: <Ticket size={17} />, content: "Coupon", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.COUPON}/${MANAGEMENT_ROUTES.COUPON_LIST}` },
        { icon: <BadgePercent size={17} />, content: "Offers", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.OFFER}/${MANAGEMENT_ROUTES.OFFER_LIST}` }
    ];

    const sellerManagementContent = [
        { icon: <List size={17} />, content: "Category", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.CATEGORY}/${MANAGEMENT_ROUTES.CATEGORY_LIST}` },
        { icon: <Ticket size={17} />, content: "Coupon", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.COUPON}/${MANAGEMENT_ROUTES.COUPON_LIST}` },
        { icon: <BadgePercent size={17} />, content: "Offers", route: `/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.OFFER}/${MANAGEMENT_ROUTES.OFFER_LIST}` }
    ];

    const navManagementContent = role === "admin" ? adminManagementContent : sellerManagementContent;

    const handleLogout = () => {
        dispatch(logoutAdmin());
        navigate(`/auth/${role}`)
    };

    return (
        <nav className={`${isCollapsed ? "w-20" : "w-56"} m-2 rounded-lg shadow-md bg-pure_white text-black flex flex-col border-r font-nunito font-semibold text-sm duration-500`}>
            {
                isCollapsed
                    ? <img src={logoIcon} alt="HD" className='mt-6' />
                    // ? <div className="py-5 text-2xl font-roboto font-bold mt-2 ml-7"><span className='text-green_600' >H</span>D </div>
                    : <div className="py-5 text-2xl font-roboto font-bold ml-7"><span className='text-green_600' >Home</span>Dec </div>
            }

            <ul className="h-full p-2 flex flex-col justify-between">
                <div>
                    {navContent.map((item, index) => (
                        <NavLink
                            to={item.route}
                            key={index}
                            className={({ isActive }) =>
                                isActive
                                    ? 'w-full flex gap-3 my-2 bg-green_600 text-white mr-3 rounded-md scale-105 duration-300'
                                    : 'w-full flex gap-3 mb-1 bg-white hover:bg-green_100 text-black rounded-md hover:scale-105 duration-300'
                            }
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-48 flex items-center gap-4 rounded-md py-3 px-4 pl-5">
                                            {item.icon}
                                            {!isCollapsed && <li>{item.content}</li>}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {item.content}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </NavLink>
                    ))}
                    <hr className="m-5" />
                    {!isCollapsed && <p className="text-green_700 font-bold ml-5 my-3 text-sm">Management</p>}
                    {navManagementContent.map((item, index) => (
                        <NavLink
                            to={item.route}
                            key={index}
                            className={({ isActive }) =>
                                isActive
                                    ? 'w-full flex gap-3 my-2 bg-green_600 text-white rounded-md scale-105 duration-300'
                                    : 'w-full flex gap-3 mb-1 bg-white hover:bg-green_100 text-black rounded-md hover:scale-105 duration-300'
                            }
                        >
                            <div className="w-48 flex items-center gap-4 rounded-md py-3 px-4 pl-5">
                                {item.icon}
                                {!isCollapsed && <li>{item.content}</li>}
                            </div>
                        </NavLink>
                    ))}
                    <hr className="m-5" />
                </div>

                <button
                    className="w-full hover:scale-105 duration-200 pl-5 py-3 flex items-center gap-3 mb-1 bg-white hover:bg-green_100 text-black rounded-md cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <li className="block px-4">Log out</li>}
                </button>
            </ul>
        </nav>
    );
};

export default SideNavbar;
