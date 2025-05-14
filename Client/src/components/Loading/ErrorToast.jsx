import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ErrorToast = ({ toastMessage }) => {

    toast.success(toastMessage);

    return (
        <div>
            <ToastContainer />
        </div>
    )
}

export default ErrorToast
