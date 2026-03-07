import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false); // Used to reload the table after a delete

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    // Security Bouncer
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://ecommerce-backend-0cza.onrender.com/api/products",
        );
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, userInfo, refresh]);

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this product?",
      )
    ) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(
          `https://ecommerce-backend-0cza.onrender.com/api/products/${id}`,
          config,
        );
        setRefresh(!refresh); // Instantly reload the table so it vanishes!
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Failed to delete product. (Check your backend routes!)",
        );
      }
    }
  };

  const createProductHandler = async () => {
    if (
      window.confirm("Are you sure you want to create a new sample product?")
    ) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        // This asks the backend to create a blank "Sample" product
        const { data } = await axios.post(
          "https://ecommerce-backend-0cza.onrender.com/api/products",
          {},
          config,
        );

        // Instantly redirect the admin to the edit page to fill in the real details
        navigate(`/admin/product/${data._id}/edit`);
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Failed to create product. (Check your backend routes!)",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Inventory Management
            </h1>
            <button
              onClick={createProductHandler}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              + Create Product
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600 text-lg">Loading inventory...</p>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                    <th className="px-6 py-4 text-left font-semibold">NAME</th>
                    <th className="px-6 py-4 text-left font-semibold">PRICE</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      CATEGORY
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">BRAND</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {product._id.substring(0, 10)}...
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Link to={`/admin/product/${product._id}/edit`}>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
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

export default AdminProductListPage;
