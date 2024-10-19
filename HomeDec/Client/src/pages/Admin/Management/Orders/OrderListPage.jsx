import React, { useEffect, useState } from 'react';
import TableHeader from '../../../../components/Table/TableHeader';
import { useSelector } from 'react-redux';
import { ListAllOrders, ListMyOrders } from '../../../../api/administrator/orderManagement';
import OrderStatusModel from './components/OrderStatusModel';


const OrderListPage = () => {

  const [orderData, setOrderData] = useState([])
  const [expandStatus, setExpandStatus] = useState();
  const { role } = useSelector(state => state.auth);

  const openModal = (item) => setExpandStatus(item);

  const closeModal = () => setExpandStatus(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        var list
        if (role === "seller") {
          list = await ListMyOrders()
        } else {
          list = await ListAllOrders()
        }
        console.log(list);
        setOrderData(list);

      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg font-nunito ">
      <h2 className="text-2xl font-semibold mb-5">Order List</h2>

      <table className="table-auto w-full text-left">
        {
          role === "admin" ? (
            <TableHeader headerContent={["CUSTOMER NAME", "ADDRESS", "DATE", "PRODUCT", "QUANTITY", "PRICE", "STATUS", "TOTAL PRICE"]} />
          ) : (
            <TableHeader headerContent={["CUSTOMER NAME", "ADDRESS", "DATE", "PRODUCT", "VARIANT", "QUANTITY", "PRICE", "STATUS", "TOTAL PRICE"]} />
          )
        }
        <tbody className='text-sm'>
          {orderData.map((item, index) => (
            <tr key={index} className="border-b ">
              <td className="px-4 py-2 text-center">{item?.userId?.firstName || item?.firstName}</td>
              <td className="px-4 py-2 text-center max-w-36">{item?.street} {item?.city} {item?.state} {item?.country} {item?.postaCode}</td>
              <td className="px-4 py-2 text-center max-w-36">{item?.dateOrdered?.toString().split('T')[0]}</td>
              {
                role === "admin" ? (
                  <>

                    <td className="px-4 py-2 text-center max-w-36">
                      {
                        item?.orderItems.map((variant, index) => (
                          <div key={index} className='my-4'>{variant?.productId?.title}</div>
                        ))
                      }
                    </td>
                    <td className="px-4 py-2 text-center">
                      {
                        item?.orderItems.map((variant, index) => (
                          <div key={index} className='my-4'>{variant?.quantity}</div>
                        ))
                      }
                    </td>
                    <td className="px-4 py-2 text-center">
                      {
                        item?.orderItems.map((variant, index) => (
                          <div key={index} className='my-4'>{variant?.price}</div>
                        ))
                      }
                    </td>
                    <td className="px-4 py-2 ">
                      {
                        item?.orderItems.map((variant, index) => (
                          <div key={index} className={`px-2 py-1 text-center my-4 rounded-md text-xs ${variant?.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                            variant?.status === 'Processing' ? 'bg-violet-200 text-purple-800' :
                              variant?.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                                variant?.status === 'On Hold' ? 'bg-orange-200 text-orange-800' :
                                  variant?.status === 'Pending' ? ' border border-slate-700 text-red-800' :
                                    variant?.status === 'Returned' ? 'bg-orange-700 text-white' :
                                      'bg-blue-200 text-blue-800'
                            }`}>
                            {variant?.status}
                          </div>
                        ))
                      }
                    </td>
                    <td className="px-4 py-2 text-center">{item?.totalAmount}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 text-center max-w-36">
                      <div key={index} className='my-4'>{item?.productDetails?.title}</div>
                    </td>
                    <td className="px-4 py-2 text-center max-w-36">
                      <div key={index} className='my-4'>{item?.variantDetails?.color}</div>
                    </td><td className="px-4 py-2 text-center">
                      <div key={index} className='my-4'>{item?.orderItems?.quantity}</div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div key={index} className='my-4'>{item?.orderItems?.price}</div>
                    </td>
                    <td className="px-4 py-2 ">
                      <div key={index} className={`px-2 py-1 text-center cursor-pointer my-4 rounded-md text-xs ${item?.orderItems?.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                        item?.orderItems?.status === 'Processing' ? 'bg-violet-200 text-purple-800' :
                          item?.orderItems?.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                            item?.orderItems?.status === 'Pending' ? 'bg-red-200 text-red-800' :
                              item?.orderItems?.status === 'On Hold' ? 'bg-orange-200 text-orange-800' :
                                item?.orderItems?.status === 'Returned' ? 'bg-orange-700 text-white' :
                                  'bg-blue-200 text-blue-800'
                        }`}
                        onClick={() => openModal(item)}
                      >
                        {item?.orderItems?.status}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">{(item?.orderItems?.price) * (item?.orderItems?.quantity)}</td>
                  </>
                )
              }
            </tr>
          ))}
        </tbody>
      </table>
      {expandStatus && (
        <OrderStatusModel expandStatus={expandStatus} closeModal={closeModal} setOrderData={setOrderData} />
      )}

      {/* <div className="mt-4 flex justify-between items-center">
        <span>Showing 1-9 of 78</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md">◀</button>
          <button className="px-3 py-1 border rounded-md">▶</button>
        </div>
      </div> */}
    </div>


    // <div className="container mx-auto p-6">
    //   <h1 className="text-2xl font-bold mb-6">Order Lists</h1>

    //   <div className="flex space-x-2 mb-6">
    //     <div className="flex items-center space-x-2 border rounded-md p-2">
    //       {/* <Filter size={20} /> */}
    //       <span>Filter By</span>
    //     </div>
    //     <div className="flex items-center justify-between border rounded-md p-2 w-32">
    //       <span>Date</span>
    //       {/* <ChevronDown size={20} /> */}
    //     </div>
    //     <div className="flex items-center justify-between border rounded-md p-2 w-32">
    //       <span>Order Type</span>
    //       {/* <ChevronDown size={20} /> */}
    //     </div>
    //     <div className="flex items-center justify-between border rounded-md p-2 w-32">
    //       <span>Order Status</span>
    //       {/* <ChevronDown size={20} /> */}
    //     </div>
    //     <button className="flex items-center space-x-2 text-red-500">
    //       {/* <RotateCcw size={20} /> */}
    //       <span>Reset Filter</span>
    //     </button>
    //   </div>
    // </div>
  );
};

export default OrderListPage;