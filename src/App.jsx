// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductCataloguePage from "./pages/Home";
import OrderForm from "./pages/OrderForm";
import OrderStatus from "./pages/OrderStatus";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS for notifications

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Navbar for navigation */}
      <div className="container mx-auto px-4 py-6">
        <Routes basename="/">
          <Route path="/" element={<ProductCataloguePage />} />
          <Route path="/order" element={<OrderForm />} />{" "}
          {/* Order form page */}
          <Route path="/status" element={<OrderStatus />} />{" "}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          {/* Order status page */}
          <Route path="/admin" element={<AdminDashboard />} />{" "}
          {/* Admin dashboard */}
        </Routes>
      </div>
      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
