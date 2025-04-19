// frontend/src/api/products.js
import axios from "axios";

const BASE_URL = "https://agrocartbackend.onrender.com/api/products"; // Change this to your deployed backend URL

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

// Add a new product (for admin)
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(BASE_URL, productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};

// Update an existing product (for admin)
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

// Delete a product (for admin)
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
};
