import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginSuccess } from '../../../redux/slices/authSlice';
import TextInput from '../../../Components/FormComponents/TextInput';
import SubmitButton from '../../../Components/Buttons/SubmitButton';
import { adminLogin, sellerLogin } from '../../../api/auth';

const SellerLoginForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);


    const onSubmit = async (credentials) => {
        try {
            const response = await sellerLogin(credentials);
            localStorage.setItem("token", response.token)
            dispatch(loginSuccess({
                user: response.user,
                token: response.token,
                role: "seller",
            }));
            navigate('/admin');

        } catch (error) {
            dispatch(loginFailure(error.message));
        }

    };

    return (
        <>
            <p className="text-2xl font-semibold mt-3 mb-5 text-green_900 text-left">Welcome Back --Sellers 👋</p>
            <p className="text-blackLikeBlue">
                Today is a new day. It's your day. You shape it. <br />
                Sign in to start managing your projects.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                {authState.error && <p className="text-errorRed flex justify-center text-sm my-1">{authState.error}</p>}

                <TextInput
                    type="text"
                    label="Email"
                    placeholder="Example@email.com"
                    register={register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                    })}
                    error={errors.email}
                />
                <TextInput
                    type="password"
                    label="Password"
                    placeholder="At least 8 characters"
                    register={register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    error={errors.password}
                />
                <p className="text-splashBlue flex justify-end my-4 text-sm hover:text-black hover:cursor-pointer">
                    Forgot Password?
                </p>
                <SubmitButton label="Sign in" />
            </form>
        </>
    )
}

export default SellerLoginForm
