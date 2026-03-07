import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

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
          "https://ecommerce-backend-0cza.onrender.com/api/orders",
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">
            Admin Control Room: All Orders
          </h1>

          {loading ? (
            <p className="text-gray-600 text-lg">
              Loading the master order list...
            </p>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-6 py-4 text-left font-semibold">
                      ORDER ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      USER ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">DATE</th>
                    <th className="px-6 py-4 text-left font-semibold">TOTAL</th>
                    <th className="px-6 py-4 text-left font-semibold">PAID</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      DELIVERED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-semibold">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {order._id.substring(0, 10)}...
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.user
                          ? order.user.name ||
                            String(order.user._id || order.user).substring(
                              0,
                              10,
                            ) + "..."
                          : "Guest"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          order.isPaid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {order.isPaid ? "Yes" : "No"}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          order.isDelivered ? "text-green-600" : "text-red-600"
                        }`}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
