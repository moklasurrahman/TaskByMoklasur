import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProduct = ({ product, setProducts, setIsEditing }) => {
    const [updatedProduct, setUpdatedProduct] = useState({
        title: product.title,
        description: product.description,
        name: product.name
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setUpdatedProduct({
            title: product.title,
            description: product.description,
            name: product.name
        });
    }, [product]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const accessToken = sessionStorage.getItem('access_token');

        if (!accessToken) {
            setFormError('No access token found.');
            return;
        }

        try {
            const response = await axios.put(`https://hotel.aotrek.net/api/auth/update/${product.id}`, updatedProduct, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message === 'Title updated successfully') {
                setProducts(prevProducts =>
                    prevProducts.map(p => (p.id === product.id ? { ...p, ...updatedProduct } : p))
                );
                setIsEditing(false);
            } else {
                setFormError('Failed to update product.');
            }
        } catch (err) {
            setFormError('An error occurred while updating the product.');
        }
    };

    return (
        <form onSubmit={handleUpdateProduct} className="p-3 my-5 bg-gray-100 rounded">
            <h3 className="text-lg font-semibold mb-2">Update Product</h3>
            <input
                type="text"
                value={updatedProduct.title}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, title: e.target.value })}
                placeholder="Product Title"
                className="block w-full p-2 mb-2 border rounded"
            />
            <textarea
                value={updatedProduct.description}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
                placeholder="Product Description"
                className="block w-full p-2 mb-2 border rounded"
            />
            <input
                type="text"
                value={updatedProduct.name}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                placeholder="Your Name"
                className="block w-full p-2 mb-2 border rounded"
            />
            {formError && <p className="text-red-600 mb-2">{formError}</p>}
            <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded"
            >
                Update Product
            </button>
        </form>
    );
};

export default UpdateProduct;
