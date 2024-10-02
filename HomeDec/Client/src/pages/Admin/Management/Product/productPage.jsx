import React, { useEffect, useState } from 'react';
import TableHeader from '../../../../Components/Table/TableHeader';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { FiEdit3 } from 'react-icons/fi';
import IsSeller from '../../../../Components/Admin/IsSeller';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { changeProductStatus, ListAllProducts, ListProducts } from '../../../../api/administrator/productManagement';

const ProductsPage = () => {

  const [products, setProducts] = useState([])
  const { role } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        var list
        if (role === "seller") {
          list = await ListProducts()
        } else {
          list = await ListAllProducts()
        }
        console.log(list);
        setProducts(list);

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProduct();
  }, []);

  const EditProductStatus = async (pId, index) => {
    try {
      const response = await changeProductStatus({ pId, index })
      if (response.status === 200) {
        const updatedVariant = response.variant;

        // Update the state with the new variant status
        setProducts((prevProducts) =>
          prevProducts.map((prod) => {
            if (prod._id === pId) {
              const updatedVariants = [...prod.variants];
              updatedVariants[index] = updatedVariant; // Update the specific variant
              return { ...prod, variants: updatedVariants };
            }
            return prod;
          })
        );

        console.log(response.message); // Log success message
      }
    } catch (error) {
      console.log(error.message);

    }

  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Product Stock</h2>
        <IsSeller>
          <NavLink to={"/seller/products/add-new-product"}>
            <button
              type="submit"
              className=" bg-green_700 text-white font-semibold py-2 px-4 mb-2 rounded-2xl hover:bg-green_800 focus:outline-none focus:ring-2 focus:ring-green_500 focus:ring-opacity-50"
            // onClick={() => setAddPopup(true)}
            >
              Add New Product
            </button>
          </NavLink>
        </IsSeller>
      </div>

      <table className="table-auto w-full text-left">
        <TableHeader headerContent={["Image", "ProductName", "SubCategory", "AvailableColor", "Stocks", "Price", "Action"]} />
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border-b ">
              <td className="px-4 py-2">
                <img
                  src={product.variants[0].images[0].secure_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-4 py-2">{product.title}</td>
              <td className="px-4 py-2">{product.subCategory}</td>
              <td className="px-4 py-2">
                {
                  product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className='w-5 h-5 rounded-full mt-2'
                      style={{ backgroundColor: variant.colorHex }}
                    ></div>
                  ))
                }
              </td>

              <td className="px-4 py-2">
                {
                  product.variants.map((variant, index) => (
                    <div key={index} className='mt-2'>{variant.price}</div>
                  ))
                }
              </td>
              <td className="px-4 py-2">
                {
                  product.variants.map((variant, index) => (
                    <div key={index} className='mt-2'>{variant.stock}</div>
                  ))
                }
              </td>
              <td className="px-4 py-2">
                {
                  product.variants.map((variant, index) => (

                    <div key={index} className='flex gap-2 items-center mt-2  cursor-pointer' >
                      {(role !== 'admin') &&
                        <div
                          onClick={() => {
                            if (role !== 'admin') {
                              EditProductStatus(product._id, index);
                            }
                          }}

                          className={`${variant.isActive
                            ? 'bg-status_succes_background_green text-status_succes_text_green '
                            : 'bg-status_failed_text_red text-status_failed_background_red '
                            } rounded-md py-1 text-xs text-center pl-2 min-w-[70px]`}
                        >
                          {
                            variant.isActive
                              ? <div className='flex items-center gap-2'><TbLock />Lock</div>
                              : <div className='flex items-center gap-1'><TbLockOpen />Unlock</div>

                          }

                        </div>
                      }
                      {(role !== 'admin') &&
                        <Link to={`/seller/products/edit/${product._id}`} >
                          <span
                            className="bg-green_200 text-green_900 rounded-md py-1.5 flex items-center text-xs text-center px-2"
                          >
                            <FiEdit3 />
                          </span>
                        </Link>}
                    </div>
                  ))
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className="mt-4 flex justify-between items-center">
        <span>Showing 1-9 of 78</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md">◀</button>
          <button className="px-3 py-1 border rounded-md">▶</button>
        </div>
      </div> */}
    </div>
  );
};

export default ProductsPage;
