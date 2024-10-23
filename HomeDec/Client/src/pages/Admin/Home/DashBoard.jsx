import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { findTop10, generateSalesReport } from '@/api/administrator/salesManagement'
import SalesGraph from './Components/SalesGraph'
import UserGraph from './Components/UserGraph'
import IsAdmin from '@/components/Admin/IsAdmin'


const DashBoard = () => {

    const [salesData, setSalesData] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [topSellingCategory, setTopSellingCategory] = useState([]);
    const [topSellingSubCategory, setTopSellingSubCategory] = useState([]);
    const { role } = useSelector((state) => state.auth)

    useEffect(() => {
        Promise.allSettled([findTop10(role), generateSalesReport(role, "yearly", undefined, undefined)])
            .then((response) => {
                console.log(response);

                setSalesData(response[1].value.reverse());
                setTopSellingProducts(response[0].value.topSellingProducts);
                setTopSellingCategory(response[0].value.topSellingCategories);
                setTopSellingSubCategory(response[0].value.topSellingSubCategories);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }, [])


    return (
        <>
            <div className='flex gap-4 justify-between'>
                <SalesGraph salesData={salesData} setSalesData={setSalesData} role={role} />
                <UserGraph role={role} />
            </div>
            <IsAdmin>
                <div className="m-3 mt-10">
                    <h2 className="text-3xl font-semibold text-leftx mb-6">Top Selling Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {topSellingProducts.map(product => (
                            <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
                                <img src={product.image[0]} alt={product.productName} className="w-full h-48 object-cover rounded-lg mb-4" />
                                <h3 className="text-lg font-medium text-gray-700">{product.productName}</h3>
                                <p className="text-gray-500">Quantity Sold: {product.totalQuantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="m-3 mt-10">
                    <h2 className="text-3xl font-semibold text-leftx mb-6">Top Selling Category</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {topSellingCategory.map(category => (
                            <div key={category._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
                                <h3 className="text-lg font-medium text-gray-700">{category.categoryName}</h3>
                                <p className="text-gray-500">Quantity Sold: {category.totalQuantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="m-3 mt-10">
                    <h2 className="text-3xl font-semibold text-leftx mb-6">Top Selling Sub Category</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {topSellingSubCategory.map(subCategory => (
                            <div key={subCategory.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
                                <h3 className="text-lg font-medium text-gray-700">{subCategory.subCategoryName}</h3>
                                <p className="text-gray-500">Quantity Sold: {subCategory.totalQuantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </IsAdmin>

        </>
    )
}

export default DashBoard









