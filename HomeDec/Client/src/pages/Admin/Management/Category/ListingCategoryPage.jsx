import React, { useEffect, useState } from 'react';
import AddCategory from './components/AddCategory';
import IsAdmin from '../../../../Components/Admin/IsAdmin';
import TableHeader from '../../../../Components/Table/TableHeader';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { FiEdit3 } from 'react-icons/fi';
import NoRecords from '../../../../Components/Table/NoRecords';
import UpdateCategory from './components/UpdateCategory';
import { useSelector } from 'react-redux';
import { changeStatusCategory, listCategory } from '../../../../api/administrator/categoryManagement';

const ListingCategory = () => {

    const [addPopup, setAddPopup] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editPopup, setEditPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const { role } = useSelector(state => state.auth);

    const openModal = (category, subCategory) => {
        setSelectedCategory(category);
        setSelectedSubCategory(subCategory);
        setEditPopup(true);
    };

    const closeModal = () => {
        setEditPopup(false);
        setSelectedCategory(null);
        setSelectedSubCategory(null);
    };

    useEffect(() => {
        const addCategories = async () => {
            try {
                const list = await listCategory(role)
                setCategories(list);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        addCategories();
    }, []);

    const changeCategoryStatus = async (id) => {
        try {
            const updatedSubCategory = await changeStatusCategory(id)
            setCategories((prevCategories) =>
                prevCategories.map((category) => {
                    if (category._id === updatedSubCategory.subCategory.category) {
                        return {
                            ...category,
                            subcategories: category.subcategories.map((sub) =>
                                sub._id === updatedSubCategory.subCategory._id ? updatedSubCategory.subCategory : sub
                            ),
                        };
                    }
                    return category;
                })
            );
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    return (
        <div className="p-8">
            {/* Popup Overlay To Add Category*/}
            {addPopup && (
                <AddCategory categories={categories} setCategories={setCategories} setIsPopupOpen={setAddPopup} />
            )}
            <div className='flex justify-between'>
                <h1 className="text-2xl font-semibold mb-2 font-nunito">Category Management</h1>
                <IsAdmin>
                    <button
                        type="submit"
                        className=" bg-green_700 text-white font-semibold py-2 px-4 mb-2 rounded-2xl hover:bg-green_800 focus:outline-none focus:ring-2 focus:ring-green_500 focus:ring-opacity-50"
                        onClick={() => setAddPopup(true)}
                    >
                        Add New Category
                    </button>
                </IsAdmin>
            </div>
            <hr className='mb-5' />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-gray-200 rounded-lg font-nunito">
                    <TableHeader headerContent={["CATEGORY", "DESCRIPTION", "SUB CATEGORY", "ACTIONS"]} />
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
                                                    <div className='flex gap-2 items-center mb-2' key={index}>
                                                        <p key={index} >{subCategory.name}</p>
                                                    </div>

                                                ))
                                            }
                                        </td>

                                        <td className="px-6 gap-2 py-4 border-b font-nunito text-sm">
                                            {role === "admin" &&
                                                category.subcategories.map((subCategory, index) => (
                                                    <div key={index} className='flex gap-2 items-center mb-2 cursor-pointer' >
                                                        <div
                                                            onClick={() => changeCategoryStatus(subCategory._id)}
                                                            className={`${subCategory.isActive
                                                                ? 'bg-status_succes_background_green text-status_succes_text_green '
                                                                : 'bg-status_failed_text_red text-status_failed_background_red '
                                                                } rounded-md py-1 text-xs text-center pl-2 min-w-[70px]`}
                                                        >
                                                            {
                                                                subCategory.isActive
                                                                    ? <div className='flex items-center gap-2'><TbLock />Lock</div>
                                                                    : <div className='flex items-center gap-1'><TbLockOpen />Unlock</div>

                                                            }

                                                        </div>
                                                        <span
                                                            className="bg-green_200 text-green_900 rounded-md py-1.5 flex items-center text-xs text-center px-2"
                                                            onClick={() => openModal({ category, id: category._id }, { subCategory, id: subCategory._id })}
                                                        >
                                                            <FiEdit3 />
                                                        </span>
                                                    </div>

                                                ))
                                            }
                                        </td>
                                    </tr>
                                )) : (
                                    <NoRecords />
                                )
                        }
                    </tbody>
                </table>
                {editPopup && (
                    <UpdateCategory
                        category={selectedCategory.category.name}
                        categoryId={selectedCategory.id}
                        subCategory={selectedSubCategory.subCategory.name}
                        subCategoryId={selectedSubCategory.id}
                        setCategories={setCategories}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div >
    );
};

export default ListingCategory;


