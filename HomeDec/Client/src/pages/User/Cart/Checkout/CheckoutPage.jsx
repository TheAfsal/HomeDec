import { useEffect, useState } from 'react';
import DeliveryInfoPage from './DeliveryInfoPage';
import ShippingPage from './ShippingPage';
import Payment from './Payment';
import { addTransactionId, fetchMyAddresses, updateOrder } from '../../../../api/user/account';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../../../redux/slices/cartSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularLoader from '../../../../components/Loading/CircularLoader';
import { USER_ROUTES } from '../../../../config/routerConstants';

const CheckoutPage = () => {
  // State to track the current step

  const { orderId } = useParams()

  const [currentStep, setCurrentStep] = useState(1);
  const [postcode, setPostcode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [addressList, setAddressList] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const fetchAllAdresses = async () => {
      const items = await fetchMyAddresses()
      setAddressList(items.addresses);
      console.log(items.addresses);
      setShippingAddress(items.addresses[0]);

    }
    fetchAllAdresses()
  }, [])

  useEffect(() => {
    loadRazorpayScript().catch((error) => {
      console.error("Failed to load Razorpay script:", error);
    });
  }, []);



  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePostcodeSubmit = () => {
    setDeliveryDate('Monday, 13 | 12:00 - 16:00');
    handleNextStep();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('razorpay-script');

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.id = 'razorpay-script';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve();
        };
        script.onerror = () => reject(new Error('Razorpay SDK failed to load.'));
        document.body.appendChild(script);
      } else {
        setRazorpayLoaded(true);
        resolve();
      }
    });
  };



  const placeOrder = async () => {
    try {
      setLoading(true)
      const details = await updateOrder(orderId, paymentMethod, shippingAddress)
      console.log(details);

      if (details.orderDetails.paymentMethod === "online") {
        const options = {
          key: "rzp_test_ypLt4fdr4eU9W1",
          // amount: 20000,
          currency: "INR",
          name: "Your Company Name",
          order_id: details.orderDetails.orderId.id,
          handler: async function (response) {
            console.log("123123");
            try {
              await addTransactionId(true, orderId, response.razorpay_payment_id)
              dispatch(clearCart())
              navigate(`/${USER_ROUTES.PAYMENT_SUCCESS}`)


            } catch (error) {
              console.log("transaction id storing failed");

            }
          },
          prefill: {
            name: "Your Name",
            email: "youremail@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#3399cc"
          }
        };

        try {
          const razorpay = new window.Razorpay(options);
          razorpay.on('payment.failed', async function (response) {
            console.log("321321");
            console.log(response);
            await addTransactionId(false, orderId, response.razorpay_payment_id)
            dispatch(clearCart())
            navigate(`/${USER_ROUTES.SHOP}`)
            alert(`Payment failed`);

          });
          razorpay.open();

        } catch (error) {
          console.log(error);

        }

      } else if (details.orderDetails.paymentMethod === "wallet") {
        dispatch(clearCart())
        navigate(`/${USER_ROUTES.PAYMENT_SUCCESS}`)
      } else if (details.orderDetails.paymentMethod === "cod") {
        dispatch(clearCart())
        navigate(`/${USER_ROUTES.PAYMENT_SUCCESS}`)
      } else {
        setLoading(false)
        throw new Error("processing failed")
      }

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.message)
    }
    // console.log(paymentMethod);
    // console.log(shippingAddress);
  };

  if (loading) return (<CircularLoader />)

  return (
    <>
      <div className="max-w-5xl mx-auto mt-20 min-h-[60vh]">
        <ToastContainer />
        {/* Step 1: Delivery Information */}
        <h2 className="text-xl font-bold">Delivery Information</h2>
        {currentStep === 1 && (
          <DeliveryInfoPage postcode={postcode} setPostcode={setPostcode} handlePostcodeSubmit={handlePostcodeSubmit} />
        )}

        {/* Step 2: Shipping Address */}
        <h2 className="text-xl font-bold">Shipping Address</h2>
        {currentStep === 2 && (
          <ShippingPage addressList={addressList} postcode={postcode} deliveryDate={deliveryDate} setCurrentStep={setCurrentStep} shippingAddress={shippingAddress} setShippingAddress={setShippingAddress} handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />
        )}

        {/* Step 3: Payment */}
        <h2 className="text-xl font-bold">Payment</h2>
        {currentStep === 3 && (
          <Payment setCurrentStep={setCurrentStep} handlePreviousStep={handlePreviousStep} placeOrder={placeOrder} setPaymentMethod={setPaymentMethod} />
        )}
      </div>
    </>
  );
};

export default CheckoutPage;
