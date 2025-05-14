import React, { useEffect, useState } from 'react'
import AddressTemplate from '../../Account/components/AddressTemplate'
import CountryStateDistrictDropdown from '../../Account/components/CountryStateDistrictDropdown';
import Addresses from '../../Account/Address';

const ShippingPage = ({ addressList, postcode, deliveryDate, setCurrentStep, shippingAddress, setShippingAddress, handleNextStep, handlePreviousStep }) => {

    const [newAddress, setNewAddress] = useState(false);

    const addressConfirm = (address) => {
        setShippingAddress(address);
        setNewAddress(false)
        handleNextStep()
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress({
            ...shippingAddress,
            [name]: value,
        });
    };

    return (
        <div className="space-y-4 font-nunito">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <p>Postcode: {postcode}</p>
                    <p>Estimated delivery date: {deliveryDate}</p>
                </div>
                <button
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 underline"
                >
                    Edit
                </button>
            </div>

            <div className='flex gap-3'>
                {
                    addressList.map((address, index) => (
                        <div key={index} className={`p-3 rounded-md cursor-pointer ${shippingAddress?.label === address?.label ? "border-2 border-blue-500" : "border-2"}`}
                            onClick={() => addressConfirm(address)}>
                            <p className="font-semibold text-sm">{address?.label} {address?.isPrimary && <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Primary</span>}</p>
                            <p className="text-gray-500 text-xs">{address?.city}, {address?.district}, {address?.state}, {address?.country}</p>
                            <p className="text-gray-500 text-xs">{address?.street}</p>
                        </div>
                    ))
                }
            </div>

            {
                !newAddress ? (
                    <div onClick={() => { setNewAddress(true); setShippingAddress() }} className='text-blue-500 underline' >Add new address</div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Label</label>
                                <input
                                    type="text"
                                    name="label"
                                    value={shippingAddress?.label}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, label: e.target.value })}
                                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shippingAddress?.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={shippingAddress?.street}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <CountryStateDistrictDropdown editedAddress={shippingAddress} setEditedAddress={setShippingAddress} handleChange={handleChange} />
                            {/* {error && <p className='text-red-500 text-xs'>{error}</p>} */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleNextStep}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    // onClick={onCancel}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        {/* <div className="space-y-2">
                            <h3>Primary Address</h3>
                            <input
                                type="text"
                                value={shippingAddress?.primary}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, primary: e.target.value })
                                }
                                placeholder="Primary Address"
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <h3>Alternative Address</h3>
                            <input
                                type="text"
                                value={shippingAddress?.alternative}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        alternative: e.target.value,
                                    })
                                }
                                placeholder="Alternative Address"
                                className="border border-gray-300 p-2 rounded w-full"
                            />
                        </div>
                        <button
                            onClick={handleNextStep}
                            className="bg-green-600 text-white p-2 rounded mt-4"
                        >
                            Continue
                        </button>
                        <button
                            onClick={handlePreviousStep}
                            className="text-gray-600 p-2 rounded mt-4"
                        >
                            Back
                        </button> */}
                    </>
                )
            }
            <button
                onClick={handlePreviousStep}
                className="text-gray-600 p-2 rounded mt-4"
            >
                Back
            </button>

        </div>
    )
}

export default ShippingPage
