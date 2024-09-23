import React, { useState } from 'react';

const DetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#5DA3A1');
  const [isExpanded, setIsExpanded] = useState({
    productInfo: false,
    features: false,
    warrantyInfo: false,
    deliveryShipping: false,
  });

  const toggleExpand = (section) => {
    setIsExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Meryl Lounge Chair</h1>
      <div className="flex items-center mb-4">
        <span className="text-2xl font-semibold">$149.99</span>
        <div className="ml-4 text-yellow-500">★★★★☆</div>
        <span className="ml-2 text-gray-600">(536 reviews)</span>
      </div>

      <p className="mb-4 text-gray-700">
        The gently curved lines accentuated by seam details are kind to your body and pleasant to look at.
      </p>

      <div className="flex items-center mb-6">
        <span className="mr-2">Color:</span>
        <div className="flex space-x-2">
          <button
            style={{ backgroundColor: '#5DA3A1' }}
            onClick={() => setSelectedColor('#5DA3A1')}
            className={`w-8 h-8 rounded-full ${selectedColor === '#5DA3A1' ? 'border-4 border-black' : ''}`}
          />
          <button
            style={{ backgroundColor: '#D3CFCF' }}
            onClick={() => setSelectedColor('#D3CFCF')}
            className={`w-8 h-8 rounded-full ${selectedColor === '#D3CFCF' ? 'border-4 border-black' : ''}`}
          />
          {/* Add more color buttons */}
        </div>
      </div>

      <div className="flex items-center mb-6">
        <button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))} className="p-2 bg-gray-200">
          -
        </button>
        <input
          type="text"
          value={quantity}
          readOnly
          className="w-12 text-center mx-2 border"
        />
        <button onClick={() => setQuantity((prev) => prev + 1)} className="p-2 bg-gray-200">
          +
        </button>
        <button className="ml-4 bg-green-500 text-white px-6 py-2">Add to Cart</button>
      </div>

      <p className="text-gray-500 mb-4">Free 3-4 day shipping · Tool-free assembly · 30-day trial</p>

      <div className="mb-8">
        <h3 className="text-lg font-bold">Product Specifications</h3>
        <p>Backrest height: 45 cm</p>
        <p>Width: 84 cm</p>
        <p>Depth: 78 cm</p>
        <p>Seat width: 57 cm</p>
        <p>Armrest height: 53 cm</p>
      </div>

      <div className="mb-6">
        <h3
          className="text-lg font-bold cursor-pointer"
          onClick={() => toggleExpand('productInfo')}
        >
          Product Info {isExpanded.productInfo ? '-' : '+'}
        </h3>
        {isExpanded.productInfo && <p className="text-gray-700">Detailed product information goes here.</p>}
      </div>

      <div className="mb-6">
        <h3
          className="text-lg font-bold cursor-pointer"
          onClick={() => toggleExpand('features')}
        >
          Features {isExpanded.features ? '-' : '+'}
        </h3>
        {isExpanded.features && <p className="text-gray-700">Product features go here.</p>}
      </div>

      <div className="mb-6">
        <h3
          className="text-lg font-bold cursor-pointer"
          onClick={() => toggleExpand('warrantyInfo')}
        >
          Warranty Information {isExpanded.warrantyInfo ? '-' : '+'}
        </h3>
        {isExpanded.warrantyInfo && <p className="text-gray-700">Warranty details go here.</p>}
      </div>

      <div className="mb-6">
        <h3
          className="text-lg font-bold cursor-pointer"
          onClick={() => toggleExpand('deliveryShipping')}
        >
          Delivery and Shipping {isExpanded.deliveryShipping ? '-' : '+'}
        </h3>
        {isExpanded.deliveryShipping && <p className="text-gray-700">Delivery details go here.</p>}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {/* Map through reviews and display them */}
        <div className="border-t border-b py-4">
          <h4 className="font-bold">Rafael Marquez</h4>
          <p className="text-gray-600">June 25, 2024</p>
          <div className="text-yellow-500">★★★★★</div>
          <p className="text-gray-700 mt-2">Absolutely love this chair!</p>
        </div>
        {/* Add more reviews */}
      </div>
    </div>
  );
};

export default DetailPage;
