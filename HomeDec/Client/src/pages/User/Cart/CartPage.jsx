import React, { useEffect } from 'react';
import CartItem from './components/CartItem';
import TableHeader from '../../../Components/Table/TableHeader';
import OrderSummary from './components/OrderSummary';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartsItems } from '../../../redux/slices/cartSlice';
import { fetchMyCart } from '../../../api/administrator/cartManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const CartPage = () => {

    const dispatch = useDispatch();
    const { isDataFetched, cartProducts } = useSelector((state) => state.cart);

    useEffect(() => {
        const fetchCartData = async () => {
            if (!isDataFetched) {
                try {
                    const savedCart = await fetchMyCart()
                    dispatch(fetchCartsItems(savedCart));

                } catch (error) {
                    console.error("Error fetching cart data:", error);
                }
            }
        };
        fetchCartData();

    }, [dispatch, isDataFetched]);

    useEffect(() => {
        console.log(cartProducts);

    }, [cartProducts])

    const pushToast = (status, message) => {
        if (status) toast.success(message)
        else toast.error(message)
    }

    // const handleClearCart = () => {
    //     dispatch(clearCart());
    //     // Optionally clear cart data from the database
    // }

    // Calculate totals
    const subtotal = cartProducts.reduce((acc, item) => acc + item.variantDetails.price * item.quantity, 0);
    const discount = 0;
    const tax = 0; // 7.5% tax
    // const total = subtotal - discount + tax;
    const total = subtotal;


    return (
        <div className="max-w-7xl mx-auto p-4 mt-20 font-nunito">
            <ToastContainer />
            {/* Breadcrumbs */}
            <div>
                <nav className="text-sm text-gray-500 mb-4">
                    <Link to={"/"} >Home</Link> / <Link to={"/shop"} >Shop</Link> / <span className="text-gray-800">Cart</span>
                </nav>
                <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
                <div className='w-full flex justify-between gap-3'>
                    {/* Shopping Cart Section */}
                    <div className="w-4/6 bg-white p-6 ">

                        <table className="w-full text-left">
                            <TableHeader headerContent={["Product", "Price", "Quantity", "Total", "Clear Cart"]} />
                            <tbody>
                                {cartProducts.map((item, index) => (
                                    <CartItem item={item} key={index} pushToast={pushToast} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <OrderSummary cartItems={cartProducts} subtotal={subtotal} discount={discount} tax={tax} total={total} pushToast={pushToast} />
                </div>
                <div className="col-span-8">
                    <Link to={"/shop"} className="text-blue-600 text-sm">←  Continue shopping</Link >
                </div>
            </div>


            {/* Trending Products Section */}
            {/* <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Trending Products</h2>
                <div className="flex space-x-4 overflow-x-auto">
                    <div className="bg-white shadow rounded-lg p-4 w-48">
                        <img src="/images/product1.png" alt="Product" className="w-full h-32 object-cover mb-2" />
                        <h3 className="text-sm font-semibold">Apple iPhone 14 128GB Blue</h3>
                        <p className="text-sm text-gray-500">$899.00</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default CartPage;
