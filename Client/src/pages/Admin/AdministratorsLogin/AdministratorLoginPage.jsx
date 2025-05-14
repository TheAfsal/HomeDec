import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbPasswordFingerprint } from 'react-icons/tb';
import { HiOutlineMail } from 'react-icons/hi';
import HomeDecIcon from '../../../assets/Images/HomeDecWhite.png';
import BackgroundVector from '../../../assets/Images/BG.webp';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRole, loginFailure, loginSuccess } from '../../../redux/slices/authSlice';
import { adminLogin, sellerLogin } from '../../../api/auth';
import { MANAGEMENT_ROUTES } from '../../../config/routerConstants';

const AdministratorLoginPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setloading] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const { role } = useSelector(state => state.auth);
    const location = useLocation();
    const urlRole = location.pathname;

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            dispatch(fetchUserRole()).then((data) => {
                navigate(`/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.DASHBOARD}`)
            });
        }
        setloading(false)
    }, [loading]);

    const onAdminLoginSubmit = async (credentials) => {
        try {
            const response = await adminLogin(credentials);
            localStorage.setItem("token", response.token)
            dispatch(loginSuccess({
                user: response.user,
                token: response.token,
                role: "admin",
            }));
            navigate(`/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.DASHBOARD}`);

        } catch (error) {
            dispatch(loginFailure(error.message));
        }
    };

    const onSellerLoginSubmit = async (credentials) => {
        try {
            const response = await sellerLogin(credentials);
            localStorage.setItem("token", response.token)
            dispatch(loginSuccess({
                user: response.user,
                token: response.token,
                role: "seller",
            }));
            navigate(`/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.DASHBOARD}`);

        } catch (error) {
            dispatch(loginFailure(error.message));
        }
    };

    if (loading) return <div>Loading...</div>

    return (
        <div className="relative flex flex-col items-center justify-center bg-green_500 w-[100vw] h-[100vh] overflow-hidden">
            <img src={BackgroundVector} alt="" />
            <div className='absolute'>
                {/* Logo */}
                <img src={HomeDecIcon} width={"200px"} alt="HomeDec" />

                {/* Form */}
                <form onSubmit={urlRole.includes('/admin') ? handleSubmit(onAdminLoginSubmit) : handleSubmit(onSellerLoginSubmit)} className="bg-white shadow-md rounded-lg p-6 w-96">
                    {/* Email Input */}
                    <div className="mb-4">
                        {authState.error && <p className="text-errorRed flex justify-center text-sm mb-3">{authState.error}</p>}
                        <div className="flex items-center border rounded-md bg-gray-100">
                            <span className="px-3 text-gray-500">
                                <HiOutlineMail />
                            </span>
                            <input
                                {...register('email', { required: 'Email is required' })}
                                className="w-full py-2 px-3 text-gray-700 focus:outline-none bg-gray-100"
                                type="email"
                                placeholder="Email"
                            />
                        </div>
                        {errors.email && <p className="text-errorRed text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <div className="flex items-center border rounded-md bg-gray-100">
                            <span className="px-3 text-gray-500">
                                <TbPasswordFingerprint />
                            </span>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                className="w-full py-2 px-3 text-gray-700 focus:outline-none bg-gray-100"
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                        {errors.password && <p className="text-errorRed text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Login Button */}
                    <button type="submit" className="w-full bg-green_500 text-white py-2 rounded-md hover:bg-green_700">
                        Login
                    </button>

                    {/* Forgot Password */}
                    <div className="text-center mt-4">
                        <a href="#" className="text-sm text-teal-700 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdministratorLoginPage;
