import React from 'react'

const DeliveryInfoPage = ({ postcode, setPostcode, handlePostcodeSubmit }) => {
    return (
        <div className="space-y-4">
            <p>Add your postcode to see the delivery and collection options available in your area.</p>
            <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. H1 1AG"
                className="border border-gray-300 p-2 rounded w-full"
            />
            <button
                onClick={handlePostcodeSubmit}
                className="bg-green-600 text-white p-2 rounded mt-4"
            >
                Calculate cost and availability
            </button>
        </div>
    )
}

export default DeliveryInfoPage
