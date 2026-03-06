import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [addedItems, setAddedItems] = useState({}); // Tracking which items were just added

  useEffect(() => {
    // Fetches the latest groceries and electronics from your backend
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Adil's Store - Latest Products</h1>
        {/* View Cart button allows user to navigate when they are ready */}
        <Link
          to="/cart"
          style={{
            textDecoration: "none",
            backgroundColor: "#222",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "4px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          🛒 View Cart
        </Link>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              width: "250px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            {/* 1. THE IMAGE BLOCK */}
            <Link to={`/product/${product._id}`}>
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  marginBottom: "15px",
                  overflow: "hidden",
                  borderRadius: "4px",
                }}
              >
                <img
                  src={`http://localhost:5000${product.image.startsWith("/") ? "" : "/"}${product.image}`}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/250x200?text=No+Image";
                  }}
                />
              </div>
            </Link>

            <Link
              to={`/product/${product._id}`}
              style={{ textDecoration: "none", color: "#333" }}
            >
              <h3 style={{ margin: "10px 0", fontSize: "18px" }}>
                {product.name}
              </h3>
            </Link>

            <p style={{ color: "gray", fontSize: "14px" }}>
              {product.category}
            </p>
            <h2 style={{ color: "#2ecc71" }}>${product.price}</h2>

            <p
              style={{
                fontSize: "14px",
                height: "40px",
                overflow: "hidden",
                color: "#666",
              }}
            >
              {product.description}
            </p>

            {/* --- UPDATED BUTTON WITH DYNAMIC FEEDBACK --- */}
            <button
              onClick={() => addToCartHandler(product)}
              disabled={product.countInStock === 0}
              style={{
                /* Button turns green temporarily when an item is added */
                background: addedItems[product._id]
                  ? "#2ecc71"
                  : product.countInStock > 0
                    ? "#333"
                    : "#ccc",
                color: "#fff",
                padding: "10px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                cursor: product.countInStock > 0 ? "pointer" : "not-allowed",
                marginTop: "10px",
                fontWeight: "bold",
                transition: "background 0.3s ease",
              }}
            >
              {addedItems[product._id]
                ? "✅ Added!"
                : product.countInStock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
