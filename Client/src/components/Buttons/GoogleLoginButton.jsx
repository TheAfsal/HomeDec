// GoogleLoginButton.js
import React from 'react';
import GoogleIcon from '../../assets/Images/google_icon.svg';

const GoogleLoginButton = () => {

    const handleSignIn = () => {
        window.location.href = `${import.meta.env.MODE === 'development' ? 'http://localhost:3000' : import.meta.env.VITE_SERVER_URL}/auth/google`;
    };

    return (
        <button className="w-full flex items-center justify-center gap-3 rounded-md bg-green_50 hover:bg-inputField p-2 text-sm text-blackLikeBlue font-normal mt-5"
            onClick={handleSignIn}
        >
            <img src={GoogleIcon} alt="Google Icon" /> Sign in with Google
        </button>
    );
};

export default GoogleLoginButton;
