import React, { useEffect, useState } from 'react';
import WishlistItem from './components/WishListItem';
import { AddToCartFromWishList, findWishListItem, removeFromWishList } from '../../../api/user/account';
import { LuShoppingCart } from 'react-icons/lu';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { clearCart } from '../../../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import { USER_ROUTES } from '../../../config/routerConstants';
import { useNavigate } from 'react-router-dom';

const WishListPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [allSelected, setAllSelected] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        findWishListItem()
            .then((items) => {
                setWishlistItems(items);
            }).catch((error) => {

            })
    }, []);

    // Toggle selection for all items
    const handleSelectAll = () => {
        if (allSelected) {
            setCheckedItems({});
        } else {
            const newCheckedItems = {};
            wishlistItems.forEach((item) => {
                newCheckedItems[item.productId] = { variantId: item.variantId };
            });
            setCheckedItems(newCheckedItems);
        }
        setAllSelected(!allSelected);
    };

    // Toggle selection for individual item
    const handleCheckboxChange = (productId, variantId, isChecked) => {
        setCheckedItems((prev) => {
            const updatedCheckedItems = { ...prev };
            if (isChecked) {
                updatedCheckedItems[productId] = { variantId };
            } else {
                delete updatedCheckedItems[productId];
            }
            setAllSelected(Object.keys(updatedCheckedItems).length === wishlistItems.length);
            return updatedCheckedItems;
        });
    };

    // Handle adding selected items to cart
    const handleProductsToCart = async (productId, variantId, multipleProducts = true) => {
        let itemsToAdd;
        if (multipleProducts) {
            itemsToAdd = Object.keys(checkedItems).map((key) => ({
                productId: key,
                variantId: checkedItems[key].variantId,
                quantity: 1
            }));
        } else {
            itemsToAdd = [{ productId, variantId, quantity: 1 }]
        }

        await AddToCartFromWishList(itemsToAdd)
        dispatch(clearCart());

        // Remove items from wishlist and wishlistItems state
        setWishlistItems((prevItems) =>
            prevItems.filter((item) => !checkedItems[item.productId])
        );

        // Clear selected items
        setCheckedItems({});
        setAllSelected(false);
        navigate(`/${USER_ROUTES.CART}`)
    };

    // Handle removing selected items
    const handleRemoveItems = async () => {
        // Convert the itemsToRemove to ObjectId types for comparison
        const itemsToRemoveArray = Object.keys(checkedItems).map(
            (productId) => ({
                productId,
                variantId: checkedItems[productId].variantId,
            })
        );
        await removeFromWishList(itemsToRemoveArray);
        setWishlistItems((prevItems) =>
            prevItems.filter((item) => !checkedItems[item.productId])
        );
        setCheckedItems({});
        setAllSelected(false);
    };

    return (
        <div className="p-6 min-h-screen font-nunito">
            <h1 className="text-3xl font-bold mb-5">Wishlist</h1>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Interesting Offers</h2>
            </div>
            <hr />
            <div className="flex space-x-4 items-center font-light p-2 my-5 font-nunito text-sm gap-3">
                {/* Select All / Unselect All Checkbox */}
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="form-checkbox h-3 w-3 text-blue-600"
                    />
                    <span>{allSelected ? "Unselect all" : "Select all"}</span>
                </label>

                {/* Add to Cart Button */}
                <button
                    className="flex items-center space-x-2 hover:text-green_700 hover:font-medium"
                    onClick={handleProductsToCart}
                >
                    <LuShoppingCart className="w-4 h-4" />
                    <span>Add to cart</span>
                </button>

                {/* Remove Selected Button */}
                <button
                    className="flex items-center space-x-2 hover:text-errorRed hover:font-medium"
                    onClick={handleRemoveItems}
                >
                    <RiDeleteBin6Line className="w-4 h-4" />
                    <span>Remove selected</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-5 mt-5">
                {wishlistItems.map((item) => (
                    <WishlistItem
                        key={item.productId}
                        imageUrl={item.image}
                        name={item.title}
                        price={item.price}
                        oldPrice={item.price}
                        rating={item.rating}
                        reviews={item.reviews}
                        discount={item.discount}
                        productId={item.productId}
                        variantId={item.variantId}
                        isChecked={!!checkedItems[item.productId]}
                        onCheckboxChange={handleCheckboxChange}
                        handleProductsToCart={handleProductsToCart}
                    />
                ))}
            </div>
        </div>
    );
};

export default WishListPage;
