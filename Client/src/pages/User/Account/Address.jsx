import React, { useEffect, useState } from 'react';
import AddressTemplate from './components/AddressTemplate';
import { addNewAddresses, fetchMyAddresses, removeAddress } from '../../../api/user/account';
import { MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Addresses component
const Addresses = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAddressesList = async () => {
      try {
        const addressList = await fetchMyAddresses()

        setAddresses(addressList.addresses);
      } catch (error) {


      }
    }
    fetchAddressesList()
  }, [])

  const handleEditClick = (id) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.id === id ? { ...address, isEditing: true } : address
      )
    );
  };

  const handleCancelEdit = (id) => {


    setAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.id === id ? { ...address, isEditing: false } : address
      )
    );
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this address?");
    if (confirmed) {
      try {
        const removedItem = await removeAddress(id)

        setAddresses((prev) => prev.filter(address => address._id !== removedItem));
        toast.success("Address deleted Successfully")

      } catch (error) {

        toast.error(error.message)
      }
    }
  };

  const handleSave = async (updatedAddress) => {

    const validateAddress = (address) => {
      const { label, street, city, state, postalCode, country, district } = address;

      if (!label || !street || !city || !state || !postalCode || !country || !district) {
        return { valid: false, message: "All fields are required." };
      }

      if (label.length < 2 || label.length > 50) {
        return { valid: false, message: "Label must be between 2 and 50 characters." };
      }
      if (street.length < 5 || street.length > 100) {
        return { valid: false, message: "Street must be between 5 and 100 characters." };
      }
      if (city.length < 2 || city.length > 50) {
        return { valid: false, message: "City must be between 2 and 50 characters." };
      }
      if (state.length < 2 || state.length > 50) {
        return { valid: false, message: "State must be between 2 and 50 characters." };
      }
      if (country.length < 2 || country.length > 50) {
        return { valid: false, message: "Country must be between 2 and 50 characters." };
      }

      // Validate postal code (example for Indian postal code)
      const postalCodePattern = /^\d{6}$/;
      if (!postalCodePattern.test(postalCode)) {
        return { valid: false, message: "Postal code must be a 6-digit number." };
      }

      return { valid: true };
    };

    // Perform validation
    const validationResult = validateAddress(updatedAddress);
    if (!validationResult.valid) {
      // console.error(validationResult.message);
      setError(validationResult.message); // Notify the user about validation failure
      return; // Exit early if validation fails
    } else {
      setError("");
    }


    try {
      const result = await addNewAddresses(updatedAddress)
      toast.success("Address added Successfully")

      setAddresses(result.addresses);
      // setAddresses((prevAddresses) =>
      //   prevAddresses.map((address) =>
      //     address.id === result._id
      //       ? { ...updatedAddress, isEditing: false }
      //       : address
      //   )
      // );

    } catch (error) {

      toast.error(error.message)
    }

  };

  const handleAddAddress = () => {
    const newAddress = {
      id: addresses.length + 1,
      label: '',
      mob: '',
      city: '',
      street: '',
      country: '',
      state: '',
      postalCode: '',
      district: '',
      isPrimary: false,
      isEditing: true,
    };
    setAddresses([...addresses, newAddress]);
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-6">Addresses</h1>
      <ToastContainer />
      <div className="space-y-6">
        {addresses.map((address, index) => (
          <div key={index} className="border-b pb-6">
            {address.isEditing ? (
              <AddressTemplate
                address={address}
                onSave={handleSave}
                onCancel={() => handleCancelEdit(address.id)}
                error={error}
              />
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  {/* && <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Primary</span>} */}
                  <p className="font-semibold">{address.label} {address.isPrimary}</p>
                  <p className="text-gray-500">{address.city}, {address.district}, {address.state}, {address.country}</p>
                  <p className="text-gray-500">{address.street}</p>
                  <p className="text-gray-500">{address.mob}</p>
                </div>
                <div className='flex gap-4'>
                  <button
                    onClick={() => handleEditClick(address._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-red-600 hover:underline"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleAddAddress}
          className="text-blue-600 hover:underline"
        >
          + Add address
        </button>
      </div>
    </div>
  );
};


export default Addresses;
