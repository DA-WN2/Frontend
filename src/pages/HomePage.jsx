import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye } from "react-icons/fa";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [addedItems, setAddedItems] = useState({}); // Tracking which items were just added

  useEffect(() => {
    // Fetches the latest groceries and electronics from your backend
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://ecommerce-backend-0cza.onrender.com/api/products",
        );
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // --- THE ADD TO CART LOGIC (No Redirect) ---
  const addToCartHandler = (product) => {
    // 1. Get current cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // 2. Check if this product is already in the cart
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      existItem.qty += 1;
    } else {
      // Add new item with default quantity of 1
      cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
    }

    // 3. Save the updated list back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // --- VISUAL FEEDBACK LOGIC ---
    // Set this specific product ID to 'true' to change the button text
    setAddedItems((prev) => ({ ...prev, [product._id]: true }));

    // Automatically reset the button text after 2 seconds
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold mb-4"
          >
            Welcome to Our Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl mb-8"
          >
            Discover amazing products at unbeatable prices
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight text-center">
            Featured Products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/product/${product._id}`}>
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={`https://ecommerce-backend-0cza.onrender.com${product.image.startsWith("/") ? "" : "/"}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/250x200?text=No+Image";
                    }}
                  />
                </div>
              </Link>

              <div className="p-6">
                <Link
                  to={`/product/${product._id}`}
                  className="text-decoration-none"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
                  {product.category}
                </p>
                <p className="text-2xl font-bold text-green-600 mb-3">
                  ${product.price}
                </p>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex space-x-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaEye />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => addToCartHandler(product)}
                    disabled={product.countInStock === 0}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                      addedItems[product._id]
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : product.countInStock > 0
                          ? "bg-gray-800 hover:bg-gray-900 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <FaShoppingCart />
                    <span>
                      {addedItems[product._id]
                        ? "Added!"
                        : product.countInStock > 0
                          ? "Add"
                          : "Out"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
