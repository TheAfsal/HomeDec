import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { fetchSearchingProducts, ListAllProducts } from '../../../api/administrator/productManagement';
import { CgSortAz } from 'react-icons/cg';

const ShopPage = () => {

    const [products, setProducts] = useState([])
    const [searchedText, setSearchedText] = useState("")
    const [searchedProducts, setSearchedProducts] = useState([])
    const [selectedOption, setSelectedOption] = useState('sortBy');

    const options = [
        { value: 'sortBy', label: 'Sort By' },
        { value: 'popularity', label: 'Popularity' },
        { value: 'priceLowToHigh', label: 'Price: Low to High' },
        { value: 'priceHighToLow', label: 'Price: High to Low' },
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const list = await ListAllProducts()
                console.log(list);
                setProducts(list);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProduct();
    }, [])

    const searchProducts = async (e) => {
        try {
            setSearchedText(e.target.value)
            const searchedResults = await fetchSearchingProducts(e.target.value, selectedOption)
            setSearchedProducts(searchedResults);
            console.log(searchedResults);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = async (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        const searchedResults = await fetchSearchingProducts('', value)
        setSearchedProducts(searchedResults);

    };

    return (
        <div className='bg-background_grey font-nunito mt-20'>
            <div className="mx-auto p-8 max-w-5xl">
                {/* Category Section */}
                {/* <div className="flex justify-around mb-10">
                    {categories.map((category) => (
                        <div key={category.name} className="text-center">
                            <img src={category.icon} alt={category.name} className="w-12 h-12 mx-auto" />
                            <p className="text-sm text-gray-600 mt-2">{category.name}</p>
                        </div>
                    ))}
                </div> */}

                <div className='flex'>
                    {/* Search and Filter Section */}
                    <div className="flex items-center justify-between w-full  px-3 bg-white shadow-lg">
                        {/* Search Icon and Input */}
                        <div className="flex items-center w-full space-x-2">
                            <FiSearch className="text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search Furnitures"
                                value={searchedText}
                                onChange={searchProducts}
                                className="w-full px-2 py-2 text-gray-600 bg-transparent border-none outline-none"
                            />
                        </div>

                        {/* Find Now Button */}
                        <button className="px-4 py-2 ml-2 w-[120px] my-2 text-white bg-green_600 hover:bg-teal-700">
                            Find Now
                        </button>

                        {/* Filter Button */}
                    </div>
                    <button className="p-2 w-[130px] flex justify-center items-center ml-2 text-gray-600 bg-white  hover:bg-gray-100">
                        <div className='flex gap-2 justify-center items-center '>
                            <FiFilter size={20} />
                            <span className='font-bold'>Filter</span>

                        </div>
                    </button>
                </div>

                {/* Products Section */}
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-3'>
                        <h2 className="text-3xl font-bold text-green_900 my-10">
                            {
                                searchedText ? "Search Results" : "Total Product"
                            }
                        </h2>
                        <span className="flex items-center text-white bg-gray-400 px-2 py-1 text-xs rounded-full h-5">184</span>
                    </div>
                    <div className="relative inline-block text-left p-1">
                        <select
                            value={selectedOption}
                            onChange={handleChange}
                            className="border text-xs rounded pl-3 pr-7 py-2 appearance-none bg-white focus:outline-none"
                        >
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <CgSortAz size={20} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-8">
                    {
                        searchedText || selectedOption !== 'sortBy' ?
                            searchedProducts.length ?
                                searchedProducts.map((product, index) => (
                                    <Link to={`/shop/${product._id}`} key={index}>

                                        <div className="bg-gray-50 break-words">
                                            <img src={product.variants[0].images[0].secure_url} alt={product.name} className=" h-720 w-72 object-cover mb-4 " />
                                            {/* <p className="text-gray-400 font-bold text-sm">{product.category}</p> */}
                                            <h3 className="text-lg font-extrabold text-gray-900">{product.title}</h3>
                                            <p className="text-gray-400 font-medium text-sm max-w-64">{product.description}</p>
                                            <p className="font-bold text-green_900 mt-2">${product.variants[0].price}</p>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className='w-full h-[30vh] items-center flex justify-center text-green_600'>No Products Found</div>
                                )
                            :
                            products.length ?
                                products.map((product, index) => (
                                    <Link to={`/shop/${product._id}`} key={index}>

                                        <div className="bg-gray-50 break-words">
                                            <img src={product.variants[0].images[0].secure_url} alt={product.name} className=" h-720 w-72 object-cover mb-4 " />
                                            {/* <p className="text-gray-400 font-bold text-sm">{product.category}</p> */}
                                            <h3 className="text-lg font-extrabold text-gray-900">{product.title}</h3>
                                            <p className="text-gray-400 font-medium text-sm max-w-64">{product.description}</p>
                                            <p className="font-bold text-green_900 mt-2">${product.variants[0].price}</p>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className='w-full h-[30vh] items-center flex justify-center text-green_600'>No Products Found</div>
                                )
                    }
                </div>
            </div>

        </div>

    );
};

export default ShopPage;
