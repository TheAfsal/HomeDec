import React, { useEffect, useState } from 'react';
import { ListProducts } from '../../../api/productManagement';
// import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductsPage = () => {

  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const list = await ListProducts()
        console.log(list);
        setProducts(list);

      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };

    fetchProduct();
  }, []);

  // const products = [
  //   {
  //     id: 1,
  //     image: "https://via.placeholder.com/150",
  //     name: "Apple Watch Series 4",
  //     category: "Digital Product",
  //     price: 690,
  //     piece: 63,
  //     colors: ["#000000", "#FFCCCC", "#FF6666", "#FF9966"],
  //   },
  //   {
  //     id: 2,
  //     image: "https://via.placeholder.com/150",
  //     name: "Microsoft Head Square",
  //     category: "Digital Product",
  //     price: 190,
  //     piece: 13,
  //     colors: ["#000000", "#00BFFF", "#FF6666", "#FFD700"],
  //   },
  //   // Add more products as needed
  // ];

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Product Stock</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search product name"
            className="px-4 py-2 border rounded-md"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
            + Add New Product
          </button>
        </div>
      </div>

      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Sub Category</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Stocks</th>
            <th className="px-4 py-2">Available Color</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="px-4 py-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-4 py-2">{product.title}</td>
              <td className="px-4 py-2">{product.subCategory}</td>
              <td className="px-4 py-2">
                {
                  product.variants.map((variant, index) => (
                    <div className='mb-1'>{variant.price}</div>
                  ))
                }
              </td>
              <td className="px-4 py-2">
                {
                  product.variants.map((variant, index) => (
                    <div className='mb-1'>{variant.stock}</div>
                  ))
                }
              </td>
              <td className="px-4 py-2">
                {
                  product.variants.map((variant, index) => (
                    <div className='w-6 h-6 bg-black rounded-full mb-1' style={{ backgroundColor: variant.color }} ></div>
                  ))
                }
              </td>
              <td className="px-4 py-2 flex space-x-2">
                {/* {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  ></span>
                ))} */}
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button className="text-blue-500">
                  {/* <FaEdit /> */} Edit
                </button>
                <button className="text-red-500">
                  {/* <FaTrash /> */}Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <span>Showing 1-9 of 78</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md">◀</button>
          <button className="px-3 py-1 border rounded-md">▶</button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
