import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Added state for the cart badge

  // Function to calculate total items in the cart
  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    // 1. Check the cart count when the Navbar first loads
    updateCartCount();

    // 2. Listen for the custom event we added to HomePage.jsx
    window.addEventListener("cartUpdated", updateCartCount);

    // 3. Clean up the listener when the component unmounts
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  // Check if the user is currently logged in by checking Local Storage
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const logoutHandler = () => {
    // 1. Remove the VIP pass from memory
    localStorage.removeItem("userInfo");

    // 2. THE FIX: Clear the previous user's cart and shipping data
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");

    // 3. Trigger the Navbar event so the red cart badge disappears instantly
    window.dispatchEvent(new Event("cartUpdated"));

    // 4. Send them back to the login page
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-xl sticky top-0 z-50 border-b border-purple-800/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="text-white text-2xl font-bold tracking-wider hover:text-cyan-400 transition-colors duration-300"
            >
              STORE.
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/cart"
                className="text-white hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 font-medium"
              >
                {/* Wrapped the icon in a relative div to pin the badge to it */}
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
            </motion.div>

            {/* Conditional Rendering: Show User Name & Logout IF logged in, else show Sign In */}
            {userInfo ? (
              <div className="flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/profile"
                    className="text-amber-400 hover:text-amber-300 transition-colors duration-300 flex items-center space-x-2 font-semibold"
                  >
                    <User size={20} />
                    <span>{userInfo.name}</span>
                  </Link>
                </motion.div>

                {/* Admin Links */}
                {userInfo.role === "admin" && (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/admin"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg font-semibold text-sm transition-colors duration-300"
                      >
                        Admin Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/admin/productlist"
                        className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 rounded-lg font-semibold text-sm transition-colors duration-300"
                      >
                        Products
                      </Link>
                    </motion.div>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logoutHandler}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2 border border-rose-500"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  to="/login"
                  className="text-white hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2 font-medium"
                >
                  <User size={20} />
                  <span>Sign In</span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="text-white hover:text-cyan-400 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 rounded-lg mt-2 py-4 px-4 space-y-4 shadow-lg"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/cart"
                  className="text-white hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {/* Applied the same badge logic to the mobile menu */}
                  <div className="relative">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>
              </motion.div>

              {userInfo ? (
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/profile"
                      className="text-amber-400 hover:text-amber-300 transition-colors duration-300 flex items-center space-x-2 font-semibold block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>{userInfo.name}</span>
                    </Link>
                  </motion.div>

                  {userInfo.role === "admin" && (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/admin"
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 block text-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/admin/productlist"
                          className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 block text-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Products
                        </Link>
                      </motion.div>
                    </>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      logoutHandler();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2 border border-rose-500 w-full justify-center"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="text-white hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 font-medium block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Sign In</span>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
