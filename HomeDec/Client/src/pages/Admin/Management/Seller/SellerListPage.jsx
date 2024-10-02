import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listSellers } from '../../../../api/administrator/sellerManagement';

const SellerListPage = () => {

    const [sellers, setSellers] = useState([])

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const list = await listSellers()
                console.log(list);
                setSellers(list);
                
            } catch (error) {
                console.error('Error fetching sellers:', error);
            }
        };

        fetchSellers();
    }, []);


    const handleSubmit = async () => {
    };




    return (
        <div className="p-8">
            <div className='flex justify-between'>
                <h1 className="text-2xl font-semibold mb-2 font-nunito">Sellers Management</h1>
                <Link to={"/admin/sellers/add"} >
                    <button
                        type="submit"
                        className=" bg-green_700 text-white font-semibold py-2 px-4 mb-2 rounded-2xl hover:bg-green_800 focus:outline-none focus:ring-2 focus:ring-green_500 focus:ring-opacity-50"
                    >
                        Add New Seller
                    </button>
                </Link>
            </div>
            <hr className='mb-5' />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg font-nunito">
                    <thead className='bg-table_header_grey'>
                        <tr >
                            <th className="py-3 border-b text-left pl-6 text-md">SELLER</th>
                            <th className="py-3 border-b text-left pl-6 text-md">EMAIL</th>
                            <th className="py-3 border-b text-left pl-6 text-md">PHONE</th>
                            <th className="py-3 border-b text-left pl-6 text-md">STATUS</th>
                            <th className="py-3 border-b text-left pl-6 text-md">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sellers.length ?
                                sellers.map((sellers, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{sellers?.sellerName}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{sellers?.email}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{sellers?.contactNumber}</td>
                                        <td className="px-6 py-4 border-b font-nunito ">
                                            <span
                                                className={`${sellers.isActive
                                                    ? 'bg-status_succes_background_green text-status_succes_text_green font-bold'
                                                    : 'bg-status_failed_text_red text-status_failed_background_red font-bold'
                                                    } rounded-md py-1 text-sm text-center inline-block min-w-[70px]`}
                                            >
                                                {sellers?.isActive ? "Active" : "Blocked"}
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
                                                    className={`${sellers.isActive
                                                        ? 'bg-green-500 hover:bg-green-600'
                                                        : 'bg-red-500 hover:bg-red-600'
                                                        } text-white p-2 rounded`}
                                                    onClick={() => 
                                                        (user?._id)}
                                                >
                                                    {sellers.isActive ? (
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

export default SellerListPage;
