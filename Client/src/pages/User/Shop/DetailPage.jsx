import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { FaRegHeart, FaStar } from "react-icons/fa";
import CustomImageMagnifier from '../../Admin/Management/Product/CustomZoom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../../redux/slices/cartSlice';
import { updateCartCount } from '../../../api/administrator/cartManagement';
import { fetchDetails } from '../../../api/administrator/productManagement';
import 'react-toastify/dist/ReactToastify.css';
import { USER_ROUTES } from '../../../config/routerConstants';
import { addToWishList } from '../../../api/user/account';
import OfferPriceDisplay from '../../../utils/calculateOfferPrice.jsx';
import CircularLoader from '../../../components/Loading/CircularLoader.jsx';
import { toast } from "sonner"

const DetailPage = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [bestOffer, setBestOffer] = useState("");
  const [selectedVariant, setSelectedVariant] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [isExpanded, setIsExpanded] = useState({
    productInfo: false,
    features: false,
    warrantyInfo: false,
    deliveryShipping: false,
  });
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { role } = useSelector(state => state.auth)

  const { isPending, error, data } = useQuery({
    queryKey: ['productData'],
    queryFn: () => fetchDetails(productId)
      .then((list) => {
        setSelectedVariant(list.product.variants[0]);
        setSelectedImage(list.product.variants[0].images[0])
        setProduct(list.product);
        setBestOffer(list.bestOffer);
      })
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const list = await fetchDetails(productId)
        setSelectedVariant(list.product.variants[0]);
        setSelectedImage(list.product.variants[0].images[0])
        setProduct(list.product);
        setBestOffer(list.bestOffer);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductDetails();
  }, [])

  const updateQuantity = async () => {

    if (quantity > 10) return toast.error("Maximum quantity for purchase exceeded")

    console.log(!role);
    if (!(role === "user")) {
      console.log("Not logged In");
      return;
    }

    if (quantity > selectedVariant.stock) {
      setQuantity(1)
      return toast.error(`Only ${selectedVariant.stock} Stock left`)
    }

    try {


      await updateCartCount(productId, selectedVariant._id, quantity)



      dispatch(clearCart())
      setQuantity(1)

      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: "Saving changes...",
          success: "Changes saved successfully",
          error: "Failed to save changes",
        }
      )
    } catch (error) {
      toast.error("Failed to save changes", {
        description: "Please try again later.",
      })
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

  const pushToWishList = async (title) => {
    try {
      await addToWishList(product._id, selectedVariant._id)
      toast.success("Item added successfully", {
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast.error("Failed to save changes", {
        description: error.message,
      })
    }
  }

  if (loading) return <CircularLoader />

  return (
    <div className='max-w-[87vw] mx-auto mt-20'>
      <div className="flex justify-between font-nunito mt-14 h-[90vh] ">
        <div className="flex flex-col w-1/2 justify-between">

          <div className='flex flex-col gap-y-5 text-green_700'>
            <Link to={`/${USER_ROUTES.SHOP}`}>
              <IoIosArrowRoundBack size={30} color='' />
            </Link>

            {/* Breadcrumb */}
            <p className="text-gray-500 text-sm">
              <Link to={`/${USER_ROUTES.SHOP}`}>
                <span className="hover:underline cursor-pointer text-green_700">{product?.subCategory?.name} </span>
              </Link>
              / {product.title}
            </p>
          </div>

          <h1 className="text-4xl font-bold">{product.title}</h1>

          <div>
            <OfferPriceDisplay productPrice={selectedVariant.price} offerDetails={bestOffer} />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <FaStar key={index} />
              ))}
            </div>
            <p className="text-gray-500 text-sm">(4.6 / 5.0 - 556 reviews)</p>
          </div>

          <p className=" text-sm font-semibold max-w-96">
            {product.description}
          </p>

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
          <div className="text-gray-600 space-y-2">
            <p className='text-sm'>Free 3-5 day shipping • Tool-free assembly • 30-day trial</p>
            <div className="flex items-center space-x-2 text-md">
              <button className="flex items-center text-green_500 my-2 hover:text-green_700" onClick={() => pushToWishList(product?.title)} >
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
            {selectedVariant.images.map((url, index) => (
              <img
                key={index}
                src={url.secure_url}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover border-2 ${selectedImage.secure_url === url.secure_url ? "border-green_500" : "border-gray-200"}`}
                onMouseEnter={() => setSelectedImage(url)}
                onClick={() => setSelectedImage(url)}
              />
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






