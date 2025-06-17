import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../redux/slices/authSlice';

const GoogleAuth = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const error = queryParams.get('error');

        if (error) {
            console.error("Google login failed");
            navigate('/login'); // Or show error toast
            return;
        }

        if (token) {
            localStorage.setItem("key", token);
            dispatch(
                loginSuccess({
                    user: null, // You can fetch user info if needed
                    token,
                    role: "user",
                })
            );
            navigate('/');
        }
    }, [location, dispatch, navigate]);

    return <div>Loading... Please wait.</div>;
};

export default GoogleAuth;
