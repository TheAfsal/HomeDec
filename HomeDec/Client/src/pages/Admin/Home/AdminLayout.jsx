import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import SideNavbar from '../../../components/NavigationComponents/SideNavBar';
import Navbar from '../../../components/NavigationComponents/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRole } from '../../../redux/slices/authSlice';
import { AUTH_ROUTES } from '../../../config/routerConstants';

const AdminHomePage = () => {

    const { loading, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const urlRole = useLocation();

    useEffect(() => {
        console.log(urlRole);

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
        <div className="flex">
            <SideNavbar />
            <div className="flex-1 bg-pure_white">
                <div className="flex flex-col h-screen">
                    <Navbar />
                    <main className="flex-1 p-4 bg-background_grey  overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>

        </div>
    );
};

export default AdminHomePage;
