import React, { useState } from 'react';
import { updateContacts } from '../../../../api/user/account';
import { useDispatch } from 'react-redux';
import { changeToken } from '../../../../redux/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ContactInfo = ({ profile }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [email, setEmail] = useState(profile?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
    const [error, setError] = useState('');
    const dispatch = useDispatch()

    const handleSave = async () => {
        console.log(email, phoneNumber);
        try {
            if (!email || !phoneNumber) {
                toast.error("Email and phone number are required");
                return;
            }

            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                setError("Please enter a valid email address");
                return;
            }

            const phonePattern = /^[0-9]+$/;
            if (!phonePattern.test(phoneNumber)) {
                setError("Phone number must contain only digits");
                return;
            }

            const detials = await updateContacts(email, phoneNumber)
            toast.success("Contacts Successfully updated")
            localStorage.setItem("key", detials.token)
            dispatch(changeToken({ token: detials.token }))
            setIsEditing(false);
            // setError('');
        } catch (error) {
            toast.error(error.message)
            // setError('');
        }
    };

    return (
        <>
            <ToastContainer />
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex justify-between w-full">
                <div className='w-full'>
                    {isEditing ? (
                        <div className='w-1/3'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    defaultValue={profile?.email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div >
                                <label className="block text-sm font-medium text-gray-700 mt-3">Phone Number</label>
                                <input
                                    type="text"
                                    defaultValue={profile?.phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1 block w-full p-2 border rounded-lg"
                                />
                                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className='mb-2'>{email}</p>
                            <p>{phoneNumber} <span className="text-green-500"> Verified</span></p>
                        </div>
                    )}
                </div>
                {isEditing ? (
                    <button className="text-blue-500" onClick={handleSave}>Save</button>
                ) : (
                    <button className="text-blue-500" onClick={() => setIsEditing(true)}>Edit</button>
                )}
            </div>
        </div>
        </>

    );
};

export default ContactInfo;
