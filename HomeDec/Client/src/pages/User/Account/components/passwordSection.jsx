import React, { useEffect, useState } from 'react';
import { changePassword } from '../../../../api/user/account';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const PasswordSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSave = async () => {
        console.log(oldPassword, newPassword);
        try {
            if (oldPassword.length < 6 || newPassword.length < 6) {
                return setError("Password must be atleast 6 characters")
            }
            await changePassword(oldPassword, newPassword)
            setOldPassword('')
            setNewPassword('')
            setIsEditing(false);
            toast.success("Password Successfully updated")
        } catch (error) {
            setOldPassword('')
            setNewPassword('')
            setError('')
            toast.error(error.message)
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ToastContainer />
            <h3 className="text-lg font-semibold mb-4">Password</h3>
            <div className="flex justify-between w-full">
                {isEditing ? (
                    <div className="flex flex-col w-1/3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mt-3">Existing Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                placeholder="Existing Password"
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mt-3">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                placeholder="New Password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-lg"
                            />
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                    </div>
                ) : (
                    <p>************</p>
                )}
                {isEditing ? (
                    <button className="text-blue-500" onClick={handleSave}>Save</button>
                ) : (
                    <button className="text-blue-500" onClick={() => setIsEditing(true)}>Edit</button>
                )}
            </div>
        </div>
    );
};

export default PasswordSection;
