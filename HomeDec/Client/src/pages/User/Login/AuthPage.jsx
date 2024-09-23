// AdminLoginPage.js
import React from 'react';
import LoginImage from '../../../assets/Images/userLoginHeroImage.jpg';
import webIcon from '../../../assets/Images/HomeDec.png';
import { Outlet } from 'react-router-dom';

const AuthPage = () => {

    return (
        <div className="h-screen flex flex-col-reverse mx-5 md:flex-row md:m-0">
            <div className="w-full md:w-1/2 flex justify-center px-4 md:px-0">
                <div className="w-10/12 md:w-7/12 lg:w-6/12 flex flex-col justify-center">
                    <img src={webIcon} width={"150rem"} height={"5rem"} alt="HomeDec" />
                    <Outlet />
                </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:pl-5 md:pr-2 py-2">
                <img src={LoginImage} className="rounded-xl w-full h-auto md:h-full" alt="" />
            </div>
        </div>
    );
};

export default AuthPage;

