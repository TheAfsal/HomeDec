import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { enableLoading, fetchUserProfile, selectError, selectLoading, selectProfile, setProfile } from '../../../redux/slices/userProfileSlice';
import ContactInfo from './components/ContactInfo';
import PasswordSection from './components/passwordSection';
import CircularLoader from '../../../components/Loading/CircularLoader';
import userAPI from '../../../api/apiConfigUser';

const ProfilePage = () => {

    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const [formData, setFormData] = useState({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        dob: profile?.dob || '',
        gender: '',
        image: '',
    })
    const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!profile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, profile]);

    useEffect(() => {
        setFormData(profile)
    }, [profile])


    if (loading) return (<CircularLoader />);
    if (error) return <p>Error: {error}</p>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleGenderChange = (selectedGender) => {
        setFormData({
            ...formData,
            gender: selectedGender,
        });
        setIsGenderPickerOpen(false);
    };

    const resetProfile = () => {
        setFormData(profile)
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        if (formData.firstName.trim().length < 3) newErrors.firstName = "First name must be at least 3 characters.";
        if (formData.lastName.trim().length < 3) newErrors.lastName = "Last name must be at least 3 characters.";
        if (!formData.dob) newErrors.dob = "Date of birth is required.";
        if (!formData.gender) newErrors.gender = "Gender is required.";
        if (!formData.image) newErrors.image = "Profile image is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return
        } else {
            try {
                if (profile === formData) {
                    return setErrors({ serverError: "Please make any changes" })
                }
                dispatch(enableLoading());

                const uploadFormData = new FormData();






                uploadFormData.append('firstName', formData.firstName);
                uploadFormData.append('lastName', formData.lastName);
                uploadFormData.append('dob', formData.dob);
                uploadFormData.append('gender', formData.gender);




                if (!formData?.image?.secure_url) {
                    uploadFormData.append('image', formData.image);
                }


                const key = localStorage.getItem('key');
                // Send request to the API
                const response = await userAPI.post('/account/profile/edit-basic-details', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${key}`,
                    },
                });

                setToast(true, "Detials updated successfully")
                dispatch(setProfile(response.data));


            } catch (error) {
                setToast(false, error.message)

                setErrors({ serverError: error });
            }
        }
    };

    function setToast(status, message) {
        if (status) {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Personal info</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Basic info</h3>
                <div className='flex justify-between items-center'>
                    <div className="gap-4 w-5/6">
                        <div className='flex gap-6'>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">First name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    defaultValue={formData?.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border rounded-lg"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Last name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    defaultValue={formData?.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border rounded-lg"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div className='flex gap-6 mt-5'>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    defaultValue={formData?.dob?.split('T')[0]}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border rounded-lg"
                                />
                                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                            </div>
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="gender"
                                        defaultValue={formData?.gender} // Use value instead of defaultValue
                                        onClick={() => setIsGenderPickerOpen(true)}
                                        readOnly
                                        className="mt-1 block w-full p-2 border rounded-lg"
                                    />
                                    {isGenderPickerOpen && (
                                        <div className="absolute w-96 z-10 bg-white border rounded-lg shadow-lg">
                                            {['Male', 'Female'].map((option) => (
                                                <div
                                                    key={option}
                                                    onClick={() => handleGenderChange(option)}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                            </div>

                        </div>

                    </div>
                    <div className='w-1/6 flex justify-center items-center'>
                        <label htmlFor="file-input">
                            <img
                                className='w-28 h-28 rounded-full shadow-md cursor-pointer'
                                src={formData?.image?.secure_url || formData?.imagePreview || "https://imgs.search.brave.com/rHugnG0lSI5PWntYvX1VBLSxj3LSVwj1oTSa2tKLq2M/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9vbWJyZS1uYXR1/cmUtbG9nb185ODEw/NjEtMzQzMDIuanBn/P3NpemU9NjI2JmV4/dD1qcGc"}
                                alt="Profile"
                            />
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    // Create a FileReader to read the file
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        // Set the image preview in formData
                                        setFormData(prevData => ({
                                            ...prevData,
                                            image: file,
                                            imagePreview: reader.result // Save the data URL for preview
                                        }));
                                    };
                                    reader.readAsDataURL(file); // Read the file as a data URL
                                }
                            }}
                        />

                    </div>
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

                </div>
                {errors.serverError && <p className="text-red-500 text-xs mt-1">{errors.serverError}</p>}
                <div className="mt-4 flex space-x-4">
                    <button className="bg-green_500 text-white px-4 py-2 rounded-lg" onClick={handleSubmit} >Save changes</button>
                    <button className="bg-gray-200 px-4 py-2 rounded-lg" onClick={resetProfile} >Close</button>
                </div>
            </div>

            <ContactInfo profile={profile} setToast={setToast} />

            <PasswordSection setToast={setToast} />


            {/* <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Delete account</h3>
                <p className="text-sm text-gray-600 mb-4">
                    When you delete your account, your public profile will be deactivated immediately. If you
                    change your mind before the 14 days are up, sign in with your email and password, and we'll
                    send you a link to reactivate your account.
                </p>
                <button className="text-red-500">Delete account</button>
            </div> */}
        </div>
    )
}

export default ProfilePage
