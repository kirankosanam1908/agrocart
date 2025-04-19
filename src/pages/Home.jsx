import React, { useState, useEffect } from "react";
import { getProducts } from "../api/product"; // API call to fetch products
import ProductCard from "../components/ProductCard"; // Component to display each product

function ProductCataloguePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log(response);
        setProducts(response); // Assuming API returns the data in this format
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600 animate-pulse">
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-14 bg-gray-100">
      {/* Header Section */}
      <div className="text-center py-8 bg-gradient-to-r from-green-400 to-teal-500 text-white">
        <h1 className="text-4xl font-bold tracking-tight leading-tight">
          Bulk Vegetable/Fruit Ordering
        </h1>
        <p className="mt-3 text-lg">
          Browse and order fresh produce in bulk for your business or personal
          needs
        </p>
      </div>

      {/* Product Grid Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCataloguePage;
