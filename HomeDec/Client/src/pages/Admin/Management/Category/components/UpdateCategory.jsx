import React, { useState } from 'react'
import { updateCategoryAndSubCategory } from '../../../../../api/administrator/categoryManagement';

const UpdateCategory = ({ category, categoryId, subCategory, subCategoryId, setCategories, onClose }) => {
    const [categoryName, setCategoryName] = useState(category);
    const [subCategoryName, setSubCategoryName] = useState(subCategory);
    const [error, setError] = useState('');


    const handleSave = async () => {
        try {
            if (!categoryName.trim() || !subCategoryName.trim()) {
                setError('Category name and subcategory name are required.');
                return;
            }

            // Optionally, you could add more validations, e.g., character limits
            if (categoryName.trim().length < 3 || subCategoryName.trim().length < 3) {
                setError('Names must be at least 3 characters long.');
                return;
            }

            // Call your API to update the category and subcategory
            const { message, updatedCategory, updatedSubcategory } = await updateCategoryAndSubCategory({ categoryName, categoryId, subCategoryName, subCategoryId });
            console.log(message, updatedCategory, updatedSubcategory);

            setCategories((prevCategories) =>
                prevCategories.map((category) => {
                    if (category._id === updatedCategory._id) {
                        return {
                            ...category,
                            name: updatedCategory.name,
                            description: updatedCategory.description,
                            subcategories: category.subcategories.map((sub) =>
                                sub._id === updatedSubcategory._id ? { ...sub, name: updatedSubcategory.name } : sub
                            ),
                        };
                    }
                    return category;
                })
            );
            onClose();

        } catch (error) {
            setError('Error updating category and subcategory:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                <h2 className="text-xl font-bold">Edit Subcategory</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Subcategory Name</label>
                    <input
                        type="text"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateCategory
