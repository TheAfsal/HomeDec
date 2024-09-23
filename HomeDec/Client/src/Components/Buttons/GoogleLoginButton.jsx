// GoogleLoginButton.js
import React from 'react';
import GoogleIcon from '../../assets/Images/google_icon.svg';

const GoogleLoginButton = () => {
    return (
        <button className="w-full flex items-center justify-center gap-3 rounded-md bg-green_50 hover:bg-inputField p-2 text-sm text-blackLikeBlue font-normal mt-5">
            <img src={GoogleIcon} alt="Google Icon" /> Sign in with Google
        </button>
    );
};

export default GoogleLoginButton;
