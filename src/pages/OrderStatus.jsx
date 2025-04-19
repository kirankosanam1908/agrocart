import { useState } from "react";
import { getOrderById } from "../api/order.js";
import StatusBadge from "../components/StatusBadge";

const OrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError("Failed to fetch order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mt-15 mx-auto p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold text-primary mb-4 text-center">
        Track Your Order
      </h1>

      {/* Input and Track Button */}
      <div className="flex gap-4 mb-6 justify-center items-center">
        <input
          className="input w-2/3 md:w-1/2"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleTrack}
          className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300"
          disabled={loading || !orderId}
        >
          {loading ? "Tracking..." : "Track"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {/* Order Details */}
      {order && (
        <div className="bg-white p-6 rounded-xl shadow-xl space-y-4 mt-6 transition-all transform hover:scale-105 duration-300">
          <div className="flex flex-col space-y-2">
            <p className="text-lg font-medium">
              <strong>Name:</strong> {order.buyerName}
            </p>
            <p className="text-lg font-medium">
              <strong>Address:</strong> {order.deliveryAddress}
            </p>
            <p className="text-lg font-medium">
              <strong>Status:</strong> <StatusBadge status={order.status} />
            </p>
          </div>

          <h3 className="font-semibold mt-4">Items:</h3>
          <ul className="list-disc list-inside space-y-2">
            {order.items.map((item, idx) => (
              <li key={idx} className="text-lg">
                {item.productName} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
