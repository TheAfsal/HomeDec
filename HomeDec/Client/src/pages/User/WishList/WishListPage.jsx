import React, { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import WishlistItem from './components/WishListItem';
import { findWishListItem } from '../../../api/user/account';

const WishListPage = () => {

    const [wishlistItems, setWishlistItems] = useState([])

    useEffect(() => {
        const fetchWishListItems = async () => {
            try {
                const items = await findWishListItem()
                console.log("items", items);
                setWishlistItems(items)

            } catch (error) {
                console.log(error.message);
            }
        }

        fetchWishListItems()
    }, [])





    return (
        <div className="p-6 min-h-screen font-nunito">
            {/* Wishlist Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Wishlist</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Wishlist</button>
            </div>

            {/* Wishlist offers section */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Interesting Offers</h2>
            </div>
            <hr />

            {/* Wishlist grid items */}
            <div className="flex flex-wrap gap-5 mt-5">
                {wishlistItems.map((item, index) => (
                    <WishlistItem
                        key={index}
                        imageUrl={item.image}
                        name={item.title}
                        price={item.price}
                        oldPrice={item.price}
                        rating={item.rating}
                        reviews={item.reviews}
                        discount={item.discount}
                    />
                ))}
            </div>
        </div>
    );
};

export default WishListPage;
