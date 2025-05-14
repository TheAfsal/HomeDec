import React, { useEffect } from 'react';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartsItems } from '../../../redux/slices/cartSlice';
import { fetchMyCart } from '../../../api/administrator/cartManagement';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { USER_ROUTES } from '../../../config/routerConstants';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import emptyCartIcon from "@/assets/Images/empty-cart.png"
import { StoreIcon } from 'lucide-react';
import { toast } from "sonner"


const CartPage = () => {

    const dispatch = useDispatch();
    const { isDataFetched, cartProducts } = useSelector((state) => state.cart);

    useEffect(() => {
        fetchMyCart()
            .then((savedCart) => {
                dispatch(fetchCartsItems(savedCart));
            }).catch((error) => {
                console.error("Error fetching cart data:", error);
            })
    }, [dispatch, isDataFetched]);

    const pushToast = (status, message) => {
        if (status) toast.success(message, {
            description: "Your changes have been saved.",
        })
        else toast.error("Failed to save changes", {
            description: error,
        })
    }

    return (
        <div className="max-w-7xl mx-auto p-4 mt-20 font-nunito">
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink>
                                <Link to={`${USER_ROUTES.HOME}`} >Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>
                                <Link to={`/${USER_ROUTES.SHOP}`} >Shop</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <span className="text-gray-800">Cart</span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-2xl font-semibold my-4">Shopping Cart</h1>
                {
                    cartProducts.length
                        ? <div className='w-full flex justify-between gap-3'>

                            <div className="w-4/6 bg-white ">
                                {cartProducts.map((item, index) => (
                                    <CartItem item={item} key={index} pushToast={pushToast} />
                                ))}
                            </div>

                            <OrderSummary cartItems={cartProducts} pushToast={pushToast} />

                        </div>
                        :
                        <div className="flex justify-center items-center">
                            <div className="text-center p-8 rounded-lg max-w-sm mx-auto">
                                <img src={emptyCartIcon} className='h-52' alt="" />
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
                                <Link to={`/${USER_ROUTES.SHOP}`} className="flex justify-center items-center border-2 rounded-full gap-2 p-2 bg-green_500 text-white text-md font-medium hover:text-green_900">
                                    <StoreIcon size={20} />
                                    Continue shopping
                                </Link>
                            </div>
                        </div>
                }


            </div>


        </div>
    );
};

export default CartPage;
