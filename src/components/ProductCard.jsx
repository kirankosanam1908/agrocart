const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-4 transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out animate-slideUp flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-primary mb-2 tracking-wide">
          {product.name}
        </h2>
        <p className="text-sm text-gray-600">
          ₹{product.price}{" "}
          <span className="text-xs text-gray-400">per unit</span>
        </p>
      </div>

      <div className="mt-4">
        <span className="inline-block px-3 py-1 text-sm font-semibold text-accent bg-accent/10 rounded-full transition">
          Fresh Stock
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
