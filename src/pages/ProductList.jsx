import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const accessToken = sessionStorage.getItem('access_token');

        if (!accessToken) {
          setError('No access token found.');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://hotel.aotrek.net/api/auth/manage', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.data.success) {
          setProducts(response.data.categories);
        } else {
          setError('Failed to fetch products.');
        }
      } catch (err) {
        setError('An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const accessToken = sessionStorage.getItem('access_token');

      if (!accessToken) {
        setError('No access token found.');
        return;
      }

      const response = await axios.delete(`https://hotel.aotrek.net/api/auth/delete/${productId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.message === 'Title deleted successfully') {
        setProducts(products.filter(product => product.id !== productId));
      } else {
        setError('Failed to delete Title.');
      }
    } catch (err) {
      setError('An error occurred while deleting the Title.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className=" relative w-full lg:max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>

      <ProductForm setProducts={setProducts} />

      <div className=" absolute top-0 left-0 right-0 rounded-sm w-full bg-black p-10">
        <div className="">
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              setProducts={setProducts}
              setIsEditing={handleCloseEdit}
            />
          )}
        </div>
      </div>

      <ul className="space-y-4 grid gap-3 grid-cols-1 sm:grid-cols-3 min-h-5xl">
        {products.map(product => (
          <li key={product.id} className="p-4 border rounded-md shadow-sm">
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-sm text-gray-500">By {product.name}</p>
            <div className="flex gap-3 py-3">
              <MdDelete
                className='p-1 text-white text-[25px] cursor-pointer bg-red-400'
                onClick={() => handleDelete(product.id)}
              />
              <FaRegEdit
                className='p-1 text-white text-[25px] cursor-pointer bg-blue-400'
                onClick={() => handleEdit(product)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
