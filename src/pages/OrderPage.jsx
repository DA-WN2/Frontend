import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";

const OrderPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate(); // Initialize navigation

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(
          `https://ecommerce-backend-0cza.onrender.com/api/orders/${orderId}`,
          config,
        );
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, userInfo.token, refresh]);

  // --- SIMULATED PAYMENT HANDLER ---
  const simulatePaymentHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const dummyPaymentResult = {
        id: "SIMULATED_" + Math.random().toString(36).substr(2, 9),
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      };

      await axios.put(
        `https://ecommerce-backend-0cza.onrender.com/api/orders/${orderId}/pay`,
        dummyPaymentResult,
        config,
      );

      // --- THE FIX: Redirect to Profile with a success flag ---
      navigate("/profile", { state: { paymentSuccess: true } });
    } catch (err) {
      alert(err.response?.data?.message || "Payment simulation failed");
    }
  };

  // --- ADMIN ACTION BUTTONS ---
  const deliverHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(
        `https://ecommerce-backend-0cza.onrender.com/api/orders/${orderId}/deliver`,
        {},
        config,
      );
      setRefresh(!refresh);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update delivery status");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading Order...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 break-words">
          Order: {order._id}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Details */}
          <div className="flex-1 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Shipping
              </h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span>{" "}
                  {order.user?.name || "Guest"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  {order.user?.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode},{" "}
                  {order.shippingAddress?.country}
                </p>
              </div>

              {order.isDelivered ? (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Delivered on{" "}
                  {order.deliveredAt
                    ? order.deliveredAt.substring(0, 10)
                    : order.updatedAt.substring(0, 10)}
                </div>
              ) : order.isPaid ? (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  Not Delivered
                </div>
              ) : null}
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Payment Status
              </h2>
              {order.isPaid ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Paid on{" "}
                  {order.paidAt
                    ? order.paidAt.substring(0, 10)
                    : order.updatedAt.substring(0, 10)}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  Not Paid
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <Link
                      to={`/product/${item.product}`}
                      className="text-gray-900 hover:text-blue-600 font-semibold transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="text-gray-700">
                      {item.qty} x ${item.price} ={" "}
                      <span className="font-semibold">
                        ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Actions */}
          <div className="lg:w-96 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Items:</span>
                <span className="font-semibold">
                  $
                  {order.itemsPrice
                    ? order.itemsPrice.toFixed(2)
                    : order.totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Shipping:</span>
                <span className="font-semibold">
                  $
                  {order.shippingPrice
                    ? order.shippingPrice.toFixed(2)
                    : "0.00"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Tax:</span>
                <span className="font-semibold">
                  ${order.taxPrice ? order.taxPrice.toFixed(2) : "0.00"}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {!order.isPaid && (
                <button
                  onClick={simulatePaymentHandler}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-6"
                >
                  Pay Order (Simulated)
                </button>
              )}

              {userInfo &&
                userInfo.role === "admin" &&
                !order.isDelivered &&
                order.isPaid && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-orange-600 mb-4">
                      Admin Controls
                    </h3>
                    <button
                      onClick={deliverHandler}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Mark As Delivered
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
