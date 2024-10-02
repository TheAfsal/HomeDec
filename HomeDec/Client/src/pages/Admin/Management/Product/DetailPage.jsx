import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { FaRegHeart, FaStar } from "react-icons/fa";
import CustomImageMagnifier from './CustomZoom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../../../redux/slices/cartSlice';
import { updateCartCount } from '../../../../api/administrator/cartManagement';
import { fetchDetails } from '../../../../api/administrator/productManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailPage = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [isExpanded, setIsExpanded] = useState({
    productInfo: false,
    features: false,
    warrantyInfo: false,
    deliveryShipping: false,
  });
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartProducts } = useSelector((state) => state.cart)

  const { productId } = useParams();

  useEffect(() => {
    console.log(cartProducts);

    const fetchProductDetails = async () => {
      try {
        const list = await fetchDetails(productId)
        setSelectedVariant(list[0].variants[0]);
        setSelectedImage(list[0].variants[0].images[0])
        setProduct(list[0]);
        setLoading(false)

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductDetails();
  }, [])

  const updateQuantity = async () => {

    if (quantity > 10) return toast.error("Maximum quantity for purchase exceeded")

    if (quantity > selectedVariant.stock) {
      setQuantity(1)
      return toast.error(`Only ${selectedVariant.stock} Stock left`)
    }

    try {
      const item = await updateCartCount(productId, selectedVariant._id, quantity)
      console.log(quantity);
      console.log(selectedVariant.stock);
      console.log(quantity > selectedVariant.stock);



      dispatch(addProductToCart(item))
      toast.success(`${quantity} items added to cart`);

      // Delay navigation to ensure the toast is visible
      setQuantity(1)
      setTimeout(() => {
        navigate("/shop/cart");
      }, 2000);


    } catch (error) {
      console.log(error);
      toast.error(error.message)
      setTimeout(() => {
        navigate("/shop/cart");
      }, 2000);
    }

  }

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "increment" ? prev + 1 : prev - 1));
  };

  const toggleExpand = (section) => {
    setIsExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (loading) return <div>Loading...</div>

  return (
    <div className='max-w-[87vw] mx-auto mt-20'>
      <ToastContainer />
      <div className="flex justify-between font-nunito mt-14 h-[90vh] ">
        {/* Left Section */}
        <div className="flex flex-col w-1/2 justify-between">

          <div className='flex flex-col gap-y-5 text-green_700'>
            {/* Back Button */}
            <Link to={"/shop"}>
              <IoIosArrowRoundBack size={30} color='' />
            </Link>

            {/* Breadcrumb */}
            <p className="text-gray-500 text-sm">
              <Link to={"/shop"}>
                <span className="hover:underline cursor-pointer text-green_700">Chair </span>
              </Link>
              / {product.title}
            </p>
          </div>

          {/* Title and Price */}
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold">${selectedVariant.price}</p>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <FaStar key={index} />
              ))}
            </div>
            <p className="text-gray-500 text-sm">(4.6 / 5.0 - 556 reviews)</p>
          </div>

          {/* Description */}
          <p className=" text-sm font-semibold max-w-96">
            {product.description}
          </p>


          {/* Color options */}
          <div className="flex space-x-3">
            {
              product.variants.map((variant, index) => (
                <div key={index} className={`${selectedVariant.colorHex == variant.colorHex ? "bg-slate-300" : ""} flex items-center justify-center rounded-full p-1`}>
                  <button onClick={() => { setSelectedVariant(variant); setSelectedImage(variant.images[0]) }} className={`${selectedVariant.colorHex == variant.colorHex ? "" : ""} w-6 h-6 rounded-full shadow-gray-500 `} style={{ backgroundColor: variant.colorHex }} ></button>
                </div>
              ))
            }
          </div>

          {
            (selectedVariant.stock < 10 && selectedVariant.stock !== 0) &&
            <div className='text-red-500 text-sm font-semibold'>
              Limited stocks left : {selectedVariant.stock}
            </div>
          }

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            {
              selectedVariant.stock >= 1 ?
                (
                  <div className="flex justify-around items-center space-x-2 border-2 rounded-md p-1 min-w-36 h-10 ">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      className="w-10 flex items-center justify-center hover:bg-background_grey rounded"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <p className="text-lg">{quantity}</p>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="w-10 flex items-center justify-center hover:bg-background_grey rounded"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <p className='font-bold text-xs text-red-500'>Out of Stock</p>
                )
            }

            <button className="p-2 min-w-36 h-10 bg-green_600 text-sm text-white rounded-md" onClick={updateQuantity} >
              Add to Cart
            </button>
          </div>

          {/* Additional information */}
          <div className="text-gray-600 text-sm space-y-2">
            <p>Free 3-5 day shipping • Tool-free assembly • 30-day trial</p>
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-green_600">
                <FaRegHeart className="mr-2" />
                Add to Wishlist
              </button>
              {/* Social icons */}
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <i className="fab fa-pinterest"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Images */}
        <div className=" w-1/2 ">
          <div className="min-w-5/6 min-h-[65vh] flex justify-center items-center ">
            <CustomImageMagnifier imageSrc={selectedImage.secure_url} />
          </div>



          <div className="flex gap-3 justify-start mt-3">
            {/* Thumbnail images */}
            {selectedVariant.images.map((url, index) => (
              <div key={index} className="w-20 h-20 border-2 border-gray-200" onClick={() => setSelectedImage(url)} >
                <img
                  src={url.secure_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>



      <div className='mt-10'>
        <div className="mb-8">
          <h3 className="text-md font-semibold">Product Specifications</h3>
          <hr className='my-2' />
          {
            product.itemProperties.map((property, index) => (
              <p key={index} className='text-xs my-2'><span className='font-bold'>{property.field}:</span> {property.value}</p>
            ))
          }
        </div>

        <div className="mb-6">
          <h3
            className="flex justify-between text-md font-semibold cursor-pointer"
            onClick={() => toggleExpand('productInfo')}
          >
            Warrenty Information
            <div>
              {isExpanded.productInfo ? '-' : '+'}
            </div>
          </h3>
          <hr className='my-2' />
          {isExpanded.productInfo && <p className="text-gray-700 text-xs">{product.warranty}</p>}
        </div>



        <div className="mt-8 ">
          <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
          {/* Map through reviews and display them */}
          <div className="border-t border-b py-4">
            <h4 className="font-normal text-xs">Rafael Marquez</h4>
            <p className="text-gray-600 text-xs">June 25, 2024</p>
            <div className="text-yellow-500">★★★★★</div>
            <p className="text-gray-700 mt-2 text-xs">Absolutely love this chair!</p>
          </div>
          {/* Add more reviews */}
        </div>
      </div>


    </div>
  );
};

export default DetailPage;






