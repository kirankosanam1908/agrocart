import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../api/order.js";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/product";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      setLoadingOrders(true);
      setLoadingProducts(true);

      try {
        const orderData = await getAllOrders();
        const productData = await getProducts();
        setOrders(orderData);
        setProducts(productData);
      } catch (error) {
        console.error(error); // Log the error for debugging
        toast.error("Failed to fetch data");
      } finally {
        setLoadingOrders(false);
        setLoadingProducts(false);
      }
    };

    fetchOrdersAndProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Handle order status update
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Order status updated!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  // Handle product form submission (add or edit)
  const handleProductSubmit = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      let product;
      if (editingProduct) {
        product = await updateProduct(editingProduct.id, editingProduct);
        setProducts(products.map((p) => (p.id === product.id ? product : p)));
        toast.success("Product updated successfully!");
      } else {
        product = await addProduct(newProduct);
        setProducts([...products, product]);
        toast.success("Product added successfully!");
      }

      setNewProduct({ name: "", price: 0, description: "" });
      setEditingProduct(null);
    } catch (error) {
      toast.error(
        editingProduct ? "Failed to update product" : "Failed to add product"
      );
    }
  };

  // Handle product deletion with confirmation
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        toast.success("Product deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <div className="container mt-15 mx-auto py-4">
      <div className="flex flex-row justify-between p-4">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Orders Table */}
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {loadingOrders ? (
        <p>Loading orders...</p>
      ) : (
        <table className="min-w-full bg-white border mb-5 border-gray-200">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">Buyer Name</th>
              <th className="p-2">Total Price</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">{order.buyerName}</td>
                  <td className="p-2 border">${order.totalPrice}</td>
                  <td className="p-2 border">{order.status}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, "In Progress")
                      }
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      Mark as In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, "Delivered")}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 ml-2"
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Product Management */}
      <h2 className="text-2xl font-bold mb-8">Product Management</h2>

      {/* Add/Edit Product Form */}
      <div className="bg-white p-6 rounded shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        <div>
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            value={editingProduct ? editingProduct.name : newProduct.name}
            onChange={(e) =>
              editingProduct
                ? setEditingProduct({ ...editingProduct, name: e.target.value })
                : setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="input mb-4"
            placeholder="Product Name"
          />

          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={editingProduct ? editingProduct.price : newProduct.price}
            onChange={(e) =>
              editingProduct
                ? setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                : setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="input mb-4"
            placeholder="Price"
          />

          <label className="block mb-2">Description</label>
          <textarea
            value={
              editingProduct
                ? editingProduct.description
                : newProduct.description
            }
            onChange={(e) =>
              editingProduct
                ? setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                : setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="input mb-4"
            placeholder="Product Description"
          />

          <button
            onClick={handleProductSubmit}
            className="bg-primary text-white py-2 px-6 rounded hover:bg-green-700 transition"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>

      {/* Display Products */}
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : (
        <table className="min-w-full bg-white border mb-5 border-gray-200">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Product ID</th>
              <th className="p-2">Product Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2 border">{product.id}</td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">${product.price}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
