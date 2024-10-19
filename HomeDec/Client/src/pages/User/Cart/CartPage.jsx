import React, { useEffect } from 'react';
import CartItem from './components/CartItem';
import TableHeader from '../../../components/Table/TableHeader';
import OrderSummary from './components/OrderSummary';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartsItems } from '../../../redux/slices/cartSlice';
import { fetchMyCart } from '../../../api/administrator/cartManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { USER_ROUTES } from '../../../config/routerConstants';

const CartPage = () => {

    const dispatch = useDispatch();
    const { isDataFetched, cartProducts } = useSelector((state) => state.cart);

    useEffect(() => {
        const fetchCartData = async () => {
            console.log(isDataFetched);

            // if (!isDataFetched) {
            try {
                const savedCart = await fetchMyCart()
                dispatch(fetchCartsItems(savedCart));

            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
            // }
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


    return (
        <div className="max-w-7xl mx-auto p-4 mt-20 font-nunito">
            <ToastContainer />
            {/* Breadcrumbs */}
            <div>
                <nav className="text-sm text-gray-500 mb-4">
                    <Link to={`${USER_ROUTES.HOME}`} >Home</Link> / <Link to={`/${USER_ROUTES.SHOP}`} >Shop</Link> / <span className="text-gray-800">Cart</span>
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

                    <OrderSummary cartItems={cartProducts} pushToast={pushToast} />

                </div>

                <div className="col-span-8">
                    <Link to={`/${USER_ROUTES.SHOP}`} className="text-blue-600 text-sm">←  Continue shopping</Link >
                </div>
            </div>

        </div>
    );
};

export default CartPage;
