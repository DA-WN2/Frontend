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
        const { data } = await axios.get("http://localhost:5000/api/products");
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
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
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
          "http://localhost:5000/api/products",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #eee",
          paddingBottom: "15px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "32px", margin: 0 }}>Inventory Management</h2>
        <button
          onClick={createProductHandler}
          style={{
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          + Create Product
        </button>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
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
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#222", color: "#fff" }}>
                <th style={{ padding: "15px" }}>ID</th>
                <th style={{ padding: "15px" }}>NAME</th>
                <th style={{ padding: "15px" }}>PRICE</th>
                <th style={{ padding: "15px" }}>CATEGORY</th>
                <th style={{ padding: "15px" }}>BRAND</th>
                <th style={{ padding: "15px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={{ padding: "15px", fontWeight: "bold" }}>
                    {product._id.substring(0, 10)}...
                  </td>
                  <td style={{ padding: "15px" }}>{product.name}</td>
                  <td style={{ padding: "15px" }}>${product.price}</td>
                  <td style={{ padding: "15px" }}>{product.category}</td>
                  <td style={{ padding: "15px" }}>{product.brand}</td>

                  <td style={{ padding: "15px", display: "flex", gap: "10px" }}>
                    {/* Edit Button */}
                    <Link to={`/admin/product/${product._id}/edit`}>
                      <button
                        style={{
                          backgroundColor: "#3498db",
                          color: "#fff",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Edit
                      </button>
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteHandler(product._id)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </button>
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

export default AdminProductListPage;
