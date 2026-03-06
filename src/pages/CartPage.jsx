import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

  // Save to Local Storage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
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
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <h2 style={{ fontSize: "32px", marginBottom: "30px" }}>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#e2e3e5",
            color: "#383d41",
            borderRadius: "4px",
            fontSize: "18px",
          }}
        >
          Your cart is empty.{" "}
          <Link
            to="/"
            style={{
              fontWeight: "bold",
              color: "#222",
              textDecoration: "none",
            }}
          >
            Go Back To Store
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            {cartItems.map((item) => {
              console.log(
                "cart item image url",
                item.product,
                makeUrl(item.image),
              );
              return (
                <div
                  key={item.product}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    marginBottom: "15px",
                  }}
                >
                  {/* --- FIXED IMAGE BLOCK --- */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <img
                      /* 1. We changed 'product.image' to 'item.image'
                       2. Added .replace() to handle Windows slashes
                       3. Added a leading slash check to prevent double-slashes
                    */
                      src={makeUrl(item.image)}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80?text=No+Img";
                      }}
                    />
                  </div>

                  <Link
                    to={`/product/${item.product}`}
                    style={{
                      textDecoration: "none",
                      color: "#333",
                      flex: "1",
                      marginLeft: "20px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {item.name}
                  </Link>

                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      width: "100px",
                    }}
                  >
                    ${item.price}
                  </div>

                  <select
                    value={item.qty}
                    onChange={(e) =>
                      updateQtyHandler(item.product, Number(e.target.value))
                    }
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      marginRight: "20px",
                    }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCartHandler(item.product)}
                    style={{
                      padding: "10px 15px",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary */}
          <div
            style={{
              flex: "1",
              minWidth: "250px",
              border: "1px solid #ddd",
              padding: "25px",
              borderRadius: "8px",
              height: "fit-content",
              backgroundColor: "#fff",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                fontSize: "22px",
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
              }}
            >
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              items
            </h3>
            <h2
              style={{ color: "#2ecc71", fontSize: "28px", margin: "20px 0" }}
            >
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </h2>
            <button
              onClick={checkoutHandler}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "#222",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
