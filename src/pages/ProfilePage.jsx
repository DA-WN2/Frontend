import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import axios from "axios";

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // State for the success message

  const navigate = useNavigate();
  const location = useLocation(); // Used to catch state passed during navigation

  // Grab the logged-in user's details
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    // 1. Check if we just arrived here from a successful payment
    if (location.state?.paymentSuccess) {
      setShowSuccess(true);

      // Automatically hide the message after 3 seconds
      const timer = setTimeout(() => setShowSuccess(false), 3000);

      // Clean up the history state so the message doesn't reappear on refresh
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    // Security kick: If not logged in, send to login page
    if (!userInfo) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Fetching the orders for THIS specific user
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/mine",
          config,
        );

        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch your orders.");
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate, userInfo]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      {/* --- SUCCESS BANNER --- */}
      {showSuccess && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#2ecc71",
            color: "#fff",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            animation: "fadeIn 0.5s",
          }}
        >
          ✅ Payment Successful! Your order history has been updated.
        </div>
      )}

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {/* Left Side: Profile Details */}
        <div
          style={{
            flex: "1",
            minWidth: "250px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            height: "fit-content",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
              marginTop: 0,
            }}
          >
            My Profile
          </h2>
          <p style={{ fontSize: "18px" }}>
            <strong>Name:</strong> {userInfo?.name}
          </p>
          <p style={{ fontSize: "18px" }}>
            <strong>Email:</strong> {userInfo?.email}
          </p>
        </div>

        {/* Right Side: Order History Table */}
        <div
          style={{
            flex: "3",
            minWidth: "400px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
              marginTop: 0,
            }}
          >
            Order History
          </h2>

          {loading ? (
            <p>Loading your orders...</p>
          ) : error ? (
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
          ) : orders.length === 0 ? (
            <p style={{ fontSize: "18px", color: "#666" }}>
              You haven't placed any orders yet.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f9f9f9" }}>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      DATE
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      TOTAL
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      PAID
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      DELIVERED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(
                    (order) =>
                      order && (
                        <tr
                          key={order._id}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <td style={{ padding: "12px" }}>
                            {order?._id?.substring(0, 10)}...
                          </td>
                          <td style={{ padding: "12px" }}>
                            {order?.createdAt?.substring(0, 10)}
                          </td>
                          <td style={{ padding: "12px" }}>
                            ${order?.totalPrice?.toFixed(2)}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              fontWeight: "bold",
                              color: order?.isPaid ? "#2ecc71" : "#e74c3c",
                            }}
                          >
                            {order?.isPaid ? "Yes" : "No"}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              fontWeight: "bold",
                              color: order?.isDelivered ? "#2ecc71" : "#e74c3c",
                            }}
                          >
                            {order?.isDelivered ? "Yes" : "No"}
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
