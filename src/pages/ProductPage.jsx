import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
          `http://localhost:5000/api/products/${id}`,
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

  if (loading) return <h2>Loading...</h2>;
  if (error)
    return <div style={{ color: "red", padding: "20px" }}>{error}</div>;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#333",
          fontWeight: "bold",
          display: "inline-block",
          marginBottom: "20px",
        }}
      >
        &larr; Back to Store
      </Link>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 0%",
            minWidth: "300px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={
              product.image
                ? `http://localhost:5000/${product.image.replace(/\\/g, "/").replace(/^\//, "")}`
                : ""
            }
            alt={product.name}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400?text=No+Image+Found";
            }}
          />
        </div>

        <div style={{ flex: "1 1 0%", minWidth: "300px" }}>
          <h2
            style={{ fontSize: "32px", marginTop: "0", marginBottom: "15px" }}
          >
            {product.name}
          </h2>
          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              marginBottom: "15px",
            }}
          />
          <p
            style={{
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            CATEGORY: {product.category}
          </p>
          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              marginBottom: "15px",
              marginTop: "15px",
            }}
          />
          <p style={{ lineHeight: "1.6", color: "#333", fontSize: "16px" }}>
            {product.description}
          </p>
        </div>

        <div style={{ flex: "1 1 0%", minWidth: "250px" }}>
          <div
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "#fcfcfc",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
                fontSize: "18px",
              }}
            >
              <span>Price:</span>
              <span style={{ fontWeight: "bold" }}>${product.price}</span>
            </div>
            <hr
              style={{
                border: "0",
                borderTop: "1px solid #eee",
                marginBottom: "15px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
                fontSize: "18px",
              }}
            >
              <span>Status:</span>
              <span
                style={{
                  fontWeight: "bold",
                  color: product.countInStock > 0 ? "#2ecc71" : "#e74c3c",
                }}
              >
                {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  fontSize: "18px",
                }}
              >
                <span>Qty:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                    minWidth: "80px",
                  }}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor:
                  product.countInStock === 0 ? "#bdc3c7" : "#222",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: product.countInStock === 0 ? "not-allowed" : "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
