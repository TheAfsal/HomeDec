import React, { useEffect, useState } from 'react';
import { addCategory, listCategory } from '../../../api/categoryManagement';
import { useSelector } from 'react-redux';

const HandleCategoryPage = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const { role } = useSelector(state => state.auth)

    useEffect(() => {
        const addCategories = async () => {
            try {
                const list = await listCategory()
                setCategories(list);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        addCategories();
    }, []);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setIsAddingCategory(false);
    };

    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'add-new-category') {
            setIsAddingCategory(true);
        } else {
            setSelectedCategory(selectedValue);
        }
    };

    const handleSubmit = async () => {
        const response = await addCategory({ newCategory, newSubCategory })
        console.log(response);

        setNewCategory('');
        setNewSubCategory('');
        closePopup();
    };




    return (
        <div className="p-8">
            {/* Popup Overlay */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    {/* Click on background (overlay) to close */}
                    <div onClick={closePopup} className="absolute inset-0"></div>

                    {/* Popup content */}
                    <div className="bg-white rounded-lg shadow-lg p-8 z-50 max-w-lg w-full">

                        <div className='flex justify-between items-start'>
                            <h2 className="text-xl font-bold mt-2">Form Popup</h2>
                            <button
                                onClick={closePopup}
                                className=" top-2 right-2 text-4xl text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Form */}
                        <form>
                            {/* Conditional rendering for dropdown or text input */}
                            {!isAddingCategory ? (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mt-3">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                            <option value="add-new-category">
                                                Add New Category
                                            </option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="new-category" className="block text-sm font-medium text-gray-700">
                                            New Category
                                        </label>
                                        <input
                                            type="text"
                                            id="new-category"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="Enter new category"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700">
                                            Subcategory
                                        </label>
                                        <input
                                            type="text"
                                            id="sub-category"
                                            value={newSubCategory}
                                            onChange={(e) => setNewSubCategory(e.target.value)}
                                            placeholder="Enter subcategory"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Submit button */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className='flex justify-between'>
                <h1 className="text-2xl font-semibold mb-2 font-nunito">Category Management</h1>
                {
                    role === "admin" &&
                    <button
                        type="submit"
                        className=" bg-green_700 text-white font-semibold py-2 px-4 mb-2 rounded-2xl hover:bg-green_800 focus:outline-none focus:ring-2 focus:ring-green_500 focus:ring-opacity-50"
                        onClick={openPopup}
                    >
                        Add New Category
                    </button>
                }
            </div>
            <hr className='mb-5' />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg font-nunito">
                    <thead className='bg-table_header_grey'>
                        <tr >
                            <th className="py-3 border-b text-left pl-6 text-md">CATEGORY</th>
                            <th className="py-3 border-b text-left pl-6 text-md">DESCRIPTION</th>
                            <th className="py-3 border-b text-left pl-6 text-md">SUB CATEGORY</th>
                            <th className="py-3 border-b text-left pl-6 text-md">STATUS</th>
                            <th className="py-3 border-b text-left pl-6 text-md">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.length ?
                                categories.map((category, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{category?.name}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{category?.description ? category?.description : "Not Found"}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">
                                            {
                                                category.subcategories.map((subCategory, index) => (
                                                    <p key={index} >{subCategory.name}</p>
                                                ))
                                            }
                                        </td>
                                        <td className="px-6 py-4 border-b font-nunito ">
                                            <span
                                                className={`${category.isActive
                                                    ? 'bg-status_succes_background_green text-status_succes_text_green font-bold'
                                                    : 'bg-status_failed_text_red text-status_failed_background_red font-bold'
                                                    } rounded-md py-1 text-sm text-center inline-block min-w-[70px]`}
                                            >
                                                {category?.isActive ? "Active" : "Blocked"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b">
                                            <div className="flex space-x-2">
                                                <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12h.01M12 12h.01M9 12h.01M19 16H5a2 2 0 01-2-2V7a2 2 0 012-2h2.5M15 19H5a2 2 0 01-2-2V9a2 2 0 012-2h7a2 2 0 012 2v2.5"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    className={`${category.isActive
                                                        ? 'bg-green-500 hover:bg-green-600'
                                                        : 'bg-red-500 hover:bg-red-600'
                                                        } text-white p-2 rounded`}
                                                    onClick={() => changeUserStatus(user?._id)}
                                                >
                                                    {category.isActive ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 4v16m8-8H4"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-7 text-center font-nunito text-sm">
                                            No Records Found
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HandleCategoryPage;
