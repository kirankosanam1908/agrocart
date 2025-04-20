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

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch {
      toast.error("Failed to update order status");
    }
  };

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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        toast.success("Product deleted successfully!");
      } catch {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <div className="container mt-10 mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-5 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Orders Table */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Order ID</th>
                  <th className="p-3 border">Buyer Name</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-3 border">{order.id}</td>
                      <td className="p-3 border">{order.buyerName}</td>
                      <td className="p-3 border">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 border space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, "In Progress")
                          }
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                        >
                          Mark In Progress
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, "Delivered")
                          }
                          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                        >
                          Mark Delivered
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      No orders available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Product Management */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Product Management</h2>
        <div className="bg-white p-6 rounded shadow-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <div>
            <label className="block mb-2 font-medium">Product Name</label>
            <input
              type="text"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="input mb-4 w-full border p-2 rounded"
              placeholder="Product Name"
            />

            <label className="block mb-2 font-medium">Price</label>
            <input
              type="number"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value),
                    })
                  : setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value),
                    })
              }
              className="input mb-4 w-full border p-2 rounded"
              placeholder="Price"
            />

            <label className="block mb-2 font-medium">Description</label>
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
                  : setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
              }
              className="input mb-4 w-full border p-2 rounded"
              placeholder="Product Description"
            />

            <button
              onClick={handleProductSubmit}
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Product ID</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-3 border">{product.id}</td>
                      <td className="p-3 border">{product.name}</td>
                      <td className="p-3 border">${product.price}</td>
                      <td className="p-3 border space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
