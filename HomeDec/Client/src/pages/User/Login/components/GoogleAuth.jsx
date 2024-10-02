// AuthHandler.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../redux/slices/authSlice';

const GoogleAuth = () => {
    // const location = useLocation();
    const { token } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // const queryParams = new URLSearchParams(location.search);
        // const token = queryParams.get('token');

        if (token) {
            // Assuming user info is obtained or defined here
            // const user = { /* user information */ };

            localStorage.setItem("key", token);
            dispatch(loginSuccess({
                user: null,
                token,
                role: "user",
            }));

            // Redirect to profile or home page
            navigate('/'); // Adjust this as necessary
        }
    }, [location, dispatch]);

    return <div>Loading...</div>;
};

export default GoogleAuth;
