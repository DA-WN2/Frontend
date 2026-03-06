import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";

const OrderPage = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate(); // Initialize navigation

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(
          `https://ecommerce-backend-0cza.onrender.com/api/orders/${orderId}`,
          config,
        );
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, userInfo.token, refresh]);

  // --- SIMULATED PAYMENT HANDLER ---
  const simulatePaymentHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const dummyPaymentResult = {
        id: "SIMULATED_" + Math.random().toString(36).substr(2, 9),
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      };

      await axios.put(
        `https://ecommerce-backend-0cza.onrender.com/api/orders/${orderId}/pay`,
        dummyPaymentResult,
        config,
      );

      // --- THE FIX: Redirect to Profile with a success flag ---
      navigate("/profile", { state: { paymentSuccess: true } });
    } catch (err) {
      alert(err.response?.data?.message || "Payment simulation failed");
    }
  };

  // --- ADMIN ACTION BUTTONS ---
  const deliverHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(
        `https://ecommerce-backend-0cza.onrender.com/api/orders/${orderId}/deliver`,
        {},
        config,
      );
      setRefresh(!refresh);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update delivery status");
    }
  };

  if (loading) return <h2>Loading Order...</h2>;
  if (error)
    return (
      <div
        style={{
          padding: "15px",
          backgroundColor: "#ffcccc",
          color: "#cc0000",
          borderRadius: "4px",
        }}
      >
        {error}
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          marginBottom: "20px",
          wordWrap: "break-word",
        }}
      >
        Order: {order._id}
      </h2>

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
              <strong>Name:</strong> {order.user?.name || "Guest"}
            </p>
            <p>
              <strong>Email:</strong> {order.user?.email}
            </p>
            <p>
              <strong>Address:</strong> {order.shippingAddress?.address},{" "}
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
              , {order.shippingAddress?.country}
            </p>

            {/* --- THE FIX: Conditional Delivery Logic --- */}
            {order.isDelivered ? (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              >
                Delivered on{" "}
                {order.deliveredAt
                  ? order.deliveredAt.substring(0, 10)
                  : order.updatedAt.substring(0, 10)}
              </div>
            ) : order.isPaid ? ( // Only show "Not Delivered" if it IS paid but not yet delivered
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              >
                Not Delivered
              </div>
            ) : null}
          </div>

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
              Payment Status
            </h3>
            {order.isPaid ? (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              >
                Paid on{" "}
                {order.paidAt
                  ? order.paidAt.substring(0, 10)
                  : order.updatedAt.substring(0, 10)}
              </div>
            ) : (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              >
                Not Paid
              </div>
            )}
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
            {order.orderItems.map((item, index) => (
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
        </div>

        {/* Right Side: Total Calculation & Action Card */}
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
            Order Summary
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <span>Items:</span>{" "}
            <span>
              $
              {order.itemsPrice
                ? order.itemsPrice.toFixed(2)
                : order.totalPrice.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <span>Shipping:</span>{" "}
            <span>
              ${order.shippingPrice ? order.shippingPrice.toFixed(2) : "0.00"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <span>Tax:</span>{" "}
            <span>${order.taxPrice ? order.taxPrice.toFixed(2) : "0.00"}</span>
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
              color: "#222",
            }}
          >
            <span>Total:</span> <span>${order.totalPrice.toFixed(2)}</span>
          </div>

          {!order.isPaid && (
            <button
              onClick={simulatePaymentHandler}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "#f1c40f",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Pay Order (Simulated)
            </button>
          )}

          {userInfo &&
            userInfo.role === "admin" &&
            !order.isDelivered &&
            order.isPaid && (
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "2px solid #eee",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", color: "#f39c12" }}>
                  Admin Controls
                </h4>
                <button
                  onClick={deliverHandler}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
