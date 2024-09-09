import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ product, setProducts, setIsEditing }) => {
  const [formProduct, setFormProduct] = useState({ title: '', description: '', name: '' });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (product) {
      setFormProduct({
        title: product.title,
        description: product.description,
        name: product.name,
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken) {
      setFormError('No access token found.');
      return;
    }

    try {
      if (product) {
        // Update existing product
        const response = await axios.put(`https://hotel.aotrek.net/api/auth/update/${product.id}`, formProduct, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.message === 'Title updated successfully') {
          setProducts(prevProducts =>
            prevProducts.map(p => (p.id === product.id ? { ...p, ...formProduct } : p))
          );
          setSuccessMessage('Title updated successfully.');
          setFormError('');
          setIsEditing(null);
        } else {
          setFormError('Failed to update product.');
          setSuccessMessage('');
        }
      } else {
        // Add new product
        const response = await axios.post('https://hotel.aotrek.net/api/auth/create', formProduct, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.message === "Title created successfully") {
          setProducts(prevProducts => [...prevProducts, formProduct]);
          setSuccessMessage('Product added successfully.');
          setFormError('');
        } else {
          setFormError('Failed to add product.');
          setSuccessMessage('');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setFormError('An error occurred while processing the product.');
      setSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 my-5 bg-gray-100 rounded">
      <h3 className="text-lg font-semibold mb-2">{product ? 'Update Product' : 'Add Product'}</h3>
      <input
        type="text"
        value={formProduct.title}
        onChange={(e) => setFormProduct({ ...formProduct, title: e.target.value })}
        placeholder="Product Title"
        className="block w-full p-2 mb-2 border rounded"
        required
      />
      <textarea
        value={formProduct.description}
        onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
        placeholder="Product Description"
        className="block w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        value={formProduct.name}
        onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
        placeholder="Your Name"
        className="block w-full p-2 mb-2 border rounded"
        required
      />
      {formError && <p className="text-red-600 mb-2">{formError}</p>}
      {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded"
      >
        {product ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
