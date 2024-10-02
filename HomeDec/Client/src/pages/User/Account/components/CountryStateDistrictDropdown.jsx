import React, { useEffect, useState } from 'react'

const CountryStateDistrictDropdown = ({ editedAddress, setEditedAddress, handleChange }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(editedAddress?.country || '');
    const [selectedState, setSelectedState] = useState(editedAddress?.state || '');
    const [selectedDistrict, setSelectedDistrict] = useState(editedAddress?.district || '');

    useEffect(() => {
        setCountries([
            { code: 'United States', name: 'United States' },
            { code: 'India', name: 'India' },
        ]);
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            if (selectedCountry === 'United States') {
                setStates([
                    { code: 'California', name: 'California' },
                    { code: 'Texas', name: 'Texas' },
                ]);
            } else if (selectedCountry === 'India') {
                setStates([
                    { code: 'Maharashtra', name: 'Maharashtra' },
                    { code: 'Delhi', name: 'Delhi' },
                ]);
            }
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            if (selectedState === 'California') {
                setDistricts([
                    { code: 'Los Angeles', name: 'Los Angeles' },
                    { code: 'San Francisco', name: 'San Francisco' },
                ]);
            } else if (selectedState === 'Texas') {
                setDistricts([
                    { code: 'Austin', name: 'Austin' },
                    { code: 'Dallas', name: 'Dallas' },
                ]);
            } else if (selectedState === 'Maharashtra') {
                setDistricts([
                    { code: 'Mumbai', name: 'Mumbai' },
                    { code: 'Pune', name: 'Pune' },
                ]);
            } else if (selectedState === 'Delhi') {
                setDistricts([
                    { code: 'New Delhi', name: 'New Delhi' },
                    { code: 'Gurgaon', name: 'Gurgaon' },
                ]);
            }
        } else {
            setDistricts([]);
        }
    }, [selectedState]);

    const handleCountryChange = (e) => {
        const value = e.target.value;
        setSelectedCountry(value);
        setSelectedState('');
        setSelectedDistrict('');
        setEditedAddress({ ...editedAddress, country: value, state: '', district: '' });
    };

    const handleStateChange = (e) => {
        const value = e.target.value;
        setSelectedState(value);
        setSelectedDistrict('');
        setEditedAddress({ ...editedAddress, state: value, district: '' });
    };

    const handleDistrictChange = (e) => {
        const value = e.target.value;
        setSelectedDistrict(value);
        setEditedAddress({ ...editedAddress, district: value });
    };

    return (
        <>
            <div className='flex w-full gap-6'>

                <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="mt-1 block w-full p-2 border rounded-lg"
                    >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <select
                        value={selectedState}
                        onChange={handleStateChange}
                        className="mt-1 block w-full p-2 border rounded-lg"
                        disabled={!selectedCountry}
                    >
                        <option value="">Select a state</option>
                        {states.map((state) => (
                            <option key={state.code} value={state.code}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='flex w-full gap-6'>
                <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">District</label>
                    <select
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        className="mt-1 block w-full p-2 border rounded-lg"
                        disabled={!selectedState}
                    >
                        <option value="">Select a district</option>
                        {districts.map((district) => (
                            <option key={district.code} value={district.code}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='w-1/2'>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={editedAddress?.postalCode}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>


        </>
    );
};

export default CountryStateDistrictDropdown
