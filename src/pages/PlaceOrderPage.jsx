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

      // UPDATED: We now send the full price breakdown to the backend
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems: cartItems,
          shippingAddress: shippingAddress,
          itemsPrice: itemsPrice, // Added
          shippingPrice: shippingPrice, // Added
          taxPrice: taxPrice, // Added
          totalPrice: totalPrice,
        },
        config,
      );

      // --- CLEANUP: Clear cart from LocalStorage after successful order ---
      localStorage.removeItem("cartItems");

      // Redirect to the Order Details page
      navigate(`/order/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>Order Summary</h2>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* Left Side: Order Details */}
        <div style={{ flex: "2", minWidth: "300px" }}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              Shipping
            </h3>
            <p>
              <strong>Name:</strong> {userInfo?.name}
            </p>
            <p>
              <strong>Address:</strong> {shippingAddress.address},{" "}
              {shippingAddress.city}, {shippingAddress.postalCode},{" "}
              {shippingAddress.country}
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              Order Items
            </h3>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div>
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span>
                      <Link
                        to={`/product/${item.product}`}
                        style={{
                          textDecoration: "none",
                          color: "#333",
                          fontWeight: "bold",
                        }}
                      >
                        {item.name}
                      </Link>
                    </span>
                    <span>
                      {item.qty} x ${item.price} ={" "}
                      <strong>${(item.qty * item.price).toFixed(2)}</strong>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Checkout Card */}
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
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
            }}
          >
            Checkout
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <span>Items:</span> <span>${itemsPrice}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <span>Shipping:</span> <span>${shippingPrice}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <span>Tax:</span> <span>${taxPrice}</span>
          </div>
          <hr
            style={{
              border: "0",
              borderTop: "1px solid #ddd",
              margin: "15px 0",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#2ecc71",
            }}
          >
            <span>Total:</span> <span>${totalPrice}</span>
          </div>

          <button
            onClick={placeOrderHandler}
            disabled={cartItems.length === 0}
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
              marginTop: "10px",
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
