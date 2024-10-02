import React, { useEffect, useState } from 'react';
import { registerUser, verifyEmail } from '../../../../api/auth';
import { useDispatch } from 'react-redux';
import { loginFailure, loginSuccess } from '../../../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const OtpModal = ({ credentials, onClose }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [timer, setTimer] = useState(10);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()


    useEffect(() => {
        if (credentials) {
            setTimer(10);
            setCanResend(false);
            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [credentials]);



    const onSubmit = async (e) => {
        e.preventDefault()
        setSuccess(false);
        setError('');
        setLoading(true);
        try {
            setSuccess(false);
            let response = await registerUser({ otp, credentials })
            console.log(response);
            localStorage.setItem("key", response.token)
            dispatch(loginSuccess({
                user: response.user,
                token: response.token,
                role: "user"
            }));
            setOtp('');
            navigate('/');

        } catch (error) {
            console.error("Error during registration:", error);
            setError('Invalid OTP. Please try again.');
            dispatch(loginFailure(error.message));
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleResend = async () => {
        setError('');
        setLoading(true); // Start loading

        try {
            await verifyEmail(credentials.email); // Call your API to resend OTP
            setTimer(100); // Reset timer
            setCanResend(false); // Disable resend until the timer runs out
        } catch (error) {
            console.error("Error resending OTP:", error);
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };


    return (
        <div className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ${credentials ? '' : 'hidden'}`}>
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">OTP verified successfully!</p>}
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="border border-gray-300 rounded p-2 mb-4 w-full"
                        required
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                        >
                            Verify
                        </button>
                    </div>
                </form>
                {canResend ? (
                    <button
                        onClick={handleResend}
                        className="text-blue-500 mt-2 hover:underline"
                    >
                        Resend OTP
                    </button>
                ) : (
                    <p className="mt-2 text-gray-500">Resend available in {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
                )}
            </div>
        </div>
    );
};

export default OtpModal;
