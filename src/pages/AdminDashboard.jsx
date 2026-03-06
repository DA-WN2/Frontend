import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    // SECURITY KICK: If they aren't logged in, OR if they aren't an admin, kick them out!
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchAllOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Fetching EVERY order in the database
        const { data } = await axios.get(
          "http://localhost:5000/api/orders",
          config,
        );

        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [navigate, userInfo]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        fontFamily: "sans-serif",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          borderBottom: "2px solid #eee",
          paddingBottom: "15px",
          marginTop: 0,
        }}
      >
        Admin Control Room: All Orders
      </h2>

      {loading ? (
        <p>Loading the master order list...</p>
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
      ) : (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#222", color: "#fff" }}>
                <th style={{ padding: "15px" }}>ORDER ID</th>
                <th style={{ padding: "15px" }}>USER ID</th>
                <th style={{ padding: "15px" }}>DATE</th>
                <th style={{ padding: "15px" }}>TOTAL</th>
                <th style={{ padding: "15px" }}>PAID</th>
                <th style={{ padding: "15px" }}>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px", fontWeight: "bold" }}>
                    <Link
                      to={`/order/${order._id}`}
                      style={{ color: "#3498db", textDecoration: "none" }}
                    >
                      {order._id.substring(0, 10)}...
                    </Link>
                  </td>

                  <td style={{ padding: "15px" }}>
                    {order.user
                      ? order.user.name ||
                        String(order.user._id || order.user).substring(0, 10) +
                          "..."
                      : "Guest"}
                  </td>
                  <td style={{ padding: "15px" }}>
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td style={{ padding: "15px" }}>
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      fontWeight: "bold",
                      color: order.isPaid ? "#2ecc71" : "#e74c3c",
                    }}
                  >
                    {order.isPaid ? "Yes" : "No"}
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      fontWeight: "bold",
                      color: order.isDelivered ? "#2ecc71" : "#e74c3c",
                    }}
                  >
                    {order.isDelivered ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
