import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://ecommerce-backend-0cza.onrender.com/api/products/${id}`,
        );
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- THE FIX: Save to LocalStorage directly ---
  const addToCartHandler = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      // Update quantity if it already exists
      existItem.qty = qty;
    } else {
      // Add as new item
      cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: qty,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/cart");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl text-gray-600 flex items-center space-x-2"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          <span>Loading...</span>
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center space-x-2"
        >
          <FaTimesCircle />
          <span>{error}</span>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-semibold mb-8 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Store
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
              <img
                src={
                  product.image
                    ? `https://ecommerce-backend-0cza.onrender.com/${product.image.replace(/\\/g, "/").replace(/^\//, "")}`
                    : ""
                }
                alt={product.name}
                className="max-w-full max-h-96 object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400?text=No+Image+Found";
                }}
              />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="border-b border-gray-200 mb-4"></div>

            {/* THE FIX: Added the Brand text right here! */}
            {product.brand && (
              <p className="text-sm text-blue-600 uppercase tracking-wide font-bold mb-2">
                Brand: {product.brand}
              </p>
            )}

            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-4">
              Category: {product.category}
            </p>
            <div className="border-b border-gray-200 mb-4"></div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          {/* Purchase Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-gray-700">Price:</span>
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
              </div>
              <div className="border-b border-gray-200 mb-4"></div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-gray-700">Status:</span>
                <span
                  className={`text-xl font-semibold flex items-center space-x-2 ${
                    product.countInStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.countInStock > 0 ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                  <span>
                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </span>
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl text-gray-700">Quantity:</span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  product.countInStock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-900 text-white"
                }`}
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
