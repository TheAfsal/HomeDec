import { useEffect, useState } from 'react';
import DeliveryInfoPage from './DeliveryInfoPage';
import ShippingPage from './ShippingPage';
import Payment from './Payment';
import { fetchMyAddresses, updateOrder } from '../../../../api/user/account';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../../../redux/slices/cartSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularLoader from '../../../../Components/Loading/CircularLoader';

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

  useEffect(() => {
    const fetchAllAdresses = async () => {
      const items = await fetchMyAddresses()
      setAddressList(items.addresses);
      console.log(items.addresses);
      setShippingAddress(items.addresses[0]);

    }
    fetchAllAdresses()
  }, [])

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

  const placeOrder = async () => {
    try {
      setLoading(true)
      await updateOrder(orderId, paymentMethod, shippingAddress)
      dispatch(clearCart())
      navigate("/shop/cart/checkout/success")
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    console.log(paymentMethod);
    console.log(shippingAddress);
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
