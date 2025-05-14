import React, { createContext, useContext, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSelector } from 'react-redux';
import CartItem from '@/pages/User/Cart/components/CartItem';

const MiniCartContext = createContext();

export const MiniCartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [miniCartOpen, setMiniCartOpen] = useState(false);

    const addItemToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    const removeItemFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    const toggleMiniCart = () => {
        setMiniCartOpen((prev) => !prev);
    };

    return (
        <MiniCartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, toggleMiniCart }}>
            {children}
            <Sheet open={miniCartOpen} onOpenChange={setMiniCartOpen}>
                <SheetContent className="w-full h-full sm:w-96 bg-white rounded-lg p-8 shadow-lg max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-500">Your cart is empty</p>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <CartItem key={item.id} item={item} removeItem={removeItemFromCart} />
                            ))}
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button className="bg-green-500 text-white p-2 rounded-md" onClick={toggleMiniCart}>
                            Close
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </MiniCartContext.Provider>
    );
};

// Custom hook to use MiniCartContext
export const useMiniCart = () => {
    return useContext(MiniCartContext);
};
