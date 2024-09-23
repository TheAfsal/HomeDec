import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavbar from '../../../Components/NavigationComponents/SideNavBar';
import Navbar from '../../../Components/NavigationComponents/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRole } from '../../../redux/slices/authSlice';

const AdminHomePage = () => {

    const { authState, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();


    useEffect(() => {
        console.log(loading);
        const token = localStorage.getItem("token");

        if (token) {
            dispatch(fetchUserRole());
        }

    }, [dispatch]);

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
