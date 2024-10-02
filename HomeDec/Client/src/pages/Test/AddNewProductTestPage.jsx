import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestToast = () => {
    const handleSave = () => {
        // Simulate success or error
        const isSuccess = true; // Change this to test

        if (isSuccess) {
            toast.success("Details updated successfully");
        } else {
            toast.error("Failed to update details");
        }
    };

    return (
        <div>
            <h1>Your Application</h1>
            <button onClick={handleSave}>Save</button>
            <ToastContainer />
        </div>
    );
};

export default TestToast;
