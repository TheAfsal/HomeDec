import React, { useState } from 'react';

const FilterBar = ({ categories, setSelectedFilter }) => {
    // Define state for each filter option
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    // const [priceRange, setPriceRange] = useState([40, 150]);
    // const [selectedBrands, setSelectedBrands] = useState([]);
    // const [selectedSizes, setSelectedSizes] = useState(['XXS']);
    // const [selectedColors, setSelectedColors] = useState([]);
    // const [statusFilters, setStatusFilters] = useState({
    //     inStock: true,
    //     isSale: true,
    //     freeDelivery: false,
    // });

    const toggleCategory = (e) => {

        const category = e.target.value


        let tempCategories
        if (selectedCategories.includes(category)) {
            tempCategories = selectedCategories.filter((cat) => cat !== category)
        } else {
            tempCategories = [...selectedCategories, category];
        }
        setSelectedCategories(tempCategories)
        setSelectedFilter({ option: "category", value: tempCategories })
    };

    // const toggleSubCategory = (subCategory) => {
    //     if (selectedSubCategories.includes(subCategory)) {
    //         setSelectedSubCategories(selectedSubCategories.filter((cat) => cat !== subCategory));
    //     } else {
    //         setSelectedSubCategories([...selectedSubCategories, subCategory]);
    //     }
    // };

    // const handlePriceChange = (event) => {
    //     const value = Number(event.target.value);
    //     setPriceRange([priceRange[0], value]);
    // };

    // const toggleBrand = (brand) => {
    //     if (selectedBrands.includes(brand)) {
    //         setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    //     } else {
    //         setSelectedBrands([...selectedBrands, brand]);
    //     }
    // };

    // const toggleSize = (size) => {
    //     if (selectedSizes.includes(size)) {
    //         setSelectedSizes(selectedSizes.filter((s) => s !== size));
    //     } else {
    //         setSelectedSizes([...selectedSizes, size]);
    //     }
    // };

    // const toggleColor = (color) => {
    //     if (selectedColors.includes(color)) {
    //         setSelectedColors(selectedColors.filter((c) => c !== color));
    //     } else {
    //         setSelectedColors([...selectedColors, color]);
    //     }
    // };

    // const toggleStatus = (status) => {
    //     setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
    // };

    return (
        <div className="p-4 bg-gray-100 rounded-lg w-[25vw]">
            {/* Categories */}
            <div className="mb-4">
                <h3 className="font-bold text-lg">Categories</h3>
                <hr className='my-2' />
                <div className='flex flex-col gap-1'>
                    {categories.map((category) => (
                        <div key={category._id}>
                            <label >
                                <input
                                    type="checkbox"
                                    value={category._id}
                                    onChange={toggleCategory}
                                    checked={selectedCategories.includes(category._id)}
                                />
                                <span className="ml-2">{category.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sub Categories */}
            {/* <div className="mb-4">
                <h3 className="font-bold text-lg">Sub Categories</h3>
                <hr className='my-2' />
                <div className='flex flex-col gap-1'>
                    {categories.map((category) => (
                        category.subcategories.map((subCategory) => (
                            <div key={subCategory._id}>
                                <label >
                                    <input
                                        type="checkbox"
                                        value={subCategory.name}
                                        onChange={() => toggleSubCategory(subCategory.name)}
                                        checked={selectedSubCategories.includes(subCategory.name)}
                                    />
                                    <span className="ml-2">{subCategory.name}</span>
                                </label>
                            </div>
                        ))
                    ))}
                </div>
            </div> */}

            {/* Price */}
            {/* <div className="mb-4">
                <h3 className="font-bold text-lg">Price</h3>
                <div>
                    <input
                        type="range"
                        min="40"
                        max="150"
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                        className="w-full"
                    />
                    <div className="flex justify-between">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
            </div> */}

            {/* Brands */}
            {/* <div className="mb-4">
                <h3 className="font-bold text-lg">Brand</h3>
                <div className="overflow-auto max-h-40">
                    {['Adidas', 'Ann Taylor', 'Armani', 'Banana Republic', 'Billabong', 'Birkenstock', 'Calvin Klein'].map((brand) => (
                        <div key={brand}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={brand}
                                    onChange={() => toggleBrand(brand)}
                                    checked={selectedBrands.includes(brand)}
                                />
                                <span className="ml-2">{brand}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Size */}
            {/* <div className="mb-4">
                <h3 className="font-bold text-lg">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '40', '42', '44', '45', '48', '50', '52'].map((size) => (
                        <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`p-2 border rounded ${selectedSizes.includes(size) ? 'bg-blue-500 text-white' : 'bg-white'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div> */}

            {/* Color */}
            {/* <div className="mb-4">
                <h3 className="font-bold text-lg">Color</h3>
                <div className="flex gap-4">
                    {['Green', 'Coral red', 'Pink', 'Sky blue', 'Black', 'White'].map((color) => (
                        <button
                            key={color}
                            onClick={() => toggleColor(color)}
                            className={`w-8 h-8 rounded-full ${selectedColors.includes(color) ? 'border-4 border-black' : ''
                                }`}
                            style={{ backgroundColor: color.toLowerCase() }}
                        />
                    ))}
                </div>
            </div> */}

            {/* Status */}
            {/* <div className="mb-4">
                <h3 className="font-bold text-lg">Status</h3>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={statusFilters.inStock}
                            onChange={() => toggleStatus('inStock')}
                        />
                        <span className="ml-2">In stock</span>
                    </label>
                    <label className="ml-4">
                        <input
                            type="checkbox"
                            checked={statusFilters.isSale}
                            onChange={() => toggleStatus('isSale')}
                        />
                        <span className="ml-2">Is Sale</span>
                    </label>
                    <label className="ml-4">
                        <input
                            type="checkbox"
                            checked={statusFilters.freeDelivery}
                            onChange={() => toggleStatus('freeDelivery')}
                        />
                        <span className="ml-2">Free Delivery</span>
                    </label>
                </div>
            </div> */}
        </div>
    );
};

export default FilterBar;
