import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

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

  // Helper to normalize image paths
  const makeUrl = (path) => {
    if (!path) return "";
    let p = path.replace(/\\/g, "/");
    if (p.startsWith("http")) return p;
    if (!p.startsWith("/")) p = "/" + p;
    return `https://ecommerce-backend-0cza.onrender.com${p}`;
  };

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

      if (data && data._id) {
        // Clear the cart from memory
        localStorage.removeItem("cartItems");

        // 👇 CRUCIAL: Tell the Navbar to remove the red number badge 👇
        window.dispatchEvent(new Event("cartUpdated"));

        // Redirect to the success page
        navigate(`/order/${data._id}`);
      } else {
        console.error("Order created but no ID returned:", data);
        alert(
          "Order processed, but we couldn't find the order ID. Check console.",
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 mb-8"
        >
          Order Summary
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Order Details */}
          <div className="flex-1 space-y-6">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
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
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
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
                      {/* ADDED: Product Image Thumbnail */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded overflow-hidden border border-gray-200">
                          <img
                            src={makeUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/50?text=No+Img";
                            }}
                          />
                        </div>
                        <Link
                          to={`/product/${item.product}`}
                          className="text-gray-900 hover:text-blue-600 font-semibold transition-colors"
                        >
                          {item.name}
                        </Link>
                      </div>

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
            </motion.div>
          </div>

          {/* Right Side: Checkout Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:w-96 bg-white rounded-lg shadow-md p-6 h-fit"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Items:</span>
                <span className="font-semibold">${itemsPrice}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-semibold">${shippingPrice}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Tax:</span>
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
                className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-colors duration-200 mt-6 shadow-sm hover:shadow-md ${
                  cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Place Order
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
