import React, { useState } from 'react';
import { addCategory } from '../../../../../api/administrator/categoryManagement';

const AddCategory = ({ categories, setCategories, setIsPopupOpen }) => {
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [description, setDescription] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const [error, setError] = useState('');

    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;
        setError('')
        if (selectedValue === 'add-new-category') {
            setIsAddingCategory(true);
        } else {
            setSelectedCategory(selectedValue);
            setIsAddingCategory(true);
            setNewCategory(e.target.value);
        }
    };

    const handleSubmit = async () => {
        // Validation

        if (!isAddingCategory || !newCategory.trim()) {
            setError('Category field is required.');
            return;
        }
        if (isAddingCategory && !newSubCategory.trim()) {
            setError('Sub category name is required.');
            return;
        }
        if (isAddingCategory && !description.trim()) {
            setError('Description is required.');
            return;
        }

        setError('');
        try {
            const response = await addCategory({ newCategory, description, newSubCategory });

            const categoryExists = categories.find(category => category.name === response.categoryName);



            if (categoryExists) {
                // Update the existing category
                const updatedCategories = categories.map(category =>
                    category.name === categoryExists.name
                        ? {
                            ...category,
                            description: response.description,
                            subcategories: [...category.subcategories, response.subCategoryName]
                        }
                        : category
                );


                setCategories(updatedCategories);
            } else {
                // Add a new category
                setCategories(prevCategories => [
                    ...prevCategories,
                    { name: response.categoryName, description: response.description, subcategories: [response.subCategoryName] }
                ]);
            }
            setNewCategory('');
            setNewSubCategory('');
            setIsPopupOpen(false);
        } catch (error) {


            setError(error.message)

        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div onClick={() => setIsPopupOpen(false)} className="absolute inset-0"></div>

            <div className="bg-white rounded-lg shadow-lg p-8 z-50 max-w-lg w-full">
                <div className='flex justify-between items-start'>
                    <h2 className="text-xl font-bold mt-2">Form Popup</h2>
                    <button
                        onClick={() => setIsPopupOpen(false)}
                        className="top-2 right-2 text-4xl text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                {error && <div className="mb-4 text-red-500">{error}</div>}

                <form>
                    {!isAddingCategory ? (
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
                                <option value="add-new-category">Add New Category</option>
                            </select>
                        </div>
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
                                    disabled={selectedCategory !== ""}
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
                            <div className="mb-4">
                                <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter Description"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                        </>
                    )}

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
    );
};

export default AddCategory;
