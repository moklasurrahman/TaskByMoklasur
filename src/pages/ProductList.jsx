import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ProductForm from './ProductForm';
import Swal from 'sweetalert2';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
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
          Swal.fire('Deleted!', 'Title has been deleted.', 'success');
        } else {
          Swal.fire('Error', 'Failed to delete Title.', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'An error occurred while deleting the Title.', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  // Filter products by title, name, or description based on the search query
  const filteredProducts = products.filter((product) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(lowerCaseQuery) ||
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery)
    );
  });


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="relative w-full lg:max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>

      {/* Add search input */}
      <div className=" absolute top-0 right-0 z-50 w-full p-2">
        <input
          type="text"
          placeholder="Search products..."
          className="block w-full p-2 mb-4 border rounded bg-red-400 placeholder:text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ProductForm setProducts={setProducts} />

      <div className="absolute top-0 left-0 right-0 rounded-sm w-full bg-black p-10">
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

      {/* Use filteredProducts instead of products to display the list */}
      <ul className="space-y-4 grid gap-3 grid-cols-1 sm:grid-cols-3 min-h-5xl">
        {filteredProducts.map((product) => (
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
