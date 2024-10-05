import React, { useState } from 'react'
import TextInput from '../../../../Components/FormComponents/TextInput';
import SubmitButton from '../../../../Components/Buttons/SubmitButton';
import GoogleLoginButton from '../../../../Components/Buttons/GoogleLoginButton';
import { useForm } from 'react-hook-form';
import { registerUser, verifyEmail } from '../../../../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginSuccess } from '../../../../redux/slices/authSlice';
import OtpModal from './OtpForm';
import CircularLoader from '../../../../Components/Loading/CircularLoader';
import { AUTH_ROUTES } from '../../../../config/routerConstants';

const RegisterForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const authState = useSelector(state => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    // const onSubmit = async (credentials) => {
    //     try {
    //         let response = await registerUser(credentials)
    //         console.log(response);
    //         localStorage.setItem("token", response.token)
    //         dispatch(loginSuccess({
    //             user: response.user,
    //             token: response.token,
    //             role: "user"
    //         }));
    //         navigate('/');

    //     } catch (error) {
    //         dispatch(loginFailure(error.message));
    //     }
    // };

    const onSubmit = async (credentials) => {
        try {
            setLoading(true);
            let response = await verifyEmail(credentials.email)
            console.log(response);
            setLoading(false);
            setIsModalOpen(credentials);
        } catch (error) {
            dispatch(loginFailure(error.message));
        }
    };

    if (loading) return (<CircularLoader />)



    return (
        <>
            <OtpModal credentials={isModalOpen} onClose={handleCloseModal} />
            <p className="text-blackLikeBlue mt-3">
                Today is a new day. It's your day. You shape it. <br />
                Sign up to start managing your projects.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
                {authState.error && <p className="text-errorRed flex justify-center text-sm my-1">{authState.error}</p>}
                <TextInput
                    type="text"
                    label="First Name"
                    placeholder="John"
                    register={register('firstName', {
                        required: 'First name is required',
                        minLength: { value: 2, message: 'First name must be at least 2 characters' },
                        pattern: {
                            value: /^[A-Za-z\s]+$/, // Only allows letters and spaces
                            message: 'First name must contain only letters and spaces'
                        }
                    })}
                    error={errors.firstName}
                />

                <TextInput
                    type="text"
                    label="Last Name"
                    placeholder="Doe"
                    register={register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                        pattern: {
                            value: /^[A-Za-z\s]+$/, // Only allows letters and spaces
                            message: 'Last name must contain only letters and spaces'
                        }
                    })}
                    error={errors.lastName}
                />

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
                    placeholder="At least 6 characters"
                    register={register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    error={errors.password}
                />
                <p className="text-splashBlue flex justify-end my-2 text-sm hover:text-black hover:cursor-pointer">
                    Forgot Password?
                </p>
                <SubmitButton label="Sign up" />
            </form>

            <div className="text-center mt-5">
                <div className="flex items-center md:my-2">
                    <hr className="flex-grow" />
                    <p className="px-3 text-blackLikeBlue text-sm">Or</p>
                    <hr className="flex-grow" />
                </div>
                <GoogleLoginButton />
                <p className="mt-4 text-md">Already have an account?
                    <Link to={`${AUTH_ROUTES.LOGIN_USER}`} className=" text-splashBlue hover:text-black hover:cursor-pointer"> Sign in</Link>
                </p>
            </div>
        </>
    )
}

export default RegisterForm
