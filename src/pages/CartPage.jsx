import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTrash, FaShoppingCart, FaArrowRight } from "react-icons/fa";

const CartPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  // helper to normalise image paths coming from API or storage
  const makeUrl = (path) => {
    if (!path) return "";
    let p = path.replace(/\\/g, "/");
    if (p.startsWith("http")) return p;
    if (!p.startsWith("/")) p = "/" + p;
    return `https://ecommerce-backend-0cza.onrender.com${p}`;
  };

  // 1. SMART CART: Initialize state from Local Storage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // normalise any legacy image paths
        return parsed.map((it) => ({
          ...it,
          image: it.image ? it.image.replace(/\\/g, "/") : it.image,
        }));
      } catch (e) {
        console.error("failed to parse saved cart", e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const fetchItemAndAddToCart = async () => {
      if (id) {
        try {
          const { data } = await axios.get(
            `https://ecommerce-backend-0cza.onrender.com/api/products/${id}`,
          );

          const newItem = {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty: qty,
          };

          setCartItems((prevItems) => {
            const itemExists = prevItems.find(
              (x) => x.product === newItem.product,
            );
            if (itemExists) {
              return prevItems.map((x) =>
                x.product === itemExists.product ? newItem : x,
              );
            } else {
              return [...prevItems, newItem];
            }
          });
        } catch (error) {
          console.error("Error adding to cart", error);
        }
      }
    };

    fetchItemAndAddToCart();
  }, [id, qty]);

  // Save to Local Storage whenever cart changes AND update the Navbar Badge
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // 👇 THIS LINE KEEPS YOUR NAVBAR BADGE IN SYNC 👇
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cartItems]);

  const removeFromCartHandler = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((x) => x.product !== productId),
    );
  };

  const updateQtyHandler = (productId, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === productId ? { ...x, qty: newQty } : x,
      ),
    );
  };

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-900 mb-8 flex items-center space-x-2"
        >
          <FaShoppingCart />
          <span>Shopping Cart</span>
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-100 border border-gray-200 text-gray-700 px-6 py-4 rounded-lg text-center"
          >
            <p className="text-lg mb-4">Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
            >
              <FaArrowRight />
              <span>Go Back To Store</span>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={makeUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80?text=No+Img";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <Link
                    to={`/product/${item.product}`}
                    className="flex-1 ml-6 text-gray-900 hover:text-blue-600 transition-colors font-semibold text-lg"
                  >
                    {item.name}
                  </Link>

                  {/* Price */}
                  <div className="font-bold text-lg text-gray-900 w-24 text-center">
                    ${item.price}
                  </div>

                  {/* Quantity Selector */}
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      updateQtyHandler(item.product, Number(e.target.value))
                    }
                    className="mx-6 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromCartHandler(item.product)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-1"
                  >
                    <FaTrash />
                    <span>Remove</span>
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Checkout Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:w-96 bg-white rounded-lg shadow-md p-6 h-fit"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </span>
                  <span className="font-semibold">
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-2xl font-bold text-green-600">
                    <span>Total</span>
                    <span>
                      $
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkoutHandler}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-6 flex items-center justify-center space-x-2"
                >
                  <FaArrowRight />
                  <span>Proceed To Checkout</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
