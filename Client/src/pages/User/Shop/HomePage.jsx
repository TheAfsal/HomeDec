import React, { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { fetchSearchingProducts, ListAllProducts } from '../../../api/administrator/productManagement';
import { CgSortAz } from 'react-icons/cg';
import { USER_ROUTES } from '../../../config/routerConstants';
import OfferPriceDisplay from '../../../utils/calculateOfferPrice.jsx';
import FilterBar from './FilterBar.jsx';
import { listCategoryForUser } from '../../../api/administrator/categoryManagement.js';
import { Button } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
const ProductList = React.lazy(() => import('./ProductList'));
import { generateSkeletons } from '@/utils/generateSkeletons';


const ShopPage = () => {

    const [searchedText, setSearchedText] = useState("")
    const [searchedProducts, setSearchedProducts] = useState([])
    const [selectedOption, setSelectedOption] = useState('sortBy');
    const [selectedFilter, setSelectedFilter] = useState({});
    const [filterSection, setFilterSection] = useState(false);
    const [categories, setCategories] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] = useState(5)

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




                setProducts(response[0].value);
                setCategories(response[1].value);


            }).catch((error) => {
                console.error('Error fetching products:', error.message);
            })
    }, [])

    useEffect(() => {
        fetchSearchingProducts(searchedText, selectedOption, selectedFilter).then((searchedResults) => {
            setSearchedText(searchedText)
            setSelectedOption(selectedOption === "sortBy" ? "" : selectedOption)
            setSearchedProducts(searchedResults);
        }).catch((error) => {

        })
    }, [selectedFilter])

    const searchProducts = async (e, filter = { value: [] }) => {
        try {
            setSearchedText(e.target.value)
            const searchedResults = await fetchSearchingProducts(e.target.value, selectedOption, filter)

            setSearchedProducts(searchedResults);
        } catch (error) {

        }
    }

    const handleChange = async (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        const searchedResults = await fetchSearchingProducts('', value)
        setSearchedProducts(searchedResults);
    };

    // Get current products
    // const indexOfLastProduct = currentPage * productsPerPage;
    // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    // const currentProducts = searchedText || selectedOption !== 'sortBy'
    //     ? searchedProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    //     : products.slice(indexOfFirstProduct, indexOfLastProduct);

    // // Change page
    // const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='bg-background_grey font-nunito mt-20'>
            <div className="mx-auto p-8 max-w-5xl">

                {/* <div className='flex'>
                    <div className="flex items-center justify-between w-full  px-3 bg-white shadow-lg">
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

                        <button className="px-4 py-2 ml-2 w-[120px] my-2 text-white bg-green_600 hover:bg-teal-700">
                            Find Now
                        </button>

                    </div>
                    <button className="p-2 w-[130px] flex justify-center items-center ml-2 text-gray-600 bg-white duration-1000 hover:bg-gray-100" onClick={() => setFilterSection(!filterSection)} >
                        <div className='flex gap-2 justify-center items-center '>
                            <FiFilter size={20} />
                            <span className='font-bold'>Filter</span>
                        </div>
                    </button>
                </div> */}

                {/* Products Header Section */}
                <div className='flex items-center justify-between gap-2'>
                    {/* <div className='flex items-center gap-3'>
                        <h2 className="text-3xl font-bold text-green_900 my-10">
                            {
                                searchedText ? "Search Results" : "Total Product"
                            }
                        </h2>
                        <span className="flex items-center text-white bg-gray-400 px-2 py-1 text-xs rounded-full h-5">{products.length}</span>
                    </div> */}
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
                            <Suspense fallback={generateSkeletons(9)}>
                                <ProductList />
                            </Suspense>
                        }
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {/* {
                !searchedText && (
                    <Pagination className="mt-8 pb-4">
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="cursor-pointer border-0 bg-transparent shadow-none"
                                    variant="outline"
                                >
                                    <PaginationPrevious />
                                </Button>
                            </PaginationItem>
                            {[...Array(Math.ceil((searchedText || selectedOption !== 'sortBy' ? searchedProducts.length : products.length) / productsPerPage))].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => paginate(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <Button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil((searchedText || selectedOption !== 'sortBy' ? searchedProducts.length : products.length) / productsPerPage)}
                                    className="cursor-pointer border-0 bg-transparent shadow-none"
                                    variant="outline"
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )
            } */}


        </div>

    );
};

export default ShopPage;
