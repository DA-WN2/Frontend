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
          "https://ecommerce-backend-0cza.onrender.com/api/orders/mine",
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Banner */}
        {showSuccess && (
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg text-center mb-8 font-semibold text-lg shadow-md animate-pulse">
            ✅ Payment Successful! Your order history has been updated.
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Details */}
          <div className="lg:w-80 bg-white rounded-lg shadow-md p-6 h-fit">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              My Profile
            </h1>
            <div className="space-y-3">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Name:</span> {userInfo?.name}
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Email:</span> {userInfo?.email}
              </p>
            </div>
          </div>

          {/* Order History */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Order History
            </h1>

            {loading ? (
              <p className="text-gray-600">Loading your orders...</p>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <p className="text-lg text-gray-500">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
                        DATE
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
                        TOTAL
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
                        PAID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">
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
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-gray-700">
                              {order?._id?.substring(0, 10)}...
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {order?.createdAt?.substring(0, 10)}
                            </td>
                            <td className="px-4 py-3 text-gray-700 font-semibold">
                              ${order?.totalPrice?.toFixed(2)}
                            </td>
                            <td
                              className={`px-4 py-3 font-semibold ${
                                order?.isPaid
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {order?.isPaid ? "Yes" : "No"}
                            </td>
                            <td
                              className={`px-4 py-3 font-semibold ${
                                order?.isDelivered
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
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
    </div>
  );
};

export default ProfilePage;
