import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  // Check if the user is currently logged in by checking Local Storage
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const logoutHandler = () => {
    // Remove the VIP pass from memory
    localStorage.removeItem("userInfo");
    // Send them back to the login page
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#222",
        color: "#fff",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* Brand Logo */}
      <Link
        to="/"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        STORE.
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        <Link
          to="/cart"
          style={{
            color: "#fff",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ShoppingCart size={20} /> Cart
        </Link>

        {/* Conditional Rendering: Show User Name & Logout IF logged in, else show Sign In */}
        {userInfo ? (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link
              to="/profile"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#2ecc71",
                fontWeight: "bold",
              }}
            >
              <User size={20} /> {userInfo.name}
            </Link>
            {/* Add this right ABOVE your Logout button in Navbar.jsx */}
            {userInfo.role === "admin" && (
              <Link
                to="/admin"
                style={{
                  background: "#f39c12",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Admin Dashboard
              </Link>
            )}
            {userInfo.role === "admin" && (
              <Link
                to="/admin/productlist"
                style={{
                  background: "#9b59b6",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginLeft: "10px",
                }}
              >
                Products
              </Link>
            )}
            <button
              onClick={logoutHandler}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid #fff",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              color: "#fff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <User size={20} /> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
