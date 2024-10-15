import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { fetchSearchingProducts, ListAllProducts } from '../../../api/administrator/productManagement';
import { CgSortAz } from 'react-icons/cg';
import { USER_ROUTES } from '../../../config/routerConstants';
import OfferPriceDisplay from '../../../utils/calculateOfferPrice.jsx';
import FilterBar from './FilterBar.jsx';
import { listCategoryForUser } from '../../../api/administrator/categoryManagement.js';

const ShopPage = () => {

    const [products, setProducts] = useState([])
    const [searchedText, setSearchedText] = useState("")
    const [searchedProducts, setSearchedProducts] = useState([])
    const [selectedOption, setSelectedOption] = useState('sortBy');
    const [selectedFilter, setSelectedFilter] = useState({});
    const [filterSection, setFilterSection] = useState(false);
    const [categories, setCategories] = useState([])

    const options = [
        { value: 'sortBy', label: 'Sort By' },
        { value: 'aA_zZ', label: 'aA - zZ' },
        { value: 'zZ_aA', label: 'zZ - aA' },
        { value: 'popularity', label: 'Popularity' },
        { value: 'newArrivals', label: 'New Arrivals' },
        { value: 'rating', label: 'Average Ratings ' },
        { value: 'priceLowToHigh', label: 'Price: Low to High' },
        { value: 'priceHighToLow', label: 'Price: High to Low' },
    ];

    useEffect(() => {

        Promise.allSettled([ListAllProducts(), listCategoryForUser()])
            .then((response) => {
                console.log(response[0].value[0].title);
                console.log(response[0].value[0].bestOffer);
                console.log(response[0].value[6].title);
                console.log(response[0].value[6].bestOffer);

                setProducts(response[0].value);
                setCategories(response[1].value);

            }).catch((error) => {
                console.error('Error fetching products:', error.message);
            })

        // ListAllProducts()
        //     .then((list) => {
        //         setProducts(list);

        //     }).catch((error) => {
        //         console.error('Error fetching products:', error.message);
        //     })

        // listCategory(role)
        //     .then((list) => {
        //         setCategories(list);
        //     }).catch((error) => {
        //         console.error('Error fetching categories:', error.message);
        //     })
        // const fetchProduct = async () => {
        //     try {
        //         const list = await ListAllProducts()
        //         console.log(list);
        //         setProducts(list);

        //     } catch (error) {
        //         console.error('Error fetching products:', error);
        //     }
        // };

        // fetchProduct();
    }, [])

    useEffect(() => {
        fetchSearchingProducts(searchedText, selectedOption, selectedFilter).then((searchedResults) => {
            // console.log(searchedResults);
            setSearchedText(searchedText)
            setSelectedOption(selectedOption === "sortBy" ? "" : selectedOption)
            setSearchedProducts(searchedResults);
        }).catch((error) => {
            console.log(error);
        })
    }, [selectedFilter])

    const searchProducts = async (e, filter = { value: [] }) => {
        try {
            setSearchedText(e.target.value)
            const searchedResults = await fetchSearchingProducts(e.target.value, selectedOption, filter)
            console.log(searchedResults);
            setSearchedProducts(searchedResults);
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
                    <button className="p-2 w-[130px] flex justify-center items-center ml-2 text-gray-600 bg-white duration-1000 hover:bg-gray-100" onClick={() => setFilterSection(!filterSection)} >
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
                        <span className="flex items-center text-white bg-gray-400 px-2 py-1 text-xs rounded-full h-5">{products.length}</span>
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
                <div className="flex w-full gap-8">
                    {
                        filterSection &&
                        <FilterBar categories={categories} setSelectedFilter={setSelectedFilter} />
                    }
                    <div className='w-full flex flex-wrap justify-center gap-8'>
                        {
                            searchedText || selectedOption !== 'sortBy' ?
                                searchedProducts.length ?
                                    searchedProducts.map((product, index) => (
                                        <Link to={`/${USER_ROUTES.SHOP}/${product._id}`} key={index}>
                                            <div className="relative bg-gray-50 break-words mb-7">
                                                {
                                                    (product?.offers !== null && product?.price >= product?.bestOffer?.minPurchaseAmount) &&
                                                    <span className="absolute top-2 left-2 flex items-center justify-center min-w-10 text-white bg-count_orange_background px-2 py-1 text-xs rounded-md h-5">{product?.bestOffer?.discountType === "percentage" ? (
                                                        `-${product?.bestOffer?.discountValue}%`
                                                    ) : (
                                                        `- ₹${product?.bestOffer?.discountValue}`
                                                    )}</span>
                                                }
                                                <img src={product?.image?.secure_url} alt={product?.title} className=" h-720 w-72 object-cover mb-4" />
                                                <div className='flex flex-col justify-between h-32'>

                                                    <h3 className="text-lg font-extrabold text-gray-900">{product?.title}</h3>
                                                    <p className="text-gray-400 font-medium text-sm max-w-64 line-clamp-2">{product?.description}</p>
                                                    {console.log(products)}
                                                    <OfferPriceDisplay productPrice={product?.price} offerDetails={product?.bestOffer} />
                                                </div>
                                            </div>
                                        </Link>
                                    )) : (
                                        <div className='w-full h-[30vh] items-center flex justify-center text-green_600'>No Products Found</div>
                                    )
                                :
                                products.length ?
                                    products.map((product, index) => (
                                        <Link to={`/${USER_ROUTES.SHOP}/${product._id}`} key={index} >
                                            <div className="relative bg-gray-50 break-words mb-7">
                                                {
                                                    (product?.offers !== null && product?.price >= product?.bestOffer?.minPurchaseAmount) &&
                                                    <span className="absolute top-2 left-2 flex items-center justify-center min-w-10 text-white bg-count_orange_background px-2 py-1 text-xs rounded-md h-5">{product?.bestOffer?.discountType === "percentage" ? (
                                                        `-${product?.bestOffer?.discountValue}%`
                                                    ) : (
                                                        `- ₹${product?.bestOffer?.discountValue}`
                                                    )}</span>
                                                }
                                                <img src={product?.image?.secure_url} alt={product?.title} className=" h-720 w-72 object-cover mb-4" />
                                                <div className='flex flex-col justify-between h-32'>
                                                    <h3 className="text-lg font-extrabold text-gray-900">{product?.title}</h3>
                                                    <p className="text-gray-400 font-medium text-sm max-w-64 line-clamp-2">
                                                        {product?.description}
                                                    </p>
                                                    <OfferPriceDisplay productPrice={product?.price} offerDetails={product?.bestOffer} />
                                                </div>
                                            </div>
                                        </Link>
                                    )) : (
                                        <div className='w-full h-[30vh] items-center flex justify-center text-green_600'>No Products Found</div>
                                    )
                        }
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ShopPage;
