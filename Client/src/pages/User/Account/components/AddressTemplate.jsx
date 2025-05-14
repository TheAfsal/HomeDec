import React, { useState } from 'react'
import CountryStateDistrictDropdown from './CountryStateDistrictDropdown';

const AddressTemplate = ({ address, onSave, onCancel,error }) => {
    const [editedAddress, setEditedAddress] = useState(address);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedAddress({
            ...editedAddress,
            [name]: value,
        });
    };

    const handleSave = () => {
        onSave(editedAddress);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Label</label>
                <input
                    type="text"
                    name="label"
                    value={editedAddress.label}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                    type="text"
                    name="city"
                    value={editedAddress.city}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input
                    type="text"
                    name="street"
                    value={editedAddress.street}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="number"
                    name="mob"
                    value={editedAddress.mob}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <CountryStateDistrictDropdown editedAddress={editedAddress} setEditedAddress={setEditedAddress} handleChange={handleChange} />
            {error && <p className='text-red-500 text-xs'>{error}</p>}
            <div className="flex space-x-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddressTemplate
