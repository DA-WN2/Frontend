import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  // 1. Pull all our saved data from Local Storage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const shippingAddress =
    JSON.parse(localStorage.getItem("shippingAddress")) || {};
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Security check: Redirect if no address or not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate, userInfo]);

  // 2. Calculate Final Prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  // 3. The Big Button Function
  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "https://ecommerce-backend-0cza.onrender.com/api/orders",
        {
          orderItems: cartItems,
          shippingAddress: shippingAddress,
          itemsPrice: itemsPrice,
          shippingPrice: shippingPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
        },
        config,
      );

      // --- FIX: Check if data and data._id exist before navigating ---
      if (data && data._id) {
        localStorage.removeItem("cartItems");
        navigate(`/order/${data._id}`);
      } else {
        // This triggers if the server responds but doesn't return the new order object
        console.error("Order created but no ID returned:", data);
        alert(
          "Order processed, but we couldn't find the order ID. Check console.",
        );
      }
    } catch (err) {
      // This handles server errors (400, 500, etc.)
      alert(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Order Summary</h1>

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
                  <span className="font-semibold">Name:</span> {userInfo?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Order Items
              </h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
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
              )}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:w-96 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Items:</span>
                <span className="font-semibold">${itemsPrice}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Shipping:</span>
                <span className="font-semibold">${shippingPrice}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Tax:</span>
                <span className="font-semibold">${taxPrice}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-2xl font-bold text-green-600">
                  <span>Total:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-colors duration-200 mt-6 ${
                  cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-900 text-white"
                }`}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
