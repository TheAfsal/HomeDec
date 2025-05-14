import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import SideNavbar from '../../../components/NavigationComponents/SideNavBar';
import Navbar from '../../../components/NavigationComponents/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRole } from '../../../redux/slices/authSlice';
import { AUTH_ROUTES } from '../../../config/routerConstants';
import { ScrollArea } from "@/components/ui/scroll-area"


const AdminHomePage = () => {

    const { loading, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const urlRole = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);


    useEffect(() => {


        const token = localStorage.getItem("token");
        if (token) {
            dispatch(fetchUserRole()).then((data) => {
                navigate(`${urlRole.pathname}`)
            });
        }
        else {
            if (urlRole.pathname.includes("admin")) navigate(`/${AUTH_ROUTES.MANAGEMENT_AUTH}/${AUTH_ROUTES.ADMIN_LOGIN}`)
            else navigate(`/${AUTH_ROUTES.MANAGEMENT_AUTH}/${AUTH_ROUTES.SELLER_LOGIN}`)
        }
    }, [dispatch, isAuthenticated]);

    if (loading) return <>Loading...</>

    return (
        <div className="flex bg-background_grey ">
            <SideNavbar isCollapsed={isCollapsed} />
            <div className="flex-1 ">
                <div className="flex flex-col h-screen">
                    <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                    <ScrollArea className="flex-1 overflow-y-auto my-2 rounded-lg">
                        <Outlet />
                    </ScrollArea>
                </div>
            </div>

        </div>
    );
};

export default AdminHomePage;
